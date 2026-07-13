"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { FolderIcon } from "@/components/desktop/FolderIcon";
import { AppIcon, type AppKind } from "@/components/desktop/AppIcon";
import { DesktopWindow } from "@/components/desktop/DesktopWindow";
import { GuestbookPanel } from "@/components/desktop/GuestbookPanel";
import { GalleryPanel } from "@/components/desktop/GalleryPanel";
import { TerminalPanel } from "@/components/desktop/TerminalPanel";

type FolderId =
  | "work"
  | "writing"
  | "about"
  | "contact"
  | "sponsors"
  | "guestbook"
  | "gallery";

type AppId =
  | "terminal"
  | "youtube"
  | "github"
  | "x"
  | "linkedin"
  | "instagram"
  | "tiktok";

type FolderState = {
  id: FolderId;
  label: string;
  tone: "yellow" | "blue" | "gray" | "mint";
  x: number;
  y: number;
};

type AppState = {
  id: AppId;
  label: string;
  kind: AppKind;
  href?: string;
  x: number;
  y: number;
};

type WindowState = {
  id: FolderId | "terminal";
  x: number;
  y: number;
  z: number;
};

const PROJECTS = [
  {
    title: "FuncStart",
    description:
      "Founding and building a platform that helps developers learn and grow through practical, hands-on projects and mentorship.",
    tech: "Next.js, TypeScript, Tailwind CSS",
    year: "2024",
    role: "Founder & CEO",
  },
  {
    title: "YouTube Channel",
    description:
      "Educational content on AI, ML, Blockchain, and cutting-edge tech — tutorials that actually solve real problems.",
    tech: "Content, AI/ML, Blockchain",
    year: "2024=Present",
    role: "Creator",
  },
  {
    title: "Tech Education",
    description:
      "In-depth tutorials and discussions on emerging tech, built for beginners and working engineers alike.",
    tech: "AI, ML, Blockchain",
    year: "2018–Present",
    role: "Educator",
  },
];

const SPONSORS: { name: string; src: string }[] = [
  { name: "Replit", src: "/sponsors/replit.jpeg" },
  { name: "MiniMax", src: "/sponsors/minimax.png" },
  { name: "Qoder", src: "/sponsors/qoderlogo.png" },
  { name: "Rocket AI", src: "/sponsors/rocketai.jpeg" },
  { name: "Decodo", src: "/sponsors/decodo_logo.png" },
  { name: "Mailtrap", src: "/sponsors/mailtrap.png" },
  { name: "DevvAI", src: "/sponsors/devvai.png" },
  { name: "SEO Writing", src: "/sponsors/seowriting.png" },
  { name: "EchoAPI", src: "/sponsors/echoapi.png" },
  { name: "Inngest", src: "/sponsors/inngest.png" },
  { name: "ChatLLM", src: "/sponsors/chatllm.png" },
  { name: "WalletHub", src: "/sponsors/wallehub.png" },
  { name: "LovarAI", src: "/sponsors/lovarai.png" },
  { name: "Lessie AI", src: "/sponsors/lessie ai logo.jpeg" },
];

function formatSubscribers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function defaultFolders(isMobile = false): FolderState[] {
  if (isMobile) {
    return [
      { id: "work", label: "work", tone: "yellow", x: 6, y: 8 },
      { id: "writing", label: "writing", tone: "mint", x: 72, y: 8 },
      { id: "about", label: "about", tone: "blue", x: 8, y: 22 },
      { id: "sponsors", label: "sponsors", tone: "yellow", x: 70, y: 22 },
      { id: "gallery", label: "gallery", tone: "blue", x: 8, y: 36 },
      { id: "guestbook", label: "guestbook", tone: "mint", x: 70, y: 36 },
      { id: "contact", label: "contact", tone: "gray", x: 8, y: 50 },
    ];
  }

  return [
    { id: "work", label: "work", tone: "yellow", x: 8, y: 16 },
    { id: "writing", label: "writing", tone: "mint", x: 78, y: 14 },
    { id: "about", label: "about", tone: "blue", x: 10, y: 48 },
    { id: "sponsors", label: "sponsors", tone: "yellow", x: 80, y: 48 },
    { id: "gallery", label: "gallery", tone: "blue", x: 14, y: 68 },
    { id: "guestbook", label: "guestbook", tone: "mint", x: 32, y: 70 },
    { id: "contact", label: "contact", tone: "gray", x: 50, y: 72 },
  ];
}

