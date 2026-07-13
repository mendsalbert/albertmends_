import { NextResponse } from "next/server";

let cachedSubscriberCount: number | null = null;
let cachedAtMs = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      return NextResponse.json(
        {
          error:
            "Server not configured. Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID.",
        },
        { status: 500 }
      );
    }

    const now = Date.now();
    if (cachedSubscriberCount !== null && now - cachedAtMs < CACHE_TTL_MS) {
      return NextResponse.json({
        subscriberCount: cachedSubscriberCount,
        cached: true,
      });
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/channels");
    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", channelId);
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "YouTube API error", detail: text },
        { status: 502 }
      );
    }

    const data = (await res.json()) as any;
    const countStr = data?.items?.[0]?.statistics?.subscriberCount;
    const countNum =
      typeof countStr === "string" ? Number(countStr) : undefined;
    if (!Number.isFinite(countNum)) {
      return NextResponse.json(
        { error: "Could not read subscriberCount (maybe hidden?)." },
        { status: 404 }
      );
    }

    cachedSubscriberCount = countNum as number;
    cachedAtMs = now;

    console.log("subscriberCount", cachedSubscriberCount);
    return NextResponse.json({
      subscriberCount: cachedSubscriberCount,
      cached: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
