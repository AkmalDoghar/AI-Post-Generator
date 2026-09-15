import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { normalizeEmail } from "../../../../../lib/auth/password";
import { sendPasswordResetOtp } from "../../../../../lib/auth/email";
import User from "../../../../../models/User";
import PasswordReset from "../../../../../models/PasswordReset";

function hashOtp(otp, salt) {
  return crypto.createHash("sha256").update(`${salt}:${otp}`).digest("hex");
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  const genericResponse = { message: "If an account exists for that email, a verification code has been sent." };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(genericResponse);
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user?.passwordHash) return NextResponse.json(genericResponse);

    const recentRequest = await PasswordReset.findOne({ email, createdAt: { $gt: new Date(Date.now() - 60_000) } });
    if (recentRequest) return NextResponse.json(genericResponse);

    const otp = String(crypto.randomInt(100000, 1000000));
    const salt = crypto.randomBytes(16).toString("hex");
    await PasswordReset.deleteMany({ email });
    const reset = await PasswordReset.create({
      email,
      userId: user._id,
      otpHash: `${salt}:${hashOtp(otp, salt)}`,
      expiresAt: new Date(Date.now() + 10 * 60_000),
    });

    await sendPasswordResetOtp(email, otp);
    const response = NextResponse.json(genericResponse);
    response.cookies.set("gitpulse-reset", String(reset._id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/auth/forgot-password",
      maxAge: 10 * 60,
    });
    return response;
  } catch (error) {
    console.error("Password reset request failed:", error.message);
    return NextResponse.json({ error: "Unable to send the verification code right now." }, { status: 500 });
  }
}
