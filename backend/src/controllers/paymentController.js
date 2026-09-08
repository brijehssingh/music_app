import "dotenv/config";
import crypto from "crypto";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import paymentModel from "../models/payment.js";

// Helper: Safely verify & decode user JWT token with try-catch
function readToken(req) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            const error = new Error("Please log in first");
            error.status = 401;
            throw error;
        }

        if (!process.env.JWT_SECRET) {
            const error = new Error("JWT_SECRET is missing in backend .env");
            error.status = 500;
            throw error;
        }

        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            error.status = 401;
            error.message = "Your session has expired. Please log in again.";
        }
        throw error;
    }
}

// Helper: Extract safe user fields for frontend response
function safeUser(user) {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        user: user.user,
    };
}

// Helper: Initialize Razorpay instance with try-catch
function getRazorpayInstance() {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID?.trim();
        const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

        if (!keyId || !keySecret) {
            const error = new Error(
                "Razorpay credentials missing in backend/.env. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
            );
            error.status = 500;
            throw error;
        }

        return new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    } catch (error) {
        throw error;
    }
}

// 1. Create Razorpay Order
export async function createOrder(req, res) {
    try {
        // Step A: Read and verify user authentication token
        let decoded;
        try {
            decoded = readToken(req);
        } catch (authError) {
            return res.status(authError.status || 401).json({
                success: false,
                message: authError.message,
            });
        }

        // Step B: Check user status in database
        let user;
        try {
            user = await userModel.findById(decoded.user_id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            if (user.user === "premium") {
                return res.status(400).json({
                    success: false,
                    message: "You already have a Premium account",
                });
            }
        } catch (dbError) {
            return res.status(500).json({
                success: false,
                message: "Database error while verifying user",
            });
        }

        // Step C: Initialize Razorpay instance
        let razorpay;
        try {
            razorpay = getRazorpayInstance();
        } catch (configError) {
            return res.status(configError.status || 500).json({
                success: false,
                message: configError.message,
            });
        }

        // Step D: Create order with Razorpay
        const amount = Number(process.env.PREMIUM_PLAN_PRICE || 10000);
        const options = {
            amount,
            currency: "INR",
            receipt: `rcpt_${String(decoded.user_id).slice(-6)}_${Date.now()}`,
            notes: {
                userId: String(decoded.user_id),
                userEmail: user.email,
                plan: "pulse_premium_artist",
            },
        };

        let order;
        try {
            order = await razorpay.orders.create(options);
        } catch (rzpError) {
            console.error("Razorpay order creation API error:", rzpError);
            return res.status(502).json({
                success: false,
                message:
                    rzpError.error?.description ||
                    "Razorpay failed to create order. Verify your API keys.",
            });
        }

        // Step E: Save initial payment record in MongoDB
        try {
            await paymentModel.create({
                userId: decoded.user_id,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                status: "created",
            });
        } catch (saveError) {
            console.error("Payment order DB save error:", saveError.message);
            // Still return order details so user isn't blocked if DB audit insert failed
        }

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID?.trim(),
        });
    } catch (error) {
        console.error("Unexpected error in createOrder:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create payment order",
        });
    }
}

// 2. Cryptographic Signature Verification
export async function verifyPayment(req, res) {
    try {
        // Step A: Verify user authentication token
        let decoded;
        try {
            decoded = readToken(req);
        } catch (authError) {
            return res.status(authError.status || 401).json({
                success: false,
                message: authError.message,
            });
        }

        // Step B: Validate environment secret
        const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
        if (!keySecret) {
            return res.status(500).json({
                success: false,
                message: "RAZORPAY_KEY_SECRET is not configured in backend/.env",
            });
        }

        // Step C: Validate incoming payment payload
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing required payment verification details",
            });
        }

        // Step D: Cryptographic verification of HMAC SHA256
        let isAuthentic = false;
        try {
            const expectedSignature = crypto
                .createHmac("sha256", keySecret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");

            isAuthentic = expectedSignature === razorpay_signature;
        } catch (cryptoError) {
            console.error("HMAC verification error:", cryptoError);
            return res.status(500).json({
                success: false,
                message: "Error calculating payment signature",
            });
        }

        if (!isAuthentic) {
            try {
                await paymentModel.findOneAndUpdate(
                    { orderId: razorpay_order_id },
                    { status: "failed" }
                );
            } catch { }

            return res.status(400).json({
                success: false,
                message:
                    "Payment verification failed: Signature mismatch or tampering detected",
            });
        }

        // Step E: Update payment status to paid & upgrade user
        try {
            await paymentModel.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                    status: "paid",
                }
            );

            const updatedUser = await userModel.findByIdAndUpdate(
                decoded.user_id,
                { user: "premium" },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User account not found to upgrade",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully! Welcome to Premium.",
                user: safeUser(updatedUser),
            });
        } catch (updateError) {
            console.error("Database update error post-payment:", updateError);
            return res.status(500).json({
                success: false,
                message: "Payment was successful, but account upgrade encountered an issue. Please contact support.",
            });
        }
    } catch (error) {
        console.error("Unexpected error in verifyPayment:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Payment verification failed",
        });
    }
}
