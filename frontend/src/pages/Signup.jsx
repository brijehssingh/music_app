import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MusicIcon, UploadIcon } from "../components/Icons";
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
    <div className="page-container grid min-h-[calc(100vh-72px)] place-items-center py-10">
      <div className="glass-panel grid w-full max-w-4xl overflow-hidden rounded-[2rem] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative hidden overflow-hidden border-r border-white/7 bg-gradient-to-br from-fuchsia-600/20 via-[#19121d] to-[#101016] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
            <MusicIcon className="h-6 w-6 text-fuchsia-200" />
          </div>
          <div className="relative">
            <p className="eyebrow">Join the community</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white">A home for every sound.</h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
              Choose a listener account to explore, or a premium account to share and manage your own music.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <p className="eyebrow">Get started</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Create your account</h2>
          <p className="mt-2 text-sm text-zinc-500">It only takes a minute to join Pulse.</p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {error && <div className="error-banner">{error}</div>}

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-zinc-300">Display name</span>
              <input
                className="field"
                placeholder="Your name"
                autoComplete="name"
                value={data.name}
                onChange={(event) => updateField("name", event.target.value)}
                minLength={2}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-zinc-300">Email address</span>
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

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-zinc-300">Password</span>
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

            <fieldset>
              <legend className="mb-2 text-xs font-bold text-zinc-300">Account type</legend>
              <div className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer rounded-2xl border p-3 transition ${data.user === "normal" ? "border-violet-400/50 bg-violet-500/10" : "border-white/8 bg-white/[0.025]"}`}>
                  <input type="radio" name="user" value="normal" className="sr-only" checked={data.user === "normal"} onChange={(event) => updateField("user", event.target.value)} />
                  <MusicIcon className="h-5 w-5 text-violet-300" />
                  <span className="mt-2 block text-sm font-bold text-white">Listener</span>
                  <span className="mt-1 block text-[11px] text-zinc-500">Discover and play</span>
                </label>
                <label className={`cursor-pointer rounded-2xl border p-3 transition ${data.user === "premium" ? "border-fuchsia-400/50 bg-fuchsia-500/10" : "border-white/8 bg-white/[0.025]"}`}>
                  <input type="radio" name="user" value="premium" className="sr-only" checked={data.user === "premium"} onChange={(event) => updateField("user", event.target.value)} />
                  <UploadIcon className="h-5 w-5 text-fuchsia-300" />
                  <span className="mt-2 block text-sm font-bold text-white">Premium</span>
                  <span className="mt-1 block text-[11px] text-zinc-500">Upload and manage</span>
                </label>
              </div>
            </fieldset>

            <button type="submit" className="primary-button mt-2 w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-violet-300 hover:text-violet-200">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