function defaultApps(isMobile = false): AppState[] {
  if (isMobile) {
    return [
      {
        id: "terminal",
        label: "terminal",
        kind: "terminal",
        x: 70,
        y: 50,
      },
      {
        id: "youtube",
        label: "youtube",
        kind: "youtube",
        href: "https://www.youtube.com/@albertmends",
        x: 8,
        y: 64,
      },
      {
        id: "github",
        label: "github",
        kind: "github",
        href: "https://github.com/mendsalbert",
        x: 40,
        y: 64,
      },
      {
        id: "x",
        label: "twitter",
        kind: "x",
        href: "https://x.com/mendsalbert",
        x: 72,
        y: 64,
      },
      {
        id: "linkedin",
        label: "linkedin",
        kind: "linkedin",
        href: "https://linkedin.com/in/mends-albert",
        x: 8,
        y: 78,
      },
      {
        id: "instagram",
        label: "instagram",
        kind: "instagram",
        href: "https://www.instagram.com/mendsalbert",
        x: 40,
        y: 78,
      },
      {
        id: "tiktok",
        label: "tiktok",
        kind: "tiktok",
        href: "https://www.tiktok.com/@mendsalbert",
        x: 72,
        y: 78,
      },
    ];
  }

  return [
    {
      id: "terminal",
      label: "terminal",
      kind: "terminal",
      x: 62,
      y: 16,
    },
    {
      id: "youtube",
      label: "youtube",
      kind: "youtube",
      href: "https://www.youtube.com/@albertmends",
      x: 86,
      y: 28,
    },
    {
      id: "github",
      label: "github",
      kind: "github",
      href: "https://github.com/mendsalbert",
      x: 4,
      y: 32,
    },
    {
      id: "x",
      label: "twitter",
      kind: "x",
      href: "https://x.com/mendsalbert",
      x: 88,
      y: 64,
    },
    {
      id: "linkedin",
      label: "linkedin",
      kind: "linkedin",
      href: "https://linkedin.com/in/mends-albert",
      x: 68,
      y: 68,
    },
    {
      id: "instagram",
      label: "instagram",
      kind: "instagram",
      href: "https://www.instagram.com/mendsalbert",
      x: 24,
      y: 52,
    },
    {
      id: "tiktok",
      label: "tiktok",
      kind: "tiktok",
      href: "https://www.tiktok.com/@mendsalbert",
      x: 42,
      y: 14,
    },
  ];
}

