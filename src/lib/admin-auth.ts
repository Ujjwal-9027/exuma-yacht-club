import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "@/db";

/**
 * Admin authentication — a single shared password from ADMIN_PASSWORD,
 * exchanged for a stateless HMAC-signed httpOnly cookie. No session table
 * required. Signed value is constant for the configured secret, so
 * rotating ADMIN_SESSION_SECRET (or the password) invalidates all cookies.
 */

export const ADMIN_COOKIE = "eyc_admin";
const TOKEN_SUBJECT = "eyc-admin-v1";

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

function expectedToken(): string | null {
  const s = secret();
  if (!s) return null;
  return createHmac("sha256", s).update(TOKEN_SUBJECT).digest("hex");
}

const scryptAsync = promisify(scrypt);

export async function verifyPassword(candidate: string): Promise<boolean> {
  const storedHash = process.env.MONGODB_URI ? await db.getAdminPasswordHash() : null;
  if (storedHash) {
    const [salt, encodedHash] = storedHash.split(":");
    if (!salt || !encodedHash) return false;
    const derivedKey = (await scryptAsync(candidate, salt, 64)) as Buffer;
    const expectedKey = Buffer.from(encodedHash, "hex");
    return expectedKey.length === derivedKey.length && timingSafeEqual(derivedKey, expectedKey);
  }
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function setAdminCookie(): Promise<void> {
  const token = expectedToken();
  if (!token) throw new Error("Admin not configured");
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
}

export async function clearAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function isAdminAuthed(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Guard for admin pages — redirects to the login screen when not authed. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }
}
