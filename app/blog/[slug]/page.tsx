"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";

type Heading = { id: string; text: string };

function extractHeadings(html: string): Heading[] {
  const matches = html.matchAll(
    /<h2[^>]*(?:id=["']([^"']+)["'])?[^>]*>(.*?)<\/h2>/gi
  );
  const headings: Heading[] = [];
  for (const match of matches) {
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    const id =
      match[1] ||
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    headings.push({ id, text });
  }
  return headings;
}

export default function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [readingProgress, setReadingProgress] = useState(0);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        const data = await response.json();

        if (response.ok && data.blogPost) {
          setPost(data.blogPost);
          setUpvotes(data.blogPost.upvotes || 0);
          const upvotedPosts = JSON.parse(
            localStorage.getItem("upvotedPosts") || "[]"
          );
          setHasUpvoted(upvotedPosts.includes(data.blogPost.slug));
        } else {
          setError(data.error || "Blog post not found");
        }
      } catch (err) {
        setError("Failed to load blog post");
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const headings = useMemo(
    () => (post?.content ? extractHeadings(post.content) : []),
    [post?.content]
  );

  const handleUpvote = async () => {
    if (!post || hasUpvoted || isUpvoting) return;
    setIsUpvoting(true);
    try {
      const response = await fetch(`/api/blog/${post.slug}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setUpvotes(data.upvotes);
        setHasUpvoted(true);
        const upvotedPosts = JSON.parse(
          localStorage.getItem("upvotedPosts") || "[]"
        );
        upvotedPosts.push(post.slug);
        localStorage.setItem("upvotedPosts", JSON.stringify(upvotedPosts));
      } else {
        setUpvotes((prev) => prev + 1);
        setHasUpvoted(true);
      }
    } catch {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch {
        /* ignore */
      }
    }
  };

  if (loading) {
    return (
      <div className="writing-root min-h-dvh">
        <div className="mx-auto max-w-xl px-6 py-20 text-center text-[15px] text-[#555]">
          loading…
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="writing-root min-h-dvh">
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="writing-title">post not found</h1>
          <p className="mt-4 text-[15px] text-[#555]">
            {error || "The writing you’re looking for isn’t here."}
          </p>
          <Link
            href="/"
            className="mt-8 inline-block border-2 border-[#111] bg-[#0000aa] px-4 py-2 text-[13px] tracking-[0.08em] text-white uppercase"
          >
            ← back to desktop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="writing-root min-h-dvh">
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-[#e5e5e5]">
        <div
          className="h-full bg-[#0000aa] transition-[width] duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <header className="sticky top-0 z-40 flex h-11 items-center justify-between border-b-2 border-[#111] bg-[#f0f0f0] px-3">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-wide text-[#111] hover:underline"
        >
          albert mends
        </Link>
        <div className="flex items-center gap-4 text-[14px] text-[#333]">
          <Link href="/" className="hidden hover:underline sm:inline">
            desktop
          </Link>
          <span suppressHydrationWarning>{clock || "\u00a0"}</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[180px_minmax(0,42rem)_1fr] lg:justify-center lg:px-8 lg:py-16">
        {headings.length > 0 ? (
          <aside className="hidden lg:block">
            <div className="sticky top-16 border-2 border-[#111] bg-white p-4">
              <p className="mb-3 text-[12px] tracking-[0.15em] text-[#0000aa] uppercase">
                contents
              </p>
              <nav className="space-y-2.5">
                {headings.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      document
                        .getElementById(h.id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="block w-full text-left text-[13px] leading-snug text-[#444] hover:text-[#0000aa] hover:underline"
                  >
                    {h.text}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        ) : (
          <div className="hidden lg:block" />
        )}

        <article className="writing-article w-full">
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#666]">
            <span className="tracking-[0.12em] text-[#0000aa] uppercase">
              {post.category}
            </span>
            <span aria-hidden>·</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span aria-hidden>·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="writing-title">{post.title}</h1>

          <p className="writing-excerpt mt-5">{post.excerpt}</p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#ccc] py-4">
            <div>
              <p className="text-[15px] font-medium text-[#111]">
                {post.author || "Albert Mends"}
              </p>
              <p className="text-[13px] text-[#666]">
                software · founder · educator
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUpvote}
                disabled={hasUpvoted || isUpvoting}
                className="border-2 border-[#111] bg-white px-3 py-1.5 text-[13px] text-[#111] disabled:opacity-60"
              >
                {isUpvoting ? "…" : `▲ ${upvotes}`}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="border-2 border-[#111] bg-white px-3 py-1.5 text-[13px] text-[#111] hover:bg-[#f3f2ee]"
              >
                share
              </button>
            </div>
          </div>

          <div
            className="writing-prose mt-10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.length > 0 && (
            <div className="mt-12 border-t border-[#ccc] pt-6">
              <p className="mb-3 text-[12px] tracking-[0.15em] text-[#0000aa] uppercase">
                tags
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#bbb] bg-white px-2.5 py-1 text-[13px] text-[#444]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14">
            <Link
              href="/"
              className="inline-block border-2 border-[#111] bg-[#0000aa] px-4 py-2 text-[13px] tracking-[0.08em] text-white uppercase"
            >
              ← back to desktop
            </Link>
          </div>
        </article>
      </main>

      <footer className="border-t-2 border-[#111] bg-[#f0f0f0] px-5 py-4 text-center text-[13px] text-[#555]">
        © {new Date().getFullYear()} albert mends
      </footer>
    </div>
  );
}
