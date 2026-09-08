import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MusicIcon } from "../components/Icons";
import { useAuthStore } from "../store/authStore";

export default function Signup() {
  const { signup, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    user: "normal",
  });

  const updateField = (field, value) => {
    clearError();
    setData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await signup(data);

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
        <div className="auth-hero-mesh relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-fuchsia-600/25 via-[#1a1222] to-[#0e0c15] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl animate-pulse" />
          <div className="absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-fuchsia-600/25 blur-3xl" />

          {/* Top Brand & Soundwave Equalizer */}
          <div className="relative flex items-center justify-between">
            <div className="auth-pulse-ring relative grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <MusicIcon className="h-6 w-6 text-fuchsia-200" />
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
            <div className="auth-float-tag inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 mb-4 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-ping" />
              <span className="text-[11px] font-bold tracking-wider text-fuchsia-300 uppercase">Creator & Listener Hub</span>
            </div>
            <p className="eyebrow">Join the community</p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-white drop-shadow-sm">
              A home for every sound.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-300/80 font-normal">
              Choose a listener account to explore, or a premium creator account to share, stream, and manage your own tracks.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-6 lg:hidden auth-stagger-1">
            <div className="auth-pulse-ring grid h-11 w-11 place-items-center rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/30">
              <MusicIcon className="h-5 w-5 text-fuchsia-300" />
            </div>
          </div>

          <div className="auth-stagger-1">
            <p className="eyebrow">Get started</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Create your account</h2>
            <p className="mt-2 text-sm text-zinc-400">It only takes a minute to join Pulse.</p>
          </div>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="error-banner">
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="auth-stagger-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-300">Display name</span>
                <input
                  className="field"
                  placeholder="Your artist or listener name"
                  autoComplete="name"
                  value={data.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  minLength={2}
                  required
                />
              </label>
            </div>

            <div className="auth-stagger-3">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-300">Email address</span>
                <input
                  type="email"
                  className="field"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={data.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />
              </label>
            </div>

            <div className="auth-stagger-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-300">Password</span>
                <input
                  type="password"
                  className="field"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  value={data.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  minLength={6}
                  required
                />
              </label>
            </div>

            <div className="auth-stagger-5">
              <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-300">
                    <MusicIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Listener Account</p>
                    <p className="text-xs text-zinc-400">Stream tracks & discover artists (Upgrade to upload anytime)</p>
                  </div>
                </div>
                <span className="rounded-full bg-violet-500/10 border border-violet-400/20 px-2.5 py-1 text-[11px] font-bold text-violet-300">FREE</span>
              </div>
            </div>

            <div className="auth-stagger-6 pt-2">
              <button type="submit" className="primary-button w-full" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

          <p className="auth-stagger-6 mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="auth-nav-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
