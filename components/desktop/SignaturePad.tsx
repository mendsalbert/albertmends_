"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type SignaturePadProps = {
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
};

export function SignaturePad({ onChange, disabled }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const inkRef = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(280, Math.floor(rect.width));
    const height = 140;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2.25;
  }, []);

  useEffect(() => {
    sizeCanvas();
    const onResize = () => {
      sizeCanvas();
      inkRef.current = false;
      setHasInk(false);
      onChange(null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onChange, sizeCanvas]);

  const pointFromEvent = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const emit = () => {
    const canvas = canvasRef.current;
    if (!canvas || !inkRef.current) {
      onChange(null);
      return;
    }
    onChange(canvas.toDataURL("image/png"));
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pointFromEvent(e);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !last.current) return;
    const next = pointFromEvent(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last.current = next;
    if (!inkRef.current) {
      inkRef.current = true;
      setHasInk(true);
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    emit();
  };

  const clear = () => {
    sizeCanvas();
    inkRef.current = false;
    setHasInk(false);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] tracking-[0.12em] text-[#555] uppercase">
          draw your signature
        </span>
        <button
          type="button"
          onClick={clear}
          disabled={disabled || !hasInk}
          className="text-[12px] text-[#0000aa] underline disabled:opacity-40"
        >
          clear
        </button>
      </div>
      <div className="relative border-2 border-[#111] bg-white">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none cursor-crosshair"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Signature pad"
        />
        {!hasInk && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-[13px] text-[#aaa]">
            sign here with mouse or finger
          </p>
        )}
      </div>
    </div>
  );
}
