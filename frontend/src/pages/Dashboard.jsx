import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowIcon, MusicIcon, PlayIcon, UploadIcon } from "../components/Icons";
import { useAuthStore } from "../store/authStore";
import { useSongStore } from "../store/songStore";

export default function Dashboard() {
  const { artists, getArtists, loading, error } = useSongStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    getArtists();
  }, [getArtists]);

  return (
    <div className="page-container pb-16 pt-8 sm:pt-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#121218] px-6 py-12 shadow-2xl shadow-black/25 sm:px-10 sm:py-16 lg:px-16">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute right-[8%] top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full border border-white/7 lg:block" />
        <div className="absolute right-[12%] top-1/2 hidden h-52 w-52 -translate-y-1/2 rounded-full border border-white/8 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/10 shadow-[0_0_80px_rgba(124,92,255,0.18)] lg:grid lg:place-items-center">
          <MusicIcon className="h-20 w-20 text-violet-200/80" />
        </div>

        <div className="relative max-w-2xl">
          <p className="eyebrow">Your sound. Your space.</p>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl">
            Find your next
            <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent">
              favorite sound.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            Discover independent artists, play fresh tracks, and keep your own music in one beautifully simple place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="primary-button"
              onClick={() => document.getElementById("artists")?.scrollIntoView()}
            >
              <PlayIcon className="h-4 w-4" /> Start listening
            </button>
            {user?.user === "premium" ? (
              <Link to="/upload" className="secondary-button">
                <UploadIcon className="h-4 w-4" /> Upload a track
              </Link>
            ) : !user ? (
              <Link to="/signup" className="secondary-button">
                Create free account <ArrowIcon className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section id="artists" className="scroll-mt-28 pt-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Made to discover</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Featured artists</h2>
            <p className="mt-2 text-sm text-zinc-500">Open an artist collection and explore every track.</p>
          </div>
          {artists.length > 0 && (
            <span className="hidden rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-semibold text-zinc-400 sm:block">
              {artists.length} {artists.length === 1 ? "artist" : "artists"}
            </span>
          )}
        </div>

        {error && <div className="error-banner mb-6">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-[1.35rem] border border-white/6 bg-white/[0.025] p-3">
                <div className="aspect-square rounded-2xl bg-white/5" />
                <div className="mt-4 h-4 w-3/4 rounded bg-white/5" />
                <div className="mt-2 h-3 w-1/2 rounded bg-white/[0.035]" />
              </div>
            ))}
          </div>
        ) : artists.length === 0 ? (
          <div className="glass-panel rounded-[1.5rem] px-6 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/10 text-violet-300">
              <MusicIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">The stage is ready</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Artists will appear here as soon as the first premium member uploads a song.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {artists.map((artist, index) => (
              <button
                type="button"
                key={artist._id}
                onClick={() =>
                  navigate(`/album/${artist._id}`, {
                    state: { artistName: artist.artistName },
                  })
                }
                className="group rounded-[1.35rem] border border-white/7 bg-[#131319] p-3 text-left transition duration-300 hover:-translate-y-1.5 hover:border-violet-400/25 hover:bg-[#17171f]"
              >
                <div className={`relative grid aspect-square place-items-center overflow-hidden rounded-[1rem] bg-gradient-to-br ${
                  [
                    "from-violet-500/80 to-indigo-900",
                    "from-fuchsia-500/70 to-purple-950",
                    "from-cyan-500/60 to-slate-950",
                    "from-rose-500/70 to-orange-950",
                    "from-emerald-500/60 to-teal-950",
                  ][index % 5]
                }`}>
                  <span className="text-5xl font-black text-white/75 sm:text-6xl">
                    {artist.artistName?.charAt(0).toUpperCase() || "A"}
                  </span>
                  <div className="absolute right-3 bottom-3 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100">
                    <PlayIcon className="ml-0.5 h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-4 truncate px-1 text-[15px] font-bold text-white">{artist.artistName || "Unknown artist"}</h3>
                <p className="mt-1 px-1 pb-1 text-xs text-zinc-500">
                  {artist.songsCount || 0} {artist.songsCount === 1 ? "track" : "tracks"}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
