import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "../../../../lib/auth/session";

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({
    user: {
      name: typeof session.name === "string" ? session.name : "",
      email: typeof session.email === "string" ? session.email : "",
    },
  });
}
