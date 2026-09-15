import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import { hashPassword, normalizeEmail } from "../../../../lib/auth/password";
import User from "../../../../models/User";
import UserSettings from "../../../../models/UserSettings";

function validateInput(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2 || name.length > 120) return "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return { name, email, password };
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const input = validateInput(body);
  if (typeof input === "string") return NextResponse.json({ error: input }, { status: 400 });

  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email: input.email }).lean();
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
    });
    await UserSettings.create({ userId: user._id });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    console.error("Signup failed:", error.message);
    return NextResponse.json({ error: "Unable to create your account right now." }, { status: 500 });
  }
}
