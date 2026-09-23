import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { getAppUrl, getGitHubCallbackUrl, hasGitHubProvider } from "../../../../../lib/auth/config";
import { normalizeEmail } from "../../../../../lib/auth/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "../../../../../lib/auth/session";
import User from "../../../../../models/User";
import UserSettings from "../../../../../models/UserSettings";

export async function GET(request) {
  const url = new URL(request.url);
  const stateCookie = request.cookies.get("gitpulse-oauth-state")?.value;
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!hasGitHubProvider() || !code || !state || state !== stateCookie) {
    return NextResponse.redirect(new URL("/login?error=github_failed", getAppUrl()));
  }

  try {
    const callbackUrl = getGitHubCallbackUrl(url.origin);
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: process.env.AUTH_GITHUB_ID, client_secret: process.env.AUTH_GITHUB_SECRET, code, redirect_uri: callbackUrl }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) throw new Error("GitHub token exchange failed");

    const githubHeaders = { Authorization: `Bearer ${tokenData.access_token}`, Accept: "application/vnd.github+json" };
    const [profileResponse, emailsResponse] = await Promise.all([
      fetch("https://api.github.com/user", { headers: githubHeaders }),
      fetch("https://api.github.com/user/emails", { headers: githubHeaders }),
    ]);
    const profile = await profileResponse.json();
    const emails = await emailsResponse.json();
    const primaryEmail = Array.isArray(emails) ? emails.find((item) => item.primary && item.verified)?.email : null;
    const email = normalizeEmail(primaryEmail || profile.email);
    if (!profileResponse.ok || !email) throw new Error("GitHub account has no verified email");

    await connectToDatabase();
    let user = await User.findOne({ $or: [{ githubId: String(profile.id) }, { email }] });
    if (!user) {
      user = await User.create({ name: profile.name || profile.login, email, githubId: String(profile.id), username: profile.login, avatarUrl: profile.avatar_url, emailVerified: new Date() });
      await UserSettings.create({ userId: user._id });
    } else if (!user.githubId) {
      user.githubId = String(profile.id);
      user.username = profile.login;
      user.avatarUrl = profile.avatar_url;
      await user.save();
    }

    const response = NextResponse.redirect(new URL("/dashboard", url.origin));
    response.cookies.set(SESSION_COOKIE, await createSessionToken(user), sessionCookieOptions);
    response.cookies.set("gitpulse-oauth-state", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("GitHub sign-in failed:", error.message);
    return NextResponse.redirect(new URL("/login?error=github_failed", url.origin));
  }
}
