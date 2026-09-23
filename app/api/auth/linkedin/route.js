import { NextResponse } from "next/server";

export async function GET(request) {
  const clientId = process.env.LINKEDIN_CLIENT_ID || "77sq6tzuliqiib";
  const { origin } = new URL(request.url);

  // Dynamic redirect URI depending on local vs production deployment
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${origin}/api/auth/linkedin/callback`;
  const state = Math.random().toString(36).substring(2, 15);

  const scope = encodeURIComponent("w_member_social");

  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${scope}`;

  const response = NextResponse.redirect(linkedinAuthUrl);
  response.cookies.set("linkedin_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  return response;
}
