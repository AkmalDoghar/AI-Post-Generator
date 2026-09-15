import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "../../../../../lib/db";
import { hashPassword } from "../../../../../lib/auth/password";
import PasswordReset from "../../../../../models/PasswordReset";
import User from "../../../../../models/User";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const resetId = cookies().get("gitpulse-reset")?.value || "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!resetId || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const reset = await PasswordReset.findOne({ _id: resetId, expiresAt: { $gt: new Date() }, consumedAt: null, verifiedAt: { $ne: null } });
    if (!reset) return NextResponse.json({ error: "Your reset session is invalid or expired." }, { status: 400 });

    await User.updateOne({ _id: reset.userId }, { $set: { passwordHash: await hashPassword(password) } });
    reset.consumedAt = new Date();
    await reset.save();
    const response = NextResponse.json({ ok: true });
    response.cookies.set("gitpulse-reset", "", { httpOnly: true, path: "/api/auth/forgot-password", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("Password reset failed:", error.message);
    return NextResponse.json({ error: "Unable to reset your password right now." }, { status: 500 });
  }
}
