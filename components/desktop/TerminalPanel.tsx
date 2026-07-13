"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

type Line = {
  type: "in" | "out" | "err" | "sys";
  text: string;
};

type TerminalPanelProps = {
  onOpenApp?: (id: string) => void;
};

const WELCOME: Line[] = [
  { type: "sys", text: "albertOS terminal v1.0" },
  { type: "sys", text: 'type "help" for available commands.' },
  { type: "out", text: "" },
];

const HELP = [
  "available commands:",
  "  help       — show this list",
  "  clear      — clear the screen",
  "  whoami     — who's here",
  "  about      — short bio",
  "  ls         — list desktop apps",
  "  open <app> — open a desktop window",
  "  socials    — social links",
  "  contact    — email + socials",
  "  date       — current time",
  "  echo <t>   — print text",
  "  neofetch   — system info",
];

const APPS = [
  "work",
  "writing",
  "about",
  "contact",
  "sponsors",
  "guestbook",
  "gallery",
  "terminal",
];

const SOCIALS = [
  "youtube  → https://www.youtube.com/@albertmends",
  "github   → https://github.com/mendsalbert",
  "twitter  → https://x.com/mendsalbert",
  "linkedin → https://linkedin.com/in/mends-albert",
  "instagram → https://www.instagram.com/mendsalbert",
  "tiktok   → https://www.tiktok.com/@mendsalbert",
];

export function TerminalPanel({ onOpenApp }: TerminalPanelProps) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const push = (next: Line | Line[]) => {
    setLines((prev) => prev.concat(Array.isArray(next) ? next : [next]));
  };

  const run = (raw: string) => {
    const trimmed = raw.trim();
    push({ type: "in", text: trimmed || " " });

    if (!trimmed) return;

    setHistory((prev) => [trimmed, ...prev].slice(0, 40));
    setHistIdx(-1);

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(" ").trim();
    const lower = cmd.toLowerCase();

    switch (lower) {
      case "help":
      case "?":
        push(HELP.map((text) => ({ type: "out" as const, text })));
        break;
      case "clear":
      case "cls":
        setLines([]);
        break;
      case "whoami":
        push({ type: "out", text: "albert mends — software · founder · educator" });
        break;
      case "about":
        push([
          {
            type: "out",
            text: "software engineer · AI/ML · blockchain · FuncStart founder",
          },
          {
            type: "out",
            text: "teaching on youtube — practical builds, no fluff.",
          },
        ]);
        break;
      case "ls":
        push({ type: "out", text: APPS.join("  ") });
        break;
      case "open": {
        const app = arg.toLowerCase();
        if (!app) {
          push({ type: "err", text: "usage: open <app>  (try: ls)" });
          break;
        }
        if (!APPS.includes(app) || app === "terminal") {
          push({
            type: "err",
            text: `unknown app "${app}". try: ${APPS.filter((a) => a !== "terminal").join(", ")}`,
          });
          break;
        }
        onOpenApp?.(app);
        push({ type: "out", text: `opening ${app}…` });
        break;
      }
      case "socials":
      case "links":
        push(SOCIALS.map((text) => ({ type: "out" as const, text })));
        break;
      case "contact":
        push([
          { type: "out", text: "albert.k.mends@gmail.com" },
          ...SOCIALS.map((text) => ({ type: "out" as const, text })),
        ]);
        break;
      case "date":
        push({ type: "out", text: new Date().toString() });
        break;
      case "echo":
        push({ type: "out", text: arg || "" });
        break;
      case "neofetch":
        push([
          { type: "out", text: "albert@mends" },
          { type: "out", text: "-------------" },
          { type: "out", text: "OS:      albertOS desktop" },
          { type: "out", text: "Shell:   terminal v1.0" },
          { type: "out", text: "Role:    founder · engineer · educator" },
          { type: "out", text: "Stack:   next.js · typescript · ai/ml" },
          { type: "out", text: "Channel: youtube.com/@albertmends" },
        ]);
        break;
      case "youtube":
        window.open("https://www.youtube.com/@albertmends", "_blank", "noopener");
        push({ type: "out", text: "opening youtube…" });
        break;
      case "github":
        window.open("https://github.com/mendsalbert", "_blank", "noopener");
        push({ type: "out", text: "opening github…" });
        break;
      default:
        push({
          type: "err",
          text: `command not found: ${cmd}. type "help".`,
        });
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = input;
    setInput("");
    run(value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx <= 0) {
        setHistIdx(-1);
        setInput("");
        return;
      }
      const next = histIdx - 1;
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      push({ type: "in", text: "^C" });
      setInput("");
    }
  };

  return (
    <div
      className="desktop-terminal"
      onClick={() => inputRef.current?.focus()}
      role="application"
      aria-label="Terminal"
    >
      <div className="desktop-terminal-scroll">
        {lines.map((line, i) => (
          <p
            key={`${i}-${line.type}-${line.text.slice(0, 12)}`}
            className={`desktop-terminal-line desktop-terminal-${line.type}`}
          >
            {line.type === "in" ? (
              <>
                <span className="desktop-terminal-prompt">albert@mends:~$</span>{" "}
                {line.text}
              </>
            ) : (
              line.text || "\u00a0"
            )}
          </p>
        ))}
        <form className="desktop-terminal-form" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="desktop-terminal-input">
            Terminal command
          </label>
          <span className="desktop-terminal-prompt" aria-hidden>
            albert@mends:~$
          </span>
          <input
            id="desktop-terminal-input"
            ref={inputRef}
            className="desktop-terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="Command"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
