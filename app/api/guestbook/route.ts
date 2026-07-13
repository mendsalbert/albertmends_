import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { GuestbookEntry } from "@/types/guestbook";

const MAX_NAME = 40;
const MAX_MESSAGE = 200;
const MAX_ENTRIES = 200;
const MAX_SIGNATURE_CHARS = 350_000;

function isValidSignature(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("data:image/png;base64,") &&
    value.length > 100 &&
    value.length <= MAX_SIGNATURE_CHARS
  );
}

function mapEntry(row: {
  id: string;
  name: string;
  message: string;
  signature: string;
  created_at: string;
}): GuestbookEntry {
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    signature: row.signature,
    createdAt: row.created_at,
  };
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(MAX_ENTRIES);

    if (error) throw error;

    return NextResponse.json({
      entries: (data ?? []).map(mapEntry),
    });
  } catch (error) {
    console.error("Error reading guestbook:", error);
    return NextResponse.json(
      { error: "Failed to read guestbook" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();
    const signature = body.signature;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!isValidSignature(signature)) {
      return NextResponse.json(
        { error: "Please draw your signature" },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME || message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: "Name or message is too long" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("guestbook_entries")
      .insert({ name, message, signature })
      .select("*")
      .single();

    if (error) throw error;

    const { data: all, error: listError } = await supabase
      .from("guestbook_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(MAX_ENTRIES);

    if (listError) throw listError;

    return NextResponse.json({
      success: true,
      entry: mapEntry(data),
      entries: (all ?? []).map(mapEntry),
    });
  } catch (error) {
    console.error("Error writing guestbook:", error);
    return NextResponse.json(
      { error: "Failed to sign guestbook" },
      { status: 500 }
    );
  }
}
