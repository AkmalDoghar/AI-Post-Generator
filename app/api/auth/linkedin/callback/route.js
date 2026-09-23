import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import User from "../../../../../models/User";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "default_gitpulse_secret_key_32_chars_long"
);

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error || !code) {
    console.error("LinkedIn OAuth Error:", error, errorDescription);
    return NextResponse.redirect(`${origin}/settings?linkedin_error=${encodeURIComponent(errorDescription || "Authorization cancelled")}`);
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID || "77sq6tzuliqiib";
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || "";
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${origin}/api/auth/linkedin/callback`;

  try {
    // 1. Exchange Code for Access Token
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || "Failed to exchange code for access token.");
    }

    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 5184000;

    // 2. Fetch User Profile & Person URN via /v2/me (works with w_member_social)
    let personUrn = "";
    let profileName = "";

    try {
      const meRes = await fetch("https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName)", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.id) {
          personUrn = `urn:li:person:${meData.id}`;
          profileName = [meData.localizedFirstName, meData.localizedLastName].filter(Boolean).join(" ");
        }
      } else {
        const errBody = await meRes.json().catch(() => ({}));
        console.warn("LinkedIn /v2/me error:", errBody);
      }
    } catch (err) {
      console.warn("Could not fetch LinkedIn /v2/me profile:", err);
    }

    // 3. Store Credentials in User DB & Secure Cookies
    await connectToDatabase();
    const token = cookies().get("token")?.value;
    let userId = null;

    if (token) {
      try {
        const verified = await jwtVerify(token, JWT_SECRET);
        userId = verified.payload.id;
      } catch {}
    }

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        linkedinAccessToken: accessToken,
        linkedinPersonUrn: personUrn,
        linkedinProfileName: profileName || "LinkedIn Member",
        linkedinConnectedAt: new Date(),
      });
    }

    // Build Response Redirect with status
    const response = NextResponse.redirect(`${origin}/settings?linkedin=success&name=${encodeURIComponent(profileName)}&urn=${encodeURIComponent(personUrn)}`);

    // Set HTTP-Only cookies so server routes can access token directly
    response.cookies.set("linkedin_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      path: "/",
    });

    if (personUrn) {
      response.cookies.set("linkedin_person_urn", personUrn, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: expiresIn,
        path: "/",
      });
    }

    if (profileName) {
      response.cookies.set("linkedin_profile_name", profileName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: expiresIn,
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("LinkedIn OAuth Callback error:", err);
    return NextResponse.redirect(`${origin}/settings?linkedin_error=${encodeURIComponent(err.message || "Failed to complete LinkedIn authentication")}`);
  }
}
