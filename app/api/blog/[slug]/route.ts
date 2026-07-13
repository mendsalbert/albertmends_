import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapBlogRowToPost, markdownToHtml } from "@/lib/blog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const contentHtml = await markdownToHtml(data.content);
    const blogPost = mapBlogRowToPost(data, contentHtml);

    return NextResponse.json({ blogPost });
  } catch (error) {
    console.error("Error reading blog post:", error);
    return NextResponse.json(
      { error: "Failed to read blog post" },
      { status: 500 }
    );
  }
}
