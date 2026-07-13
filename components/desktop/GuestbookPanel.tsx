"use client";

import { FormEvent, useEffect, useState } from "react";
import type { GuestbookEntry } from "@/types/guestbook";
import { SignaturePad } from "@/components/desktop/SignaturePad";

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function GuestbookPanel() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/guestbook", { cache: "no-store" });
        const data = await res.json();
        if (mounted && res.ok && data.entries) setEntries(data.entries);
      } catch {
        if (mounted) setError("couldn’t load signatures");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setSigned(localStorage.getItem("guestbookSigned") === "1");
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || signed) return;
    if (!signature) {
      setError("please draw your signature first");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, signature }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "something went wrong");
        return;
      }
      setEntries(data.entries ?? [data.entry, ...entries]);
      setName("");
      setMessage("");
      setSignature(null);
      setSigned(true);
      localStorage.setItem("guestbookSigned", "1");
    } catch {
      setError("couldn’t leave a signature");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[13px] tracking-[0.15em] text-[#0000aa] uppercase">
          visitor signatures
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[#444]">
          leave your mark — draw a signature with your mouse (or finger), add
          your name, and optionally a short note.
        </p>
      </div>

      {!signed ? (
        <form
          onSubmit={onSubmit}
          className="space-y-3 border-2 border-[#111] bg-[#f8f8f8] p-3"
        >
          <label className="block">
            <span className="mb-1 block text-[12px] tracking-[0.12em] text-[#555] uppercase">
              name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              required
              placeholder="your name"
              className="w-full border-2 border-[#111] bg-white px-2 py-1.5 text-[14px] text-[#111] outline-none focus:border-[#0000aa]"
            />
          </label>

          <SignaturePad onChange={setSignature} disabled={submitting} />

          <label className="block">
            <span className="mb-1 block text-[12px] tracking-[0.12em] text-[#555] uppercase">
              message <span className="normal-case tracking-normal">(optional)</span>
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="say hello, leave a tip, or just sign…"
              className="w-full resize-none border-2 border-[#111] bg-white px-2 py-1.5 text-[14px] text-[#111] outline-none focus:border-[#0000aa]"
            />
          </label>
          {error && <p className="text-[13px] text-[#aa0000]">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !signature}
            className="border-2 border-[#111] bg-[#0000aa] px-3 py-1.5 text-[13px] tracking-[0.08em] text-white uppercase disabled:opacity-60"
          >
            {submitting ? "signing…" : "sign guestbook"}
          </button>
        </form>
      ) : (
        <p className="border-2 border-[#111] bg-[#f0fff0] px-3 py-2 text-[14px] text-[#333]">
          thanks — your signature is in the book.
        </p>
      )}

      <div>
        <p className="mb-3 text-[12px] tracking-[0.12em] text-[#666] uppercase">
          {loading
            ? "loading…"
            : `${entries.length} signature${entries.length === 1 ? "" : "s"}`}
        </p>
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="border-b border-[#ccc] pb-4 last:border-0"
            >
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span className="font-[family-name:var(--font-display)] text-[17px] text-[#111]">
                  {entry.name}
                </span>
                <span className="text-[12px] text-[#888]">
                  {formatWhen(entry.createdAt)}
                </span>
              </div>
              {entry.signature && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.signature}
                  alt={`${entry.name}'s signature`}
                  className="mb-2 h-16 w-auto max-w-full border border-[#ddd] bg-white object-contain"
                />
              )}
              {entry.message && (
                <p className="text-[14px] leading-relaxed text-[#444]">
                  {entry.message}
                </p>
              )}
            </li>
          ))}
          {!loading && entries.length === 0 && (
            <li className="text-[14px] text-[#666]">
              no signatures yet — be the first.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
