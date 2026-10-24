import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { EMAIL_RE, clean, clientKey, rateLimitDb } from "@/lib/server-utils";
import { getEmailProvider } from "@/lib/email";
import {
  createOrderAccessToken,
  hashOrderAccessCode,
  hashOrderAccessToken,
  orderAccessCookieName,
  ORDER_ACCESS_COOKIE_MAX_AGE,
  verifyOrderAccessCode,
} from "@/lib/order-access";

type Props = { params: Promise<{ orderNumber: string }> };
type AccessRequest = { action?: unknown; email?: unknown; code?: unknown };

const CODE_LIFETIME_MS = 10 * 60_000;
const GENERIC_REQUEST_MESSAGE =
  "If the email matches an order and delivery is available, a verification code will be sent.";

function isOrderNumber(value: string): boolean {
  return /^EYC-[A-Z0-9]+$/.test(value);
}

function sameEmail(candidate: string, stored: string): boolean {
  return candidate.trim().toLowerCase() === stored.trim().toLowerCase();
}

export async function POST(request: Request, { params }: Props) {
  const { orderNumber } = await params;
  const body = (await request.json().catch(() => null)) as AccessRequest | null;
  if (body?.action !== "request" && body?.action !== "verify") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const action = body.action;
  const email = clean(body.email, 160);
  const code = clean(body.code, 6);

  try {
    if (!(await rateLimitDb(`order-access-${action}:${clientKey(request)}`, 10, 15 * 60_000))) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please try again later." },
        { status: 429 },
      );
    }
    if (
      action === "verify" &&
      isOrderNumber(orderNumber) &&
      !(await rateLimitDb(`order-access-verify:${orderNumber}`, 5, 15 * 60_000))
    ) {
      return NextResponse.json(
        { ok: false, error: "The verification code is invalid or expired." },
        { status: 400 },
      );
    }

    const order = isOrderNumber(orderNumber)
      ? await db.getOrderByNumber(orderNumber)
      : null;

    if (action === "request") {
      if (order && EMAIL_RE.test(email) && sameEmail(email, order.email)) {
        const allowed = await rateLimitDb(
          `order-access-request:${order.id}`,
          3,
          15 * 60_000,
        );
        const provider = getEmailProvider();
        if (allowed && provider.configured) {
          const verificationCode = String(randomInt(100_000, 1_000_000));
          const codeHash = await hashOrderAccessCode(verificationCode);
          await db.setOrderAccessCode(
            order.id,
            codeHash,
            new Date(Date.now() + CODE_LIFETIME_MS),
          );
          try {
            await provider.send({
              to: order.email,
              subject: "Your Exuma Yacht Club order access code",
              text: `Your one-time order access code is ${verificationCode}. It expires in 10 minutes.`,
              html: `<p>Your one-time order access code is <strong>${verificationCode}</strong>.</p><p>It expires in 10 minutes. If you did not request this code, you can ignore this email.</p>`,
            });
          } catch {
            console.error("Order access code delivery failed.");
          }
        }
      }
      return NextResponse.json(
        { ok: true, message: GENERIC_REQUEST_MESSAGE },
        { status: 202 },
      );
    }

    if (
      !order ||
      !EMAIL_RE.test(email) ||
      !sameEmail(email, order.email) ||
      !/^\d{6}$/.test(code) ||
      !order.customerAccessCodeHash ||
      !order.customerAccessCodeExpiresAt ||
      order.customerAccessCodeExpiresAt <= new Date()
    ) {
      return NextResponse.json(
        { ok: false, error: "The verification code is invalid or expired." },
        { status: 400 },
      );
    }

    if (!(await verifyOrderAccessCode(code, order.customerAccessCodeHash))) {
      return NextResponse.json(
        { ok: false, error: "The verification code is invalid or expired." },
        { status: 400 },
      );
    }

    const accessToken = createOrderAccessToken();
    const consumed = await db.consumeOrderAccessCode(
      order.id,
      order.customerAccessCodeHash,
      new Date(),
      hashOrderAccessToken(accessToken),
    );
    if (!consumed) {
      return NextResponse.json(
        { ok: false, error: "The verification code is invalid or expired." },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(orderAccessCookieName(orderNumber), accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ORDER_ACCESS_COOKIE_MAX_AGE,
    });
    return response;
  } catch {
    console.error("Order access verification failed.");
    return NextResponse.json(
      { ok: false, error: "Order access could not be verified." },
      { status: 500 },
    );
  }
}