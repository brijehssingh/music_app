import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MusicIcon } from "../components/Icons";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="auth-page-container">
      {/* Dynamic ambient floating gradient orbs */}
      <div className="auth-ambient-blob auth-blob-violet" />
      <div className="auth-ambient-blob auth-blob-fuchsia" />
      <div className="auth-ambient-blob auth-blob-cyan" />

      <div className="auth-card grid lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left Hero Visual Side */}
        <div className="auth-hero-mesh relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-violet-600/30 via-[#181326] to-[#0e0c15] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 top-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse" />
          <div className="absolute -left-20 bottom-10 h-56 w-56 rounded-full bg-violet-600/25 blur-3xl" />

          {/* Top Brand & Soundwave Equalizer */}
          <div className="relative flex items-center justify-between">
            <div className="auth-pulse-ring relative grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <MusicIcon className="h-6 w-6 text-violet-200" />
            </div>

            {/* Dynamic Soundwave Equalizer */}
            <div className="flex items-end gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-2 border border-white/10 backdrop-blur-md">
              <span className="soundwave-bar" />
              <span className="soundwave-bar" />
              <span className="soundwave-bar" />
              <span className="soundwave-bar" />
              <span className="soundwave-bar" />
              <span className="soundwave-bar" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative">
            <div className="auth-float-tag inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 mb-4 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-ping" />
              <span className="text-[11px] font-bold tracking-wider text-violet-300 uppercase">Live Music Flow</span>
            </div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-white drop-shadow-sm">
              Your music is waiting.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-300/80 font-normal">
              Sign in to manage your tracks, create playlists, and continue discovering artists on Pulse.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-8 lg:hidden auth-stagger-1">
            <div className="auth-pulse-ring grid h-11 w-11 place-items-center rounded-2xl bg-violet-500/20 border border-violet-400/30">
              <MusicIcon className="h-5 w-5 text-violet-300" />
            </div>
          </div>

          <div className="auth-stagger-1">
            <p className="eyebrow">Account access</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Log in to Pulse</h2>
            <p className="mt-2 text-sm text-zinc-400">Enter the email and password linked to your account.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="error-banner">
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="auth-stagger-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-300">Email address</span>
                <input
                  type="email"
                  className="field"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    clearError();
                    setEmail(event.target.value);
                  }}
                  required
                />
              </label>
            </div>

            <div className="auth-stagger-3">
              <label className="block">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Password</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearError();
                      setForgotModalOpen(true);
                    }}
                    className="text-xs font-semibold text-violet-300 hover:text-violet-200 transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  className="field"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    clearError();
                    setPassword(event.target.value);
                  }}
                  required
                />
              </label>
            </div>

            <div className="auth-stagger-4 pt-2">
              <button type="submit" className="primary-button w-full" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Log in"
                )}
              </button>
            </div>
          </form>

          <p className="auth-stagger-5 mt-8 text-center text-sm text-zinc-400">
            New to Pulse?{" "}
            <Link to="/signup" className="auth-nav-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        initialEmail={email}
        onPasswordResetSuccess={(updatedEmail) => {
          setEmail(updatedEmail);
          setPassword("");
        }}
      />
    </div>
  );
}
