import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  CloseIcon,
  HomeIcon,
  LibraryIcon,
  MenuIcon,
  MusicIcon,
  SparklesIcon,
  UploadIcon,
} from "./Icons";
import UpgradeModal from "./UpgradeModal";

const navClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-white/8 text-white"
      : "text-zinc-400 hover:bg-white/5 hover:text-white"
  }`;

export default function Navbar() {
  const { user, checkingAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-[#0b0b10]/80 backdrop-blur-2xl">
      <div className="page-container flex h-[72px] items-center justify-between gap-5">
        <Link to="/" className="group flex items-center gap-3" onClick={closeMenu}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20 transition group-hover:scale-105">
            <MusicIcon className="h-5 w-5 text-white" />
          </span>
          <span>
            <span className="block text-[15px] font-black tracking-tight text-white">Pulse</span>
            <span className="block text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">Music</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <NavLink to="/" className={navClass}>
            <HomeIcon className="h-4 w-4" /> Home
          </NavLink>
          {user && (
            <NavLink to="/mysongs" className={navClass}>
              <LibraryIcon className="h-4 w-4" /> My songs
            </NavLink>
          )}
          {user?.user === "premium" && (
            <NavLink to="/upload" className={navClass}>
              <UploadIcon className="h-4 w-4" /> Upload
            </NavLink>
          )}
        </nav>

        <div className="hidden min-w-[178px] justify-end md:flex">
          {checkingAuth ? (
            <div className="h-10 w-32 animate-pulse rounded-xl bg-white/5" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {user.user !== "premium" && (
                <button
                  type="button"
                  onClick={() => setUpgradeOpen(true)}
                  className="primary-button !min-h-9 !rounded-xl !px-3 !py-1 !text-xs !bg-gradient-to-r !from-amber-400 !via-fuchsia-500 !to-violet-600 shadow-md shadow-fuchsia-500/25"
                >
                  <SparklesIcon className="h-3.5 w-3.5" /> Go Premium
                </button>
              )}
              <div className="grid h-9 w-9 place-items-center rounded-full border border-violet-400/20 bg-violet-500/12 text-sm font-bold text-violet-200">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-right lg:block">
                <p className="max-w-28 truncate text-sm font-semibold text-white">{user.name}</p>
                <p className="text-[10px] font-bold tracking-wider text-violet-300 uppercase">
                  {user.user || "normal"}
                </p>
              </div>
              <Link to="/logout" className="secondary-button !min-h-9 !px-3 !text-xs">
                Log out
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-zinc-300 hover:text-white">
                Log in
              </Link>
              <Link to="/signup" className="primary-button !min-h-10 !rounded-xl !px-4 !py-2 !text-sm">
                Get started
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/4 text-zinc-300 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="page-container border-t border-white/6 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <NavLink to="/" className={navClass} onClick={closeMenu}>
              <HomeIcon className="h-4 w-4" /> Home
            </NavLink>
            {user && (
              <NavLink to="/mysongs" className={navClass} onClick={closeMenu}>
                <LibraryIcon className="h-4 w-4" /> My songs
              </NavLink>
            )}
            {user?.user === "premium" && (
              <NavLink to="/upload" className={navClass} onClick={closeMenu}>
                <UploadIcon className="h-4 w-4" /> Upload
              </NavLink>
            )}
          </nav>

          <div className="mt-3 border-t border-white/6 pt-3">
            {user ? (
              <div>
                {user.user !== "premium" && (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      setUpgradeOpen(true);
                    }}
                    className="primary-button mb-3 w-full !min-h-10 !text-xs !bg-gradient-to-r !from-amber-400 !via-fuchsia-500 !to-violet-600"
                  >
                    <SparklesIcon className="h-3.5 w-3.5" /> Unlock Premium Artist Access
                  </button>
                )}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-zinc-200">{user.name}</span>
                  <Link to="/logout" className="secondary-button !min-h-9 !text-xs" onClick={closeMenu}>
                    Log out
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="secondary-button" onClick={closeMenu}>Log in</Link>
                <Link to="/signup" className="primary-button !min-h-11" onClick={closeMenu}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </header>
  );
}
