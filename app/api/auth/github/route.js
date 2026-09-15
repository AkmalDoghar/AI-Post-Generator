import { NextResponse } from "next/server";
import { getAppUrl, getGitHubAuthorizeUrl, hasGitHubProvider } from "../../../../lib/auth/config";

export async function GET(request) {
  if (!hasGitHubProvider()) {
    return NextResponse.redirect(new URL("/login?error=github_not_configured", process.env.AUTH_URL || "http://localhost:3000"));
  }

  const state = crypto.randomUUID();
  const origin = new URL(request.url).origin || getAppUrl();
  const response = NextResponse.redirect(getGitHubAuthorizeUrl(state, origin));
  response.cookies.set("gitpulse-oauth-state", state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600 });
  return response;
}
