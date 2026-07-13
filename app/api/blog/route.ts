import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/types/blog";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "slug, title, excerpt, date, read_time, category, year, upvotes, tags, author"
      )
      .eq("published", true)
      .order("date", { ascending: false });

    if (error) throw error;

    const blogs: BlogPost[] = (data ?? []).map((row) => ({
      id: row.slug,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      date: row.date,
      readTime: row.read_time,
      category: row.category,
      year: row.year,
      upvotes: row.upvotes,
      tags: row.tags ?? [],
      author: row.author ?? undefined,
      content: "",
    }));

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return NextResponse.json(
      { error: "Failed to read blog posts" },
      { status: 500 }
    );
  }
}
