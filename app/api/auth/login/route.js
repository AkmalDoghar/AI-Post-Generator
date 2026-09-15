import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import { normalizeEmail, verifyPassword } from "../../../../lib/auth/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "../../../../lib/auth/session";
import User from "../../../../models/User";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!password) return NextResponse.json({ error: "Password is required." }, { status: 400 });

  try {
    await connectToDatabase();
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return NextResponse.json({ error: "No account found for this email. Please sign up first." }, { status: 401 });
    }
    if (!user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, await createSessionToken(user), sessionCookieOptions);
    return response;
  } catch (error) {
    console.error("Login failed:", error.message);
    return NextResponse.json({ error: "Unable to sign you in right now." }, { status: 500 });
  }
}
