import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { GalleryItem } from "@/types/gallery";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id, title, src, type, caption, date")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    const items: GalleryItem[] = (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      src: row.src,
      type: row.type,
      caption: row.caption ?? undefined,
      date: row.date ?? undefined,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error reading gallery:", error);
    return NextResponse.json(
      { error: "Failed to read gallery" },
      { status: 500 }
    );
  }
}
