import { Link } from "react-router-dom";
import { MusicIcon } from "../components/Icons";

export default function NotFound() {
  return (
    <div className="page-container grid min-h-[65vh] place-items-center py-12 text-center">
      <div className="glass-panel max-w-lg rounded-[1.75rem] p-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/10">
          <MusicIcon className="h-6 w-6 text-violet-300" />
        </div>
        <p className="eyebrow mt-6">404 · Lost track</p>
        <h1 className="mt-3 text-2xl font-black text-white">This page does not exist</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">The link may be old, or the page may have moved somewhere else.</p>
        <Link to="/" className="primary-button mt-6">Back to home</Link>
      </div>
    </div>
  );
}
