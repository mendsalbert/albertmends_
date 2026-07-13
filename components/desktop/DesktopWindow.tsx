"use client";

import {
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";

type DesktopWindowProps = {
  id: string;
  title: string;
  x: number;
  y: number;
  z: number;
  width?: number;
  bodyClassName?: string;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: ReactNode;
};

export function DesktopWindow({
  id,
  title,
  x,
  y,
  z,
  width = 440,
  bodyClassName,
  onClose,
  onFocus,
  onMove,
  children,
}: DesktopWindowProps) {
  const drag = useRef<{ ox: number; oy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onTitlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-window-control]")) return;
    onFocus(id);
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { ox: e.clientX - x, oy: e.clientY - y };
    setDragging(true);
  };

  const onTitlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    onMove(id, e.clientX - drag.current.ox, e.clientY - drag.current.oy);
  };

  const onTitlePointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  const handleClose = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose(id);
  };

  return (
    <div
      className={`desktop-window absolute overflow-hidden bg-[#f4f4f4] ${
        dragging ? "opacity-95" : ""
      }`}
      style={{
        left: x,
        top: y,
        zIndex: z,
        width: `min(${width}px, calc(100vw - 24px))`,
        maxHeight: "min(72vh, 580px)",
      }}
      onMouseDown={() => onFocus(id)}
      role="dialog"
      aria-label={title}
    >
      <div
        className="desktop-titlebar flex items-center gap-2 px-2 py-1.5"
        style={{ touchAction: "none" }}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onPointerCancel={onTitlePointerUp}
      >
        <button
          type="button"
          aria-label={`Close ${title}`}
          data-window-control
          onPointerDown={handleClose}
          onClick={handleClose}
          className="desktop-closebox"
          title="Close"
        />
        <p className="desktop-title flex-1 truncate text-center">{title}</p>
        <button
          type="button"
          data-window-control
          onPointerDown={handleClose}
          onClick={handleClose}
          className="desktop-close-text"
          aria-label={`Close ${title} window`}
        >
          close
        </button>
      </div>
      <div
        className={
          bodyClassName ??
          "desktop-window-body max-h-[calc(min(72vh,580px)-40px)] overflow-y-auto bg-white p-5 text-[#1a1a1a]"
        }
      >
        {children}
      </div>
    </div>
  );
}
