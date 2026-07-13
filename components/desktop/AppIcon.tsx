"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

export type AppKind =
  | "terminal"
  | "youtube"
  | "github"
  | "x"
  | "linkedin"
  | "instagram"
  | "tiktok";

type AppIconProps = {
  id: string;
  label: string;
  kind: AppKind;
  x: number;
  y: number;
  onOpen: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  className?: string;
  style?: CSSProperties;
};

function TerminalGlyph() {
  return (
    <svg
      width="76"
      height="62"
      viewBox="0 0 76 62"
      className="desktop-app-svg"
      aria-hidden
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="6" y="6" width="64" height="50" fill="#000" opacity="0.2" />
      <rect
        x="3"
        y="3"
        width="64"
        height="50"
        fill="#d8d8d8"
        stroke="#111"
        strokeWidth="1.5"
      />
      <rect x="3" y="3" width="64" height="12" fill="#cfcfcf" stroke="#111" strokeWidth="1.5" />
      <rect x="6" y="6" width="6" height="6" fill="#e8e8e8" stroke="#111" strokeWidth="1" />
      <rect x="14" y="7" width="36" height="4" fill="#dddddd" stroke="#111" strokeWidth="0.75" />
      <rect x="5" y="16" width="60" height="35" fill="#111" />
      <text
        x="9"
        y="30"
        fill="#7dffb3"
        fontFamily="monospace"
        fontSize="8"
        letterSpacing="0.5"
      >
        {">_"}
      </text>
      <rect x="22" y="24" width="18" height="2" fill="#7dffb3" opacity="0.85" />
      <rect x="9" y="36" width="28" height="1.5" fill="#555" />
      <rect x="9" y="42" width="20" height="1.5" fill="#444" />
    </svg>
  );
}

