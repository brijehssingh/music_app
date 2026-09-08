import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuthStore } from "../store/authStore";
import { CheckIcon, CloseIcon, SparklesIcon, UploadIcon } from "./Icons";

export default function UpgradeModal({ isOpen, onClose }) {
  const { user, upgradeToPremium } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setError("");
    setLoading(true);

    try {
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout SDK is still loading. Please check your internet connection and try again."
        );
      }

      // 1. Create order on backend
      const { data } = await API.post("/payment/create-order");

      if (!data?.success || !data.orderId) {
        throw new Error(data?.message || "Could not generate payment order");
      }

      // 2. Configure Razorpay options
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Pulse Music",
        description: "Lifetime Premium Artist Access",
        image: "https://cdn-icons-png.flaticon.com/512/3844/3844724.png",
        order_id: data.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#7c5cff",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response) => {
          try {
            setLoading(true);
            // 3. Cryptographic verification on backend
            const verifyRes = await API.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              upgradeToPremium(verifyRes.data.user);
              setSuccess(true);
            } else {
              throw new Error(
                verifyRes.data?.message || "Payment verification failed"
              );
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            setError(
              verifyErr.response?.data?.message ||
                verifyErr.message ||
                "Verification failed"
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (failedRes) => {
        console.error("Razorpay payment failed:", failedRes.error);
        setError(
          failedRes.error?.description || "Payment failed. Please try again."
        );
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Initiate payment error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to initiate payment"
      );
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setError("");
    setSuccess(false);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative my-auto w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-[2rem] border border-white/15 bg-[#14121d] p-6 sm:p-8 shadow-2xl shadow-violet-950/50">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-fuchsia-600/20 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute top-5 right-5 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Close modal"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        {success ? (
          <div className="relative py-4 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/25">
              <CheckIcon className="h-9 w-9" />
            </div>

            <h3 className="mt-5 text-2xl font-black text-white">
              You are now a Premium Artist!
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-400">
              Your account has been upgraded successfully. You now have full access to upload
              tracks, appear on the featured stage, and manage your catalogue.
            </p>

            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate("/upload");
              }}
              className="primary-button mt-7 w-full !rounded-xl"
            >
              Start Uploading Songs
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Header Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300">
              <SparklesIcon className="h-3.5 w-3.5 text-violet-400" />
              <span>PREMIUM ARTIST PASS</span>
            </div>

            <h2
              id="upgrade-modal-title"
              className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl"
            >
              Share your sound with the world.
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Unlock artist features with a one-time upgrade. No recurring fees.
            </p>

            {/* Price Box */}
            <div className="mt-5 flex items-baseline gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <span className="text-3xl font-black text-white">₹99</span>
              <span className="text-xs font-semibold text-zinc-400">
                / one-time lifetime access
              </span>
              <span className="ml-auto rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/20">
                LIFETIME
              </span>
            </div>

            {/* Features Checklist */}
            <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
              <li className="flex items-center gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20 text-violet-300">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span>Upload tracks in MP3, WAV, M4A, or OGG up to 25 MB</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20 text-violet-300">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span>Dedicated public artist page & searchable collections</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20 text-violet-300">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span>Featured placement on Pulse discover stage</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20 text-violet-300">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span>Manage and remove your uploaded songs anytime</span>
              </li>
            </ul>

            {error && (
              <div className="error-banner mt-5">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="primary-button mt-6 w-full !rounded-xl"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Connecting to Razorpay...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <UploadIcon className="h-4 w-4" /> Unlock Premium for ₹99
                </span>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-zinc-500">
              Secured by Razorpay · Supports UPI (PhonePe, GPay), Cards, Netbanking
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
