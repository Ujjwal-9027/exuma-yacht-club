import { NextResponse } from "next/server";
import { db } from "@/db";
import { EMAIL_RE, clean } from "@/lib/server-utils";
import { getEmailProvider } from "@/lib/email";
import { buildReceiptHtml, toReceiptData } from "@/lib/receipt";

type Props = { params: Promise<{ orderNumber: string }> };

export async function POST(req: Request, { params }: Props) {
  const { orderNumber } = await params;
  if (!/^EYC-[A-Z0-9]+$/.test(orderNumber)) {
    return NextResponse.json({ ok: false, error: "Invalid order number." }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = clean(body?.email, 160);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const order = await db.getOrderByNumber(orderNumber);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
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
    console.error("Receipt email failed:", error);
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
