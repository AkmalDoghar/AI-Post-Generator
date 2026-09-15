import { NextResponse } from "next/server";
import { fetchActivitySummary } from "../../../lib/github";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || process.env.GITHUB_USERNAME;
  const requestedDays = Number(searchParams.get("days") || 7);
  const days = [1, 7, 30].includes(requestedDays) ? requestedDays : 7;

  if (!username) {
    return NextResponse.json(
      { error: "Missing username. Pass ?username= or set GITHUB_USERNAME." },
      { status: 400 }
    );
  }

  try {
    const summary = await fetchActivitySummary(username, days);
    return NextResponse.json(summary);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
