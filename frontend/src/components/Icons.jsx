const baseProps = {
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function MusicIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  );
}

export function HomeIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </svg>
  );
}

export function SearchIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export function UploadIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 16V4m0 0L7 9m5-5 5 5" />
      <path d="M5 14v5h14v-5" />
    </svg>
  );
}

export function LibraryIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M4 4h4v16H4zM10 4h4v16h-4zM16 5l3-1 3 15-3 1z" />
    </svg>
  );
}

export function PlayIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8.2 5.4a1 1 0 0 1 1.52-.85l10 6.6a1 1 0 0 1 0 1.7l-10 6.6a1 1 0 0 1-1.52-.85V5.4Z" />
    </svg>
  );
}

export function PauseIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="6" y="4" width="4.5" height="16" rx="1.5" />
      <rect x="13.5" y="4" width="4.5" height="16" rx="1.5" />
    </svg>
  );
}

export function BackIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function TrashIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
    </svg>
  );
}

export function SkipBackIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M5 5v14M19 5 8 12l11 7V5Z" />
    </svg>
  );
}

export function SkipForwardIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M19 5v14M5 5l11 7-11 7V5Z" />
    </svg>
  );
}

export function VolumeIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12" />
    </svg>
  );
}

export function CloseIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function MenuIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function ArrowIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

export function CheckIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

export function SparklesIcon({ className = "" }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="m12 3 1.912 5.885L20 10.5l-6.088 1.615L12 18l-1.912-5.885L4 10.5l6.088-1.615L12 3Z" />
    </svg>
  );
}