function SocialGlyph({ kind }: { kind: Exclude<AppKind, "terminal"> }) {
  const colors: Record<Exclude<AppKind, "terminal">, { bg: string; fg: string }> = {
    youtube: { bg: "#FF0000", fg: "#fff" },
    github: { bg: "#24292f", fg: "#fff" },
    x: { bg: "#111", fg: "#fff" },
    linkedin: { bg: "#0A66C2", fg: "#fff" },
    instagram: { bg: "#E1306C", fg: "#fff" },
    tiktok: { bg: "#111", fg: "#fff" },
  };
  const c = colors[kind];

  return (
    <svg
      width="76"
      height="62"
      viewBox="0 0 76 62"
      className="desktop-app-svg"
      aria-hidden
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="8" y="8" width="56" height="48" fill="#000" opacity="0.18" />
      <rect
        x="5"
        y="5"
        width="56"
        height="48"
        rx="4"
        fill={c.bg}
        stroke="#111"
        strokeWidth="1.5"
      />
      <rect
        x="7"
        y="7"
        width="52"
        height="8"
        fill="#fff"
        opacity="0.18"
      />
      <g transform="translate(21 16)" fill={c.fg}>
        {kind === "youtube" && (
          <path d="M28.5 8.2a2.4 2.4 0 0 0-1.7-1.7C25.3 6 17 6 17 6s-8.3 0-9.8.5A2.4 2.4 0 0 0 5.5 8.2 26 26 0 0 0 5 12a26 26 0 0 0 .5 3.8 2.4 2.4 0 0 0 1.7 1.7c1.5.5 9.8.5 9.8.5s8.3 0 9.8-.5a2.4 2.4 0 0 0 1.7-1.7A26 26 0 0 0 29 12a26 26 0 0 0-.5-3.8zM14.5 15.5v-7L21 12l-6.5 3.5z" />
        )}
        {kind === "github" && (
          <path d="M17 4.5C10.6 4.5 5.5 9.6 5.5 16c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.25.8-.56v-2c-3.2.7-3.9-1.55-3.9-1.55-.5-1.3-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.04 1.78 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.79 1.06.79 2.13v3.16c0 .31.21.67.79.56A11.5 11.5 0 0 0 28.5 16C28.5 9.6 23.4 4.5 17 4.5z" />
        )}
        {kind === "x" && (
          <path d="M24.2 6h3.1l-6.8 7.8L27.5 23h-6.6l-5.2-6.8-5.9 6.8H6.7l7.3-8.3L6 6h6.8l4.7 6.2L24.2 6zm-1.1 15.3h1.7L11.2 7.7H9.4l13.7 13.6z" />
        )}
        {kind === "linkedin" && (
          <path d="M27.2 5H6.8C5.8 5 5 5.8 5 6.8v18.4C5 26.2 5.8 27 6.8 27h20.4c1 0 1.8-.8 1.8-1.8V6.8C29 5.8 28.2 5 27.2 5zM11.4 23.5H8.1V13h3.3v10.5zM9.7 11.5a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8zM25 23.5h-3.3v-5.1c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6v5.2h-3.3V13h3.1v1.4h.05c.45-.85 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5v6z" />
        )}
        {kind === "instagram" && (
          <path d="M17 6.2c-2.9 0-3.3 0-4.4.1-2.9.1-4.3 1.5-4.4 4.4-.1 1.1-.1 1.5-.1 4.4s0 3.3.1 4.4c.1 2.9 1.5 4.3 4.4 4.4 1.1.1 1.5.1 4.4.1s3.3 0 4.4-.1c2.9-.1 4.3-1.5 4.4-4.4.1-1.1.1-1.5.1-4.4s0-3.3-.1-4.4c-.1-2.9-1.5-4.3-4.4-4.4-1.1-.1-1.5-.1-4.4-.1zm0 1.9c2.8 0 3.2 0 4.3.1 2 .1 2.9 1 3 3 .1 1.1.1 1.4.1 4.2s0 3.1-.1 4.2c-.1 2-.9 2.9-3 3-1.1.1-1.5.1-4.3.1s-3.2 0-4.3-.1c-2.1-.1-2.9-1-3-3-.1-1.1-.1-1.4-.1-4.2s0-3.1.1-4.2c.1-2 1-2.9 3-3 1.1-.1 1.5-.1 4.3-.1zm0 3.2a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.9-8.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
        )}
        {kind === "tiktok" && (
          <path d="M21.5 8.3a5.4 5.4 0 0 1-3.4-1.1v8.3a6.2 6.2 0 1 1-6.2-6.2c.3 0 .7 0 1 .1v3.1a3.2 3.2 0 1 0 2.2 3v-13h3.3a5.4 5.4 0 0 0 3.1 3.8v2z" />
        )}
      </g>
    </svg>
  );
}

export function AppIcon({
  id,
  label,
  kind,
  x,
  y,
  onOpen,
  onMove,
  className = "",
  style,
}: AppIconProps) {
  const drag = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: x,
      origY: y,
      moved: false,
    };
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      drag.current.moved = true;
    }
    const nx = drag.current.origX + (dx / window.innerWidth) * 100;
    const ny = drag.current.origY + (dy / window.innerHeight) * 100;
    onMove(id, nx, ny);
  };

  const onPointerUp = () => {
    if (drag.current && !drag.current.moved) onOpen(id);
    drag.current = null;
    setDragging(false);
  };

  return (
    <button
      type="button"
      className={`desktop-folder desktop-app absolute z-20 flex w-[96px] flex-col items-center gap-2 border-0 bg-transparent p-0 text-center ${
        dragging ? "z-40" : ""
      } ${className}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        touchAction: "none",
        ...style,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label={kind === "terminal" ? `Open ${label}` : `Open ${label}`}
    >
      {kind === "terminal" ? <TerminalGlyph /> : <SocialGlyph kind={kind} />}
      <span className="desktop-folder-label select-none px-1.5 py-0.5">
        {label}
      </span>
    </button>
  );
}
