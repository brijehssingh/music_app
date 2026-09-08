import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        orderId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        paymentId: {
            type: String,
            trim: true,
            default: null,
        },
        signature: {
            type: String,
            trim: true,
            default: null,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "INR",
            trim: true,
        },
        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
    },
    {
        timestamps: true,
    }
);

const paymentModel = mongoose.model("payments", paymentSchema);

export default paymentModel;
