import {
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import type { Order } from "@/db/schema";

export const ORDER_ACCESS_COOKIE_PREFIX = "eyc_order_";
export const ORDER_ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const scryptAsync = promisify(scrypt);

export function createOrderAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function orderAccessCookieName(orderNumber: string): string {
  return `${ORDER_ACCESS_COOKIE_PREFIX}${orderNumber}`;
}

export function hashOrderAccessToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function hasOrderAccess(
  order: Order | null,
  token: string | undefined,
  isAdmin: boolean,
): order is Order {
  if (!order) return false;
  if (isAdmin) return true;
  if (!token || !order.customerAccessTokenHash) return false;

  const expected = Buffer.from(order.customerAccessTokenHash, "hex");
  const actual = Buffer.from(hashOrderAccessToken(token), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function hashOrderAccessCode(code: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(code, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyOrderAccessCode(
  code: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, encodedHash] = storedHash.split(":");
  if (!salt || !encodedHash) return false;

  const expected = Buffer.from(encodedHash, "hex");
  const actual = (await scryptAsync(code, salt, expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}