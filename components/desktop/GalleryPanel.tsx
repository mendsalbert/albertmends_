"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/types/gallery";

export function GalleryPanel() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<GalleryItem | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        const data = await res.json();
        if (mounted && res.ok && data.items) setItems(data.items);
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[13px] tracking-[0.15em] text-[#0000aa] uppercase">
          gallery
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[#444]">
          photos &amp; videos — moments from behind the camera, builds, and life
          offline.
        </p>
      </div>

      {loading && <p className="text-[14px] text-[#666]">loading…</p>}

      {!loading && items.length === 0 && (
        <div className="border-2 border-dashed border-[#111] bg-[#f8f8f8] p-4 text-[14px] leading-relaxed text-[#444]">
          <p className="font-[family-name:var(--font-display)] text-[16px] text-[#111]">
            nothing here yet
          </p>
          <p className="mt-2">
            gallery is empty for now — photos &amp; videos will show up here
            soon.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="group border-2 border-[#111] bg-[#f8f8f8] text-left transition hover:bg-[#eee]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#ddd]">
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#222] text-white">
                    <span className="text-[22px]">▶</span>
                    <span className="px-2 text-center text-[11px] tracking-wide uppercase">
                      video
                    </span>
                  </div>
                )}
              </div>
              <div className="border-t-2 border-[#111] px-2 py-1.5">
                <p className="truncate text-[13px] text-[#111] group-hover:underline">
                  {item.title}
                </p>
                {item.date && (
                  <p className="text-[11px] text-[#777]">{item.date}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setActive(null)}
          role="presentation"
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-auto border-2 border-[#111] bg-white shadow-[4px_4px_0_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={active.title}
          >
            <div className="flex items-center justify-between border-b-2 border-[#111] bg-[#dddddd] px-3 py-2">
              <p className="truncate text-[14px] tracking-[0.06em] text-[#111]">
                {active.title}
              </p>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="border border-[#111] bg-[#e8e8e8] px-2 py-0.5 text-[12px] uppercase"
              >
                close
              </button>
            </div>
            <div className="bg-[#111]">
              {active.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.src}
                  alt={active.title}
                  className="mx-auto max-h-[60vh] w-auto max-w-full object-contain"
                />
              ) : (
                <video
                  src={active.src}
                  controls
                  className="mx-auto max-h-[60vh] w-full"
                  playsInline
                />
              )}
            </div>
            {(active.caption || active.date) && (
              <div className="space-y-1 border-t-2 border-[#111] px-4 py-3">
                {active.caption && (
                  <p className="text-[14px] leading-relaxed text-[#333]">
                    {active.caption}
                  </p>
                )}
                {active.date && (
                  <p className="text-[12px] text-[#777]">{active.date}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
