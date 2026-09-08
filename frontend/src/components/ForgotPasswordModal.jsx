import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "../store/authStore";
import { CheckIcon, CloseIcon, MusicIcon } from "./Icons";

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail = "",
  onPasswordResetSuccess,
}) {
  const { forgotPassword, resetPassword } = useAuthStore();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const [prevInitialEmail, setPrevInitialEmail] = useState(initialEmail);
  if (prevInitialEmail !== initialEmail) {
    setPrevInitialEmail(initialEmail);
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setStep(2);
      setCountdown(60);
    } else {
      setError(result.message || "Could not send verification code.");
    }
  };

  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError("");

    if (!otp || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await resetPassword({
      email,
      otp: otp.trim(),
      newPassword,
    });
    setLoading(false);

    if (result.success) {
      setStep(3);
    } else {
      setError(result.message || "Failed to reset password.");
    }
  };

  const handleClose = () => {
    if (loading) return;
    setError("");
    setStep(1);
    setOtp("");
    setNewPassword("");
    onClose();
  };

  const handleFinish = () => {
    if (onPasswordResetSuccess) {
      onPasswordResetSuccess(email);
    }
    handleClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal card */}
      <div className="relative my-auto w-full max-w-md max-h-[92vh] overflow-y-auto rounded-[2rem] border border-white/15 bg-[#14121d] p-6 sm:p-8 shadow-2xl shadow-violet-950/50">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-fuchsia-600/15 blur-3xl" />

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

        {step === 1 && (
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/15 border border-violet-400/25 text-violet-300">
              <MusicIcon className="h-6 w-6" />
            </div>

            <h2
              id="forgot-password-title"
              className="mt-5 text-2xl font-black tracking-tight text-white"
            >
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Enter your account's email address. We will send you a 6-digit
              verification code via our SMTP mail server.
            </p>

            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              {error && (
                <div className="error-banner text-xs">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Email address
                </span>
                <input
                  type="email"
                  className="field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setError("");
                    setEmail(e.target.value);
                  }}
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-button w-full !rounded-xl mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending code via SMTP...
                  </span>
                ) : (
                  "Send verification code"
                )}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300">
              <span>STEP 2 OF 2</span>
            </div>

            <h2
              id="forgot-password-title"
              className="mt-4 text-2xl font-black tracking-tight text-white"
            >
              Enter verification code
            </h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              A 6-digit OTP code was sent to{" "}
              <strong className="text-white">{email}</strong>.
            </p>

            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              {error && (
                <div className="error-banner text-xs">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <label className="block">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    6-Digit OTP Code
                  </span>
                  {countdown > 0 ? (
                    <span className="text-xs text-zinc-500">
                      Resend in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300"
                    >
                      Resend code
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={6}
                  className="field !text-center !text-xl !font-mono !tracking-[0.4em]"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    setError("");
                    setOtp(e.target.value.replace(/\D/g, ""));
                  }}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  New Password
                </span>
                <input
                  type="password"
                  className="field"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setError("");
                    setNewPassword(e.target.value);
                  }}
                  minLength={6}
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-button w-full !rounded-xl mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Resetting password...
                  </span>
                ) : (
                  "Update password"
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  ← Change email address
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="py-4 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/25">
              <CheckIcon className="h-9 w-9" />
            </div>

            <h3 className="mt-5 text-2xl font-black text-white">
              Password reset successful!
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-400">
              Your password has been updated securely. You can now log in using
              your new credentials.
            </p>

            <button
              type="button"
              onClick={handleFinish}
              className="primary-button mt-7 w-full !rounded-xl"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
