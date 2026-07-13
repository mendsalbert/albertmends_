import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase.rpc("increment_blog_upvotes", {
      post_slug: slug,
    });

    if (error) throw error;

    if (data == null) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      upvotes: data,
      message: "Upvote recorded successfully",
    });
  } catch (error) {
    console.error("Error updating upvotes:", error);
    return NextResponse.json(
      { error: "Failed to update upvotes" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("upvotes")
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

    return NextResponse.json({ upvotes: data.upvotes });
  } catch (error) {
    console.error("Error fetching upvotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch upvotes" },
      { status: 500 }
    );
  }
}
