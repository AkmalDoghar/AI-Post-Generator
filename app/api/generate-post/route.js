import { NextResponse } from "next/server";
import { generatePost } from "../../../lib/generatePost";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { summary, platform } = body;
  const safePlatform = typeof platform === "string" ? platform.toLowerCase() : "linkedin";

  if (!summary) {
    return NextResponse.json({ error: "Missing activity summary." }, { status: 400 });
  }

  try {
    const post = await generatePost(summary, safePlatform);
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to generate post." }, { status: 500 });
  }
}
