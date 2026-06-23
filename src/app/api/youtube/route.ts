import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const h = match[1] ? parseInt(match[1]) : 0;
  const m = match[2] ? parseInt(match[2]) : 0;
  const s = match[3] ? parseInt(match[3]) : 0;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getDayName(dateStr: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  try {
    return days[new Date(dateStr).getDay()];
  } catch { return "Unknown"; }
}

function getUploadTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch { return "Unknown"; }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch { return dateStr; }
}

const CATEGORY_MAP: Record<string, string> = {
  "1": "Film & Animation", "2": "Autos & Vehicles", "10": "Music",
  "15": "Pets & Animals", "17": "Sports", "18": "Short Movies",
  "19": "Travel & Events", "20": "Gaming", "21": "Videoblogging",
  "22": "People & Blogs", "23": "Comedy", "24": "Entertainment",
  "25": "News & Politics", "26": "Howto & Style", "27": "Education",
  "28": "Science & Technology", "29": "Nonprofits & Activism",
  "30": "Movies", "31": "Anime/Animation", "32": "Action/Adventure",
  "33": "Classics", "34": "Comedy", "35": "Documentary", "36": "Drama",
  "37": "Family", "38": "Foreign", "39": "Horror", "40": "Sci-Fi/Fantasy",
  "41": "Thriller", "42": "Shorts", "43": "Shows", "44": "Trailers",
};

// Robust API key resolution: check multiple sources (4-layer fallback)
// Survives Prisma db:push wiping .env / .env.local
function getYouTubeApiKey(): string | null {
  // 1. Check process.env (loaded by Next.js from .env / .env.local)
  if (process.env.YOUTUBE_API_KEY) return process.env.YOUTUBE_API_KEY;

  // 2. Backup secrets file (.secrets/youtube.env) — never touched by Prisma
  try {
    const backupPath = join(process.cwd(), ".secrets", "youtube.env");
    if (existsSync(backupPath)) {
      const content = readFileSync(backupPath, "utf-8");
      const match = content.match(/YOUTUBE_API_KEY\s*=\s*(.+)/);
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch { /* ignore */ }

  // 3. Try reading .env.local directly at runtime as fallback
  try {
    const envLocalPath = join(process.cwd(), ".env.local");
    if (existsSync(envLocalPath)) {
      const content = readFileSync(envLocalPath, "utf-8");
      const match = content.match(/YOUTUBE_API_KEY\s*=\s*(.+)/);
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch { /* ignore */ }

  // 4. Try reading .env directly as fallback
  try {
    const envPath = join(process.cwd(), ".env");
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(/YOUTUBE_API_KEY\s*=\s*(.+)/);
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch { /* ignore */ }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL. Please paste a valid YouTube video link." }, { status: 400 });
    }

    const apiKey = getYouTubeApiKey();

    if (!apiKey) {
      console.error("[YouTube API] ERROR: YOUTUBE_API_KEY is not set. Checked process.env, .env.local, and .env");
      return NextResponse.json({
        error: "YouTube API key is not configured on the server. Please contact the administrator.",
      }, { status: 503 });
    }

    console.log(`[YouTube API] Fetching video: ${videoId} (key: ${apiKey.substring(0, 8)}...)`);

    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`,
      { cache: "no-store" }
    );

    if (!videoResponse.ok) {
      const errorData = await videoResponse.json().catch(() => ({}));
      console.error("[YouTube API] Error:", videoResponse.status, JSON.stringify(errorData));

      if (videoResponse.status === 403) {
        return NextResponse.json({
          error: "YouTube API quota exceeded or key is invalid. Please try again later or check the API key.",
        }, { status: 403 });
      }

      return NextResponse.json({
        error: "Failed to fetch video data from YouTube. Please try again.",
      }, { status: 500 });
    }

    const videoData = await videoResponse.json();

    if (!videoData.items || videoData.items.length === 0) {
      return NextResponse.json({ error: "Video not found. It may be private, deleted, or age-restricted." }, { status: 404 });
    }

    const video = videoData.items[0];
    const snippet = video.snippet;
    const stats = video.statistics;
    const contentDetails = video.contentDetails;

    console.log(`[YouTube API] Success: "${snippet.title}" by ${snippet.channelTitle} — ${stats.viewCount} views`);

    return NextResponse.json({
      videoId,
      title: snippet.title,
      channelName: snippet.channelTitle,
      thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
      uploadDate: formatDate(snippet.publishedAt),
      uploadTime: getUploadTime(snippet.publishedAt),
      uploadDay: getDayName(snippet.publishedAt),
      publishedAt: snippet.publishedAt,
      viewCount: parseInt(stats.viewCount || "0"),
      likeCount: parseInt(stats.likeCount || "0"),
      commentCount: parseInt(stats.commentCount || "0"),
      duration: parseDuration(contentDetails.duration || "PT0S"),
      category: CATEGORY_MAP[snippet.categoryId] || "Unknown",
      tags: snippet.tags || [],
      description: snippet.description?.substring(0, 500) || "",
      channelId: snippet.channelId,
      isLive: true,
    });

  } catch (error) {
    console.error("[YouTube API] Unexpected error:", error);
    return NextResponse.json({ error: "An unexpected error occurred while fetching video data" }, { status: 500 });
  }
}
