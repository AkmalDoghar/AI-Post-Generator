import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken, createSessionToken, sessionCookieOptions } from "../../../../lib/auth/session";
import { connectToDatabase } from "../../../../lib/db";
import User from "../../../../models/User";
import UserSettings from "../../../../models/UserSettings";
import PasswordReset from "../../../../models/PasswordReset";

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session || !session.sub) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const user = await User.findById(session.sub).lean();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        username: user.username || "",
        timezone: user.timezone || "UTC",
        avatarUrl: user.avatarUrl || "",
        linkedinConnected: Boolean(user.linkedinAccessToken),
        githubConnected: Boolean(user.githubId),
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      {
        user: {
          name: typeof session.name === "string" ? session.name : "",
          email: typeof session.email === "string" ? session.email : "",
        },
      },
      { status: 200 }
    );
  }
}

export async function PUT(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session || !session.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, bio, timezone, username, avatarUrl } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Full name must be at least 2 characters long." }, { status: 400 });
    }

    await connectToDatabase();

    // Check email uniqueness if email is changed
    if (email && email.trim().toLowerCase() !== session.email?.toLowerCase()) {
      const existingUser = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: session.sub },
      });
      if (existingUser) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
      }
    }

    const updateData = {
      name: name.trim(),
      bio: typeof bio === "string" ? bio.trim() : "",
      timezone: timezone || "UTC",
      ...(avatarUrl !== undefined ? { avatarUrl: typeof avatarUrl === "string" ? avatarUrl.trim() : "" } : {}),
      ...(username ? { username: username.trim() } : {}),
      ...(email ? { email: email.trim().toLowerCase() } : {}),
    };

    const updatedUser = await User.findByIdAndUpdate(session.sub, updateData, { new: true }).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Refresh session token with updated info
    const newSessionToken = await createSessionToken(updatedUser);
    const response = NextResponse.json({
      success: true,
      user: {
        id: String(updatedUser._id),
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        username: updatedUser.username,
        timezone: updatedUser.timezone,
        avatarUrl: updatedUser.avatarUrl,
      },
    });

    response.cookies.set(SESSION_COOKIE, newSessionToken, sessionCookieOptions);
    return response;
  } catch (error) {
    console.error("PUT /api/auth/me error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    await Promise.all([
      UserSettings.deleteOne({ userId: session.sub }),
      PasswordReset.deleteMany({ userId: session.sub }),
      User.findByIdAndDelete(session.sub),
    ]);

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
    return response;
  } catch (error) {
    console.error("DELETE /api/auth/me error:", error);
    return NextResponse.json({ error: "Unable to delete your account right now." }, { status: 500 });
  }
}
