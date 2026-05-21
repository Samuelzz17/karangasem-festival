import { NextResponse } from "next/server";
import { getAdminAuth } from "../../../../lib/firebase-admin";
import { getSessionCookieName, isAuthorizedAdmin } from "../../../../lib/admin-auth";

const expiresIn = Number(process.env.SESSION_COOKIE_DAYS || 5) * 24 * 60 * 60 * 1000;

export async function POST(request) {
  const { idToken } = await request.json();
  if (!idToken) {
    return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
  }

  const decodedToken = await getAdminAuth().verifyIdToken(idToken);
  if (!isAuthorizedAdmin(decodedToken)) {
    return NextResponse.json({ error: "Unauthorized admin." }, { status: 403 });
  }

  const sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookieName(), sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresIn / 1000,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
