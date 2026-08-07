import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const coverImage =
  "https://images.pexels.com/photos/21088/music-record-player-b-w-black-and-white-21088.jpg?auto=compress&cs=tinysrgb&w=1200";

export default function Player() {
  const location = useLocation();
  const navigate = useNavigate();

  const [audioError, setAudioError] = useState("");

  let savedSong = null;

  try {
    savedSong = JSON.parse(
      sessionStorage.getItem("pulse-current-song"),
    );
  } catch {
    savedSong = null;
  }

  const song = location.state || savedSong;

  useEffect(() => {
    if (location.state) {
      sessionStorage.setItem(
        "pulse-current-song",
        JSON.stringify(location.state),
      );
    }
  }, [location.state]);

  useEffect(() => {
    setAudioError("");
  }, [song?._id, song?.url]);

  const handleAudioError = (event) => {
    const mediaError = event.currentTarget.error;

    if (!mediaError) {
      setAudioError("Audio could not be loaded.");
      return;
    }

    const errorMessages = {
      1: "Audio playback was stopped.",
      2: "The audio could not be downloaded.",
      3: "The audio file is damaged or cannot be decoded.",
      4: "This audio format or URL is not supported.",
    };

    setAudioError(
      errorMessages[mediaError.code] ||
        "Audio could not be played.",
    );

    console.error("Audio playback error:", {
      code: mediaError.code,
      message: mediaError.message,
      url: song?.url,
      mimeType: song?.mimeType,
    });
  };

  if (!song) {
    return (
      <div className="page-container grid min-h-[70vh] place-items-center px-4 py-10">
        <div className="glass-panel w-full max-w-md rounded-[2rem] p-8 text-center">
          <h1 className="text-3xl font-black text-white">
            No song selected
          </h1>

          <p className="mt-3 text-zinc-500">
            Select a song before opening the player.
          </p>

          <button
            type="button"
            className="secondary-button mt-6"
            onClick={() => navigate("/")}
          >
            Go to songs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen px-2 py-4 sm:px-4">
      <button
        type="button"
        className="secondary-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="mx-auto mt-10 w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#111117] p-6 shadow-2xl shadow-black/40 sm:p-8">
        <div className="aspect-square overflow-hidden rounded-[2rem] bg-zinc-900">
          <img
            src={song.cover || coverImage}
            alt={`${song.name} cover`}
            className="h-full w-full object-cover grayscale-[25%]"
          />
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-300">
            Now playing
          </p>

          <h1 className="mt-5 text-4xl font-black text-white">
            {song.name}
          </h1>

          <p className="mt-3 text-zinc-500">
            {song.comment || "A fresh track on Pulse"}
          </p>
        </div>

        {!song.url && (
          <div className="mt-8 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-200">
            This song does not contain an audio URL.
          </div>
        )}

        {audioError && (
          <div className="mt-8 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-200">
            {audioError}
          </div>
        )}

        {song.url && (
          <>
            <audio
              key={song._id || song.url}
              controls
              preload="metadata"
              className="mt-10 w-full"
              onLoadStart={() => setAudioError("")}
              onCanPlay={() => setAudioError("")}
              onError={handleAudioError}
            >
              <source
                src={song.url}
                type={song.mimeType || "audio/mpeg"}
              />

              Your browser does not support audio playback.
            </audio>

            <a
              href={song.url}
              target="_blank"
              rel="noreferrer"
              className="secondary-button mt-6 flex w-full justify-center"
            >
              Open audio URL
            </a>
          </>
        )}
      </div>
    </div>
  );
}