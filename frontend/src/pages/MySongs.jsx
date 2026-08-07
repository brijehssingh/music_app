import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LibraryIcon, UploadIcon } from "../components/Icons";
import SongCard from "../components/SongCard";
import { useAuthStore } from "../store/authStore";
import { useSongStore } from "../store/songStore";

export default function MySongs() {
  const { mySongs, getSongs, deleteSong, loading, error } = useSongStore();
  const { user, checkingAuth } = useAuthStore();

  useEffect(() => {
    if (user) {
      getSongs();
    }
  }, [getSongs, user]);

  if (checkingAuth) {
    return <div className="page-container min-h-[60vh] animate-pulse py-12"><div className="h-10 w-52 rounded-xl bg-white/5" /></div>;
  }

  if (!user) {
    return (
      <div className="page-container grid min-h-[65vh] place-items-center py-12 text-center">
        <div className="glass-panel max-w-lg rounded-[1.75rem] p-8">
          <LibraryIcon className="mx-auto h-9 w-9 text-violet-300" />
          <h1 className="mt-5 text-2xl font-black text-white">Your library needs an account</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">Log in to view and manage the songs connected to your profile.</p>
          <Link to="/login" className="primary-button mt-6">Log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-16 pt-10 sm:pt-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your library</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">My uploaded songs</h1>
          <p className="mt-3 text-sm text-zinc-500">Play, review, or remove the tracks you have shared.</p>
        </div>
        {user.user === "premium" && (
          <Link to="/upload" className="primary-button">
            <UploadIcon className="h-4 w-4" /> Upload new song
          </Link>
        )}
      </div>

      {error && <div className="error-banner mt-7">{error}</div>}

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[0.75] animate-pulse rounded-[1.35rem] bg-white/[0.035]" />
          ))}
        </div>
      ) : mySongs.length === 0 ? (
        <div className="glass-panel mt-8 rounded-[1.75rem] px-6 py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/10">
            <LibraryIcon className="h-6 w-6 text-violet-300" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-white">No songs here yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            {user.user === "premium"
              ? "Upload your first track and it will appear in your personal library."
              : "Listener accounts do not upload tracks, but you can discover music from the home page."}
          </p>
          {user.user === "premium" && <Link to="/upload" className="primary-button mt-6">Upload first song</Link>}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {mySongs.map((song) => (
            <SongCard key={song._id} song={song} showDelete deleteSong={deleteSong} />
          ))}
        </div>
      )}
    </div>
  );
}
