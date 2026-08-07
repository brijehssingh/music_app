import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MusicIcon, UploadIcon } from "../components/Icons";
import { useAuthStore } from "../store/authStore";
import { useSongStore } from "../store/songStore";

export default function Upload() {
  const { uploadSong, uploadProgress, error, clearError } = useSongStore();
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [music, setMusic] = useState(null);
  const [success, setSuccess] = useState("");
  const fileInput = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");

    if (!music) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("comment", comment);
    formData.append("music", music);

    const result = await uploadSong(formData);

    if (result.success) {
      setSuccess("Your song is live on Pulse.");
      setName("");
      setComment("");
      setMusic(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  if (!user) {
    return (
      <div className="page-container grid min-h-[65vh] place-items-center py-12 text-center">
        <div className="glass-panel max-w-lg rounded-[1.75rem] p-8">
          <UploadIcon className="mx-auto h-9 w-9 text-violet-300" />
          <h1 className="mt-5 text-2xl font-black text-white">Log in to upload</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">You need a premium Pulse account before you can share a song.</p>
          <Link to="/login" className="primary-button mt-6">Log in</Link>
        </div>
      </div>
    );
  }

  if (user.user !== "premium") {
    return (
      <div className="page-container grid min-h-[65vh] place-items-center py-12 text-center">
        <div className="glass-panel max-w-lg rounded-[1.75rem] p-8">
          <MusicIcon className="mx-auto h-9 w-9 text-fuchsia-300" />
          <h1 className="mt-5 text-2xl font-black text-white">Premium access required</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">Song uploads are available to premium accounts. Your listener account can still explore and play every public track.</p>
          <Link to="/" className="secondary-button mt-6">Explore artists</Link>
        </div>
      </div>
    );
  }

  const uploading = uploadProgress > 0;

  return (
    <div className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Creator studio</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Share a new track</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">Add the song details and choose an audio file up to 25 MB.</p>

        <form onSubmit={handleSubmit} className="glass-panel mt-8 space-y-5 rounded-[1.75rem] p-6 sm:p-8">
          {error && <div className="error-banner">{error}</div>}
          {success && <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</div>}

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-zinc-300">Song name</span>
            <input className="field" placeholder="Give your track a title" value={name} onChange={(event) => { clearError(); setSuccess(""); setName(event.target.value); }} maxLength={100} required />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-zinc-300">Audio file</span>
            <span className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-white/[0.025] p-5 text-center transition hover:border-violet-400/40 hover:bg-violet-500/5">
              <UploadIcon className="h-7 w-7 text-violet-300" />
              <span className="mt-3 text-sm font-bold text-white">{music ? music.name : "Choose an audio file"}</span>
              <span className="mt-1 text-xs text-zinc-500">MP3, WAV, M4A, or OGG · max 25 MB</span>
              <input ref={fileInput} type="file" className="sr-only" accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/ogg" onChange={(event) => { clearError(); setSuccess(""); setMusic(event.target.files?.[0] || null); }} required />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-zinc-300">Description <span className="font-normal text-zinc-600">(optional)</span></span>
            <textarea className="field !h-28 resize-none !py-3" placeholder="Tell listeners something about this track" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={300} />
          </label>

          {uploading && (
            <div>
              <div className="mb-2 flex justify-between text-xs font-semibold text-zinc-400">
                <span>{uploadProgress < 100 ? "Uploading" : "Processing"}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/6">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <button type="submit" className="primary-button w-full" disabled={uploading || !music}>
            <UploadIcon className="h-4 w-4" /> {uploading ? "Uploading track..." : "Publish track"}
          </button>
        </form>
      </div>
    </div>
  );
}
