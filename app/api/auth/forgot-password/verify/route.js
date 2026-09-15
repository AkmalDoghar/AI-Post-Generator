import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import PasswordReset from "../../../../../models/PasswordReset";

function hashOtp(otp, salt) {
  return crypto.createHash("sha256").update(`${salt}:${otp}`).digest("hex");
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";
  const resetId = cookies().get("gitpulse-reset")?.value || "";

  if (!resetId || !/^\d{6}$/.test(otp)) {
    return NextResponse.json({ error: "Enter the 6-digit verification code." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const reset = await PasswordReset.findOne({ _id: resetId, expiresAt: { $gt: new Date() }, consumedAt: null });
    if (!reset || reset.attempts >= 5) {
      return NextResponse.json({ error: "This verification code is invalid or expired." }, { status: 400 });
    }

    const [salt, expectedHash] = reset.otpHash.split(":");
    if (hashOtp(otp, salt) !== expectedHash) {
      reset.attempts += 1;
      await reset.save();
      return NextResponse.json({ error: "This verification code is invalid or expired." }, { status: 400 });
    }

    reset.verifiedAt = new Date();
    await reset.save();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Password reset verification failed:", error.message);
    return NextResponse.json({ error: "Unable to verify the code right now." }, { status: 500 });
  }
}