export default function Home() {
  const [folders, setFolders] = useState<FolderState[]>(() => defaultFolders());
  const [apps, setApps] = useState<AppState[]>(() => defaultApps());
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [zTop, setZTop] = useState(30);
  const [booted, setBooted] = useState(false);
  const [clock, setClock] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<number | null>(null);

  useEffect(() => {
    const layout = () => {
      const mobile = window.innerWidth < 768;
      setFolders(defaultFolders(mobile));
      setApps(defaultApps(mobile));
    };
    layout();
    let wasMobile = window.innerWidth < 768;
    const onResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile !== wasMobile) {
        wasMobile = isMobile;
        layout();
      }
    };
    window.addEventListener("resize", onResize);
    const t = requestAnimationFrame(() => setBooted(true));
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(t);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog");
        const data = await response.json();
        if (data.blogs) setBlogPosts(data.blogs);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setBlogLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/youtube/subscribers", {
          cache: "no-store",
        });
        const data = await res.json();
        if (res.ok && mounted) setSubscribers(Number(data.subscriberCount));
      } catch {
        /* optional live count */
      }
    };
    fetchCount();
    const id = setInterval(fetchCount, 90_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || windows.length === 0) return;
      const top = [...windows].sort((a, b) => b.z - a.z)[0];
      if (top) setWindows((prev) => prev.filter((w) => w.id !== top.id));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [windows]);

  const openWindow = (id: FolderId | "terminal") => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      const nextZ = zTop + 1;
      setZTop(nextZ);
      if (existing) {
        return prev.map((w) => (w.id === id ? { ...w, z: nextZ } : w));
      }
      const offset = prev.length * 28;
      return [
        ...prev,
        {
          id,
          x: Math.min(window.innerWidth - 80, 80 + offset),
          y: Math.min(window.innerHeight - 120, 90 + offset),
          z: nextZ,
        },
      ];
    });
  };

  const openApp = (id: string) => {
    const app = apps.find((a) => a.id === id);
    if (!app) return;
    if (app.href) {
      window.open(app.href, "_blank", "noopener");
      return;
    }
    if (app.id === "terminal") openWindow("terminal");
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const focusWindow = (id: string) => {
    const nextZ = zTop + 1;
    setZTop(nextZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, z: nextZ } : w))
    );
  };

  const clampDesktopPos = (x: number, y: number) => ({
    x: Math.max(1, Math.min(90, x)),
    y: Math.max(6, Math.min(82, y)),
  });

  const moveFolder = (id: string, x: number, y: number) => {
    const next = clampDesktopPos(x, y);
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...next } : f))
    );
  };

  const moveApp = (id: string, x: number, y: number) => {
    const next = clampDesktopPos(x, y);
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...next } : a)));
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
            ...w,
            x: Math.max(8, Math.min(window.innerWidth - 80, x)),
            y: Math.max(36, Math.min(window.innerHeight - 80, y)),
          }
          : w
      )
    );
  };

  const recentPosts = useMemo(() => blogPosts.slice(0, 5), [blogPosts]);

  const subscriberLabel =
    subscribers !== null ? `${formatSubscribers(subscribers)}+` : "15K+";

  return (
    <div
      className={`desktop-root relative h-dvh w-full overflow-hidden text-[#111827] ${booted ? "is-booted" : ""
        }`}
    >
      <header className="desktop-menubar relative z-50 flex h-11 items-center justify-between border-b-2 border-[#111] bg-[#f0f0f0] px-3">
        <div className="flex items-center gap-5">
          <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-wide text-[#111]">
            albert mends
          </span>
          <button
            type="button"
            className="hidden text-[15px] text-[#333] transition hover:underline sm:inline"
            onClick={() => openWindow("about")}
          >
            about
          </button>
          <button
            type="button"
            className="hidden text-[15px] text-[#333] transition hover:underline sm:inline"
            onClick={() => openWindow("work")}
          >
            work
          </button>
          <button
            type="button"
            className="hidden text-[15px] text-[#333] transition hover:underline sm:inline"
            onClick={() => openWindow("writing")}
          >
            writing
          </button>
        </div>
        <div className="text-[15px] text-[#333]" suppressHydrationWarning>
          {clock || "\u00a0"}
        </div>
      </header>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="desktop-hero text-center">
          <p className="desktop-hero-eyebrow mb-4 text-[#555] uppercase">
            software · founder · educator
          </p>
          <h1 className="desktop-hero-name text-[clamp(2.6rem,11vw,7.2rem)] leading-[1.05] text-[#111]">
            albert
            <br />
            mends
          </h1>
          <p className="desktop-hero-sub mx-auto mt-6 max-w-lg text-[#444]">
            drag folders & apps. open windows. build things that matter —
            {` ${subscriberLabel} `}
            developers watching.
          </p>
        </div>
      </div>

      {folders.map((folder, i) => (
        <FolderIcon
          key={folder.id}
          id={folder.id}
          label={folder.label}
          tone={folder.tone}
          x={folder.x}
          y={folder.y}
          onOpen={(id) => openWindow(id as FolderId)}
          onMove={moveFolder}
          className="desktop-folder-enter"
          style={{ animationDelay: `${180 + i * 70}ms` }}
        />
      ))}

      {apps.map((app, i) => (
        <AppIcon
          key={app.id}
          id={app.id}
          label={app.label}
          kind={app.kind}
          x={app.x}
          y={app.y}
          onOpen={openApp}
          onMove={moveApp}
          className="desktop-folder-enter"
          style={{ animationDelay: `${280 + i * 70}ms` }}
        />
      ))}

      {windows.map((win) => (
        <DesktopWindow
          key={win.id}
          id={win.id}
          title={win.id}
          x={win.x}
          y={win.y}
          z={win.z}
          width={
            win.id === "sponsors" ||
              win.id === "writing" ||
              win.id === "guestbook" ||
              win.id === "gallery" ||
              win.id === "terminal"
              ? 540
              : 420
          }
          bodyClassName={
            win.id === "terminal"
              ? "desktop-window-body max-h-[calc(min(72vh,580px)-40px)] overflow-hidden bg-[#111] p-0"
              : undefined
          }
          onClose={closeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
        >
          {win.id === "work" && (
            <div className="space-y-6">
              <p className="text-[13px] tracking-[0.15em] text-[#0000aa] uppercase">
                selected work
              </p>
              {PROJECTS.map((project) => (
                <article
                  key={project.title}
                  className="border-b border-[#ccc] pb-5 last:border-0"
                >
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-[family-name:var(--font-display)] text-[22px] text-[#111]">
                      {project.title}
                    </h3>
                    <span className="text-[13px] text-[#666]">{project.year}</span>
                  </div>
                  <p className="mb-1 text-[13px] text-[#0000aa]">{project.role}</p>
                  <p className="mb-3 text-[15px] leading-relaxed text-[#333]">
                    {project.description}
                  </p>
                  <p className="text-[13px] text-[#666]">{project.tech}</p>
                </article>
              ))}
            </div>
          )}

          {win.id === "writing" && (
            <div className="space-y-4">
              <div>
                <p className="text-[13px] tracking-[0.15em] text-[#0000aa] uppercase">
                  latest writing
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-[#444]">
                  notes on building, teaching, and shipping — open a post to
                  read.
                </p>
              </div>
              {blogLoading && <p className="text-[15px] text-[#666]">loading…</p>}
              {!blogLoading && recentPosts.length === 0 && (
                <p className="text-[15px] text-[#666]">no posts yet.</p>
              )}
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block border-b border-[#ccc] pb-4 last:border-0"
                >
                  <div className="mb-1 flex flex-wrap gap-2 text-[13px] text-[#666]">
                    <span className="tracking-[0.1em] text-[#0000aa] uppercase">
                      {post.category}
                    </span>
                    <span>·</span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-[20px] text-[#111] group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[15px] text-[#444]">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {win.id === "about" && (
            <div className="space-y-4 text-[15px] leading-relaxed text-[#333]">
              <p className="text-[13px] tracking-[0.15em] text-[#0000aa] uppercase">
                about
              </p>
              <p>
                I&apos;m a software engineer with 5 years of experience, focused
                on AI, ML, Blockchain, and building products people actually use.
                Founder of FuncStart — a platform helping developers learn through
                hands-on projects and mentorship.
              </p>
              <p>
                Through YouTube I&apos;ve reached{" "}
                <span className="text-[#111] underline">{subscriberLabel}</span>{" "}
                developers with 455K+ views across 23 videos. Clear teaching,
                practical builds, no fluff.
              </p>
              <p>
                Always learning. Always shipping. Happy to talk if you want to
                collaborate or just say hello.
              </p>
            </div>
          )}

          {win.id === "contact" && (
            <div className="space-y-5">
              <p className="text-[13px] tracking-[0.15em] text-[#0000aa] uppercase">
                contact
              </p>
              <p className="text-[15px] leading-relaxed text-[#333]">
                New opportunities, collaborations, FuncStart, or just a hello —
                write anytime.
              </p>
              <a
                href="mailto:albert.k.mends@gmail.com"
                className="inline-block font-[family-name:var(--font-display)] text-[20px] text-[#0000aa] underline"
              >
                albert.k.mends@gmail.com
              </a>
              <div className="flex flex-wrap gap-4 text-[14px] text-[#333]">
                <a
                  href="https://www.youtube.com/@albertmends"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  youtube
                </a>
                <a
                  href="https://github.com/mendsalbert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  github
                </a>
                <a
                  href="https://x.com/mendsalbert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  twitter
                </a>
                <a
                  href="https://linkedin.com/in/mends-albert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  linkedin
                </a>
                <a
                  href="https://www.instagram.com/mendsalbert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  instagram
                </a>
                <a
                  href="https://www.tiktok.com/@mendsalbert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  tiktok
                </a>
                <Link href="/invoice" className="hover:underline">
                  invoice
                </Link>
              </div>
            </div>
          )}

          {win.id === "sponsors" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] tracking-[0.15em] text-[#0000aa] uppercase">
                    youtube sponsors
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#444]">
                    Brands I&apos;ve partnered with on my YouTube channel —
                    sponsored videos, tools I use on camera, and collaborations
                    with the community.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openWindow("contact")}
                  className="shrink-0 text-[13px] text-[#0000aa] underline"
                >
                  sponsor me →
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SPONSORS.map((item) => (
                  <div
                    key={item.name}
                    className="flex h-14 items-center justify-center border-2 border-[#111] bg-[#f8f8f8] px-3"
                    aria-label={`${item.name} — YouTube sponsor`}
                    title={`${item.name} — YouTube sponsor`}
                  >
                    <Image
                      src={item.src}
                      alt={item.name}
                      width={120}
                      height={36}
                      className="max-h-8 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {win.id === "guestbook" && <GuestbookPanel />}
          {win.id === "gallery" && <GalleryPanel />}
          {win.id === "terminal" && (
            <TerminalPanel
              onOpenApp={(id) => openWindow(id as FolderId)}
            />
          )}
        </DesktopWindow>
      ))}

      <footer className="desktop-dock absolute inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t-2 border-[#111] bg-[#f0f0f0] px-3 py-2.5 sm:px-4">
        <p className="hidden text-[13px] text-[#555] sm:block">
          click a folder · esc to close
        </p>
        <nav className="mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[14px] text-[#333] sm:mx-0">
          <a
            href="https://github.com/mendsalbert"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            github
          </a>
          <span className="text-[#999]">/</span>
          <a
            href="https://x.com/mendsalbert"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            twitter
          </a>
          <span className="text-[#999]">/</span>
          <a
            href="https://www.youtube.com/@albertmends"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            youtube
          </a>
          <span className="text-[#999]">/</span>
          <a
            href="https://linkedin.com/in/mends-albert"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            linkedin
          </a>
          <span className="text-[#999]">/</span>
          <a
            href="https://www.instagram.com/mendsalbert"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            instagram
          </a>
          <span className="text-[#999]">/</span>
          <a
            href="https://www.tiktok.com/@mendsalbert"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            tiktok
          </a>
        </nav>
        <p className="hidden text-[13px] text-[#555] sm:block">
          © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
