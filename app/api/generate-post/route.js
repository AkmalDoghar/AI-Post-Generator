import { NextResponse } from "next/server";
import { generateContentEnginePost } from "../../../lib/contentEngine";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const {
    summary,
    angle = "auto_ai",
    tone = "professional",
    length = "medium",
    platform = "linkedin",
    multiDraft = true,
    developerVoice = null,
  } = body;

  if (!summary) {
    return NextResponse.json({ error: "Missing activity summary." }, { status: 400 });
  }

  try {
    const result = await generateContentEnginePost({
      summary,
      angle,
      tone,
      length,
      platform,
      multiDraft,
      developerVoice,
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to generate post engine output." },
      { status: 500 }
    );
  }
}
