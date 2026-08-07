import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MusicIcon } from "../components/Icons";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="page-container grid min-h-[calc(100vh-72px)] place-items-center py-10">
      <div className="glass-panel grid w-full max-w-4xl overflow-hidden rounded-[2rem] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative hidden overflow-hidden border-r border-white/7 bg-gradient-to-br from-violet-600/25 via-[#17121f] to-[#101016] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 top-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
            <MusicIcon className="h-6 w-6 text-violet-200" />
          </div>
          <div className="relative">
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white">
              Your music is waiting.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
              Sign in to manage your tracks and continue discovering artists on Pulse.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 lg:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-500/15">
              <MusicIcon className="h-5 w-5 text-violet-300" />
            </div>
          </div>
          <p className="eyebrow">Account access</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Log in to Pulse</h2>
          <p className="mt-2 text-sm text-zinc-500">Enter the email and password linked to your account.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && <div className="error-banner">{error}</div>}

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-zinc-300">Email address</span>
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

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-zinc-300">Password</span>
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

            <button type="submit" className="primary-button w-full" disabled={loading}>
              {loading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-zinc-500">
            New to Pulse?{" "}
            <Link to="/signup" className="font-bold text-violet-300 hover:text-violet-200">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
