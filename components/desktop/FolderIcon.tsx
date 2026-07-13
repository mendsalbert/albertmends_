"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

type FolderIconProps = {
  id: string;
  label: string;
  tone?: "yellow" | "blue" | "gray" | "mint";
  x: number;
  y: number;
  onOpen: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  className?: string;
  style?: CSSProperties;
};

/** Classic Mac OS–style folder palettes */
const TONES = {
  yellow: {
    paper: "#F3D459",
    paperMid: "#E8C43A",
    paperDeep: "#C9A322",
    tab: "#F7E08A",
    line: "#8B7018",
    shine: "#FFF6C8",
  },
  blue: {
    paper: "#7EB3E0",
    paperMid: "#5F9AD0",
    paperDeep: "#3F78B0",
    tab: "#A8CDED",
    line: "#2A5078",
    shine: "#D7EBFA",
  },
  gray: {
    paper: "#D0D0D0",
    paperMid: "#B8B8B8",
    paperDeep: "#909090",
    tab: "#E4E4E4",
    line: "#555555",
    shine: "#F5F5F5",
  },
  mint: {
    paper: "#8BC9A4",
    paperMid: "#6FB489",
    paperDeep: "#4A8F66",
    tab: "#B5DFC4",
    line: "#2F6044",
    shine: "#D9F0E2",
  },
};

export function FolderIcon({
  id,
  label,
  tone = "yellow",
  x,
  y,
  onOpen,
  onMove,
  className = "",
  style,
}: FolderIconProps) {
  const c = TONES[tone];
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
      className={`desktop-folder absolute z-20 flex w-[96px] flex-col items-center gap-2 border-0 bg-transparent p-0 text-center ${
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
      aria-label={`Open ${label}`}
    >
      <svg
        width="76"
        height="62"
        viewBox="0 0 76 62"
        className="desktop-folder-svg"
        aria-hidden
        style={{ imageRendering: "pixelated" }}
      >
        {/* Drop shadow block — hard, old-school */}
        <path
          d="M6 14h22l5 5h37v37H6z"
          fill="#000"
          opacity="0.18"
          transform="translate(3 3)"
        />
        {/* Tab */}
        <path d="M4 12h24l6 7H4z" fill={c.tab} stroke={c.line} strokeWidth="1.5" />
        <path d="M5 13h21l1 1H5z" fill={c.shine} opacity="0.7" />
        {/* Body */}
        <path
          d="M4 19h68v36H4z"
          fill={c.paper}
          stroke={c.line}
          strokeWidth="1.5"
        />
        {/* Bevel highlight */}
        <path d="M5 20h66v2H5z" fill={c.shine} opacity="0.85" />
        <path d="M5 20v34h2V20z" fill={c.shine} opacity="0.55" />
        {/* Bevel shadow */}
        <path d="M70 22v32H6v2h66V22z" fill={c.paperDeep} opacity="0.55" />
        <path d="M70 20h2v34h-2z" fill={c.paperDeep} opacity="0.7" />
        {/* Fold crease */}
        <path
          d="M4 26h68"
          stroke={c.paperMid}
          strokeWidth="2"
          opacity="0.9"
        />
        <path
          d="M10 34h56M10 41h48M10 48h40"
          stroke={c.line}
          strokeWidth="1"
          opacity="0.18"
          strokeLinecap="square"
        />
      </svg>
      <span className="desktop-folder-label select-none px-1.5 py-0.5">
        {label}
      </span>
    </button>
  );
}
