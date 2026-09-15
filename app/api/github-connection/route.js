import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import { SESSION_COOKIE, verifySessionToken } from "../../../lib/auth/session";
import User from "../../../models/User";

async function getCurrentUser(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session?.sub) return null;
  await connectToDatabase();
  return User.findById(session.sub);
}

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    return NextResponse.json({ connected: Boolean(user.username), username: user.username || "" });
  } catch (error) {
    console.error("GitHub connection lookup failed:", error.message);
    return NextResponse.json({ error: "Unable to read GitHub connection." }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim() : "";
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return NextResponse.json({ error: "Enter a valid GitHub username." }, { status: 400 });
  }

  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    user.username = username;
    await user.save();
    return NextResponse.json({ connected: true, username });
  } catch (error) {
    console.error("GitHub connection save failed:", error.message);
    return NextResponse.json({ error: "Unable to save GitHub connection." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    user.username = undefined;
    await user.save();
    return NextResponse.json({ connected: false, username: "" });
  } catch (error) {
    console.error("GitHub connection removal failed:", error.message);
    return NextResponse.json({ error: "Unable to disconnect GitHub." }, { status: 500 });
  }
}
