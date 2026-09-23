import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import User from "../../../../../models/User";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "default_gitpulse_secret_key_32_chars_long"
);

export async function GET(request) {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("linkedin_access_token")?.value;
  const urnCookie = cookieStore.get("linkedin_person_urn")?.value;
  const nameCookie = cookieStore.get("linkedin_profile_name")?.value;

  // Check DB for authenticated user
  const authToken = cookieStore.get("token")?.value;
  let dbUser = null;

  if (authToken) {
    try {
      await connectToDatabase();
      const verified = await jwtVerify(authToken, JWT_SECRET);
      dbUser = await User.findById(verified.payload.id).select(
        "linkedinAccessToken linkedinPersonUrn linkedinProfileName linkedinConnectedAt"
      );
    } catch {}
  }

  const accessToken = dbUser?.linkedinAccessToken || tokenCookie || process.env.LINKEDIN_ACCESS_TOKEN || "";
  const personUrn = dbUser?.linkedinPersonUrn || urnCookie || process.env.LINKEDIN_PERSON_URN || "";
  const profileName = dbUser?.linkedinProfileName || nameCookie || "LinkedIn Account";

  const connected = Boolean(accessToken);

  return NextResponse.json({
    connected,
    personUrn,
    profileName,
    hasToken: Boolean(accessToken),
    connectedAt: dbUser?.linkedinConnectedAt || null,
  });
}
