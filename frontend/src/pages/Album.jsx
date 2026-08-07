import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BackIcon, MusicIcon, SearchIcon } from "../components/Icons";
import SongCard from "../components/SongCard";
import { useSongStore } from "../store/songStore";

export default function Album() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { artistSongs, getArtistSongs, loading, error } = useSongStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getArtistSongs(id);
  }, [getArtistSongs, id]);

  const filteredSongs = artistSongs.filter((song) =>
    song.name.toLowerCase().includes(search.toLowerCase()),
  );

  const artistName = location.state?.artistName || "Artist collection";

  return (
    <div className="page-container pb-16 pt-8 sm:pt-12">
      <button type="button" onClick={() => navigate(-1)} className="secondary-button !min-h-10 !px-3 !text-sm">
        <BackIcon className="h-4 w-4" /> Back
      </button>

      <section className="mt-6 flex flex-col gap-6 rounded-[1.75rem] border border-white/7 bg-gradient-to-br from-violet-500/15 via-[#15151d] to-[#101015] p-6 sm:flex-row sm:items-end sm:p-9">
        <div className="grid h-28 w-28 shrink-0 place-items-center rounded-[1.5rem] bg-gradient-to-br from-violet-500 to-fuchsia-800 shadow-2xl shadow-violet-950/30 sm:h-36 sm:w-36">
          <span className="text-6xl font-black text-white/80">{artistName.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <p className="eyebrow">Artist</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">{artistName}</h1>
          <p className="mt-3 text-sm text-zinc-400">
            {artistSongs.length} {artistSongs.length === 1 ? "track" : "tracks"} in this collection
          </p>
        </div>
      </section>

      <div className="relative mt-8">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          placeholder="Search this collection..."
          className="field !h-14 !pl-12"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error && <div className="error-banner mt-6">{error}</div>}

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[0.8] animate-pulse rounded-[1.35rem] bg-white/[0.035]" />
          ))}
        </div>
      ) : filteredSongs.length === 0 ? (
        <div className="glass-panel mt-8 rounded-[1.5rem] px-6 py-14 text-center">
          <MusicIcon className="mx-auto h-8 w-8 text-zinc-600" />
          <h2 className="mt-4 text-lg font-bold text-white">No songs found</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {search ? "Try another search term." : "This artist has no uploaded songs yet."}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {filteredSongs.map((song) => <SongCard key={song._id} song={song} />)}
        </div>
      )}
    </div>
  );
}
