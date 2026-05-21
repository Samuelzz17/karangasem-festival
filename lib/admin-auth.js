import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "./firebase-admin";

const sessionCookieName = process.env.SESSION_COOKIE_NAME || "karangasem_session";
const allowedEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAuthorizedAdmin(decodedToken) {
  if (!decodedToken) return false;
  if (decodedToken.admin === true) return true;
  if (decodedToken.role === "admin") return true;
  if (decodedToken.email && allowedEmails.includes(decodedToken.email.toLowerCase())) return true;
  return false;
}

export async function verifyAdminSessionFromRequest(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((pair) => pair.trim())
    .find((pair) => pair.startsWith(`${sessionCookieName}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  if (!sessionCookie) return null;

  const decodedToken = await getAdminAuth().verifySessionCookie(sessionCookie, true);
  if (!isAuthorizedAdmin(decodedToken)) return null;
  return decodedToken;
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName)?.value;
  if (!sessionCookie) redirect("/admin/login");

  const decodedToken = await getAdminAuth().verifySessionCookie(sessionCookie, true);
  if (!isAuthorizedAdmin(decodedToken)) redirect("/admin/login");
  return decodedToken;
}

export function getSessionCookieName() {
  return sessionCookieName;
}
