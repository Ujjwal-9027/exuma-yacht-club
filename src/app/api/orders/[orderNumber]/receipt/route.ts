import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { EMAIL_RE, clean } from "@/lib/server-utils";
import { getEmailProvider } from "@/lib/email";
import { buildReceiptHtml, toReceiptData } from "@/lib/receipt";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasOrderAccess, orderAccessCookieName } from "@/lib/order-access";

type Props = { params: Promise<{ orderNumber: string }> };

export async function POST(req: Request, { params }: Props) {
  const { orderNumber } = await params;
  if (!/^EYC-[A-Z0-9]+$/.test(orderNumber)) {
    return NextResponse.json({ ok: false, error: "Receipt unavailable." }, { status: 404 });
  }

  const order = await db.getOrderByNumber(orderNumber);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(orderAccessCookieName(orderNumber))?.value;
  if (!hasOrderAccess(order, accessToken, await isAdminAuthed())) {
    return NextResponse.json({ ok: false, error: "Receipt unavailable." }, { status: 404 });
  }

  if (!(await db.rateLimit(`order-receipt:${order.id}`, 5, 15 * 60_000))) {
    return NextResponse.json(
      { ok: false, error: "Please wait before requesting another receipt." },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = clean(body?.email, 160);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const provider = getEmailProvider();
  if (!provider.configured) {
    return NextResponse.json({ ok: false, error: "Email delivery is not configured yet." }, { status: 503 });
  }

  try {
    await provider.send({
      to: email,
      subject: `Receipt for Exuma Yacht Club order ${order.orderNumber}`,
      html: buildReceiptHtml(toReceiptData(order)),
      replyTo: order.email,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "Receipt email failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "EAUTH"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Gmail rejected the SMTP login. Use a Gmail App Password, not your regular Gmail password.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: false, error: "Receipt email could not be sent." }, { status: 502 });
  }
}
