import { useNavigate } from "react-router-dom";
import { PlayIcon, TrashIcon } from "./Icons";

const coverImage =
  "https://images.pexels.com/photos/21088/music-record-player-b-w-black-and-white-21088.jpg?auto=compress&cs=tinysrgb&w=900";

export default function SongCard({ song, showDelete = false, deleteSong }) {
  const navigate = useNavigate();

  const openPlayer = () => {
    navigate("/player", { state: song });
  };

  const handleDelete = async (event) => {
    event.stopPropagation();

    if (!window.confirm(`Delete “${song.name}”?`)) {
      return;
    }

    await deleteSong(song._id);
  };

  return (
    <article
      onClick={openPlayer}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          openPlayer();
        }
      }}
      tabIndex={0}
      role="button"
      className="group relative cursor-pointer overflow-hidden rounded-[1.35rem] border border-white/7 bg-[#131319] p-3 shadow-xl shadow-black/15 transition duration-300 hover:-translate-y-1.5 hover:border-violet-400/25 hover:bg-[#17171f] hover:shadow-violet-950/20"
    >
      <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-zinc-900">
        <img
          src={song.cover || coverImage}
          alt={`${song.name} cover`}
          className="h-full w-full object-cover grayscale-[20%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute right-3 bottom-3 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 shadow-2xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <PlayIcon className="ml-0.5 h-5 w-5" />
        </div>
      </div>

      <div className="px-1 pt-4 pb-2">
        <h2 className="truncate text-[15px] font-bold text-zinc-100">{song.name}</h2>
        <p className="mt-1 min-h-5 truncate text-xs text-zinc-500">
          {song.comment || "A fresh track on Pulse"}
        </p>
      </div>

      {showDelete && (
        <button
          type="button"
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/15 bg-rose-500/8 py-2.5 text-xs font-bold text-rose-300 transition hover:border-rose-400/25 hover:bg-rose-500/14"
          onClick={handleDelete}
        >
          <TrashIcon className="h-4 w-4" /> Delete song
        </button>
      )}
    </article>
  );
}
