import { useEffect, useRef, useState } from "react";
import { useSongStore } from "../store/songStore";
import {
  CloseIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
} from "./Icons";

const coverImage =
  "https://images.pexels.com/photos/21088/music-record-player-b-w-black-and-white-21088.jpg?auto=compress&cs=tinysrgb&w=500";

export default function MusicPlayer() {
  const { currentSong, stopSong } = useSongStore();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.85);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return undefined;

    const updateProgress = () => {
      const percent = audio.duration
        ? (audio.currentTime / audio.duration) * 100
        : 0;
      setProgress(Number.isFinite(percent) ? percent : 0);
    };

    const resetPlayer = () => {
      setProgress(0);
      setPlaying(false);
    };
    const finishPlaying = () => setPlaying(false);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", resetPlayer);
    audio.addEventListener("ended", finishPlaying);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", resetPlayer);
      audio.removeEventListener("ended", finishPlaying);
    };
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!currentSong) return null;

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const skip = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime + seconds, 0);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#17171e]/95 shadow-[0_24px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:inset-x-6">
      <div className="h-1 bg-white/5">
        <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-[width]" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center gap-3 px-3 py-3 sm:gap-5 sm:px-5">
        <img src={currentSong.cover || coverImage} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover sm:h-14 sm:w-14" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-white">{currentSong.name}</h2>
          <p className="mt-1 truncate text-xs text-zinc-500">{currentSong.comment || "Playing on Pulse"}</p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" onClick={() => skip(-10)} className="hidden h-9 w-9 place-items-center rounded-full text-zinc-400 hover:bg-white/5 hover:text-white sm:grid" aria-label="Back 10 seconds">
            <SkipBackIcon className="h-4 w-4" />
          </button>
          <button type="button" onClick={togglePlay} className="grid h-11 w-11 place-items-center rounded-full bg-white text-black" aria-label={playing ? "Pause" : "Play"}>
            {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="ml-0.5 h-4 w-4" />}
          </button>
          <button type="button" onClick={() => skip(10)} className="hidden h-9 w-9 place-items-center rounded-full text-zinc-400 hover:bg-white/5 hover:text-white sm:grid" aria-label="Forward 10 seconds">
            <SkipForwardIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden w-28 items-center gap-2 md:flex">
          <VolumeIcon className="h-4 w-4 text-zinc-500" />
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="range range-xs w-full text-violet-400" aria-label="Volume" />
        </div>

        <button type="button" onClick={stopSong} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-zinc-500 hover:bg-white/5 hover:text-white" aria-label="Close player">
          <CloseIcon className="h-4 w-4" />
        </button>

        <audio key={currentSong._id || currentSong.url} ref={audioRef} src={currentSong.url} preload="metadata" />
      </div>
    </div>
  );
}
