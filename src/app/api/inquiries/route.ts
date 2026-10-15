import { NextResponse } from "next/server";
import { db } from "@/db";
import { EMAIL_RE, clean, clientKey, rateLimitDb } from "@/lib/server-utils";
import { notifyNewInquiry } from "@/lib/notifications";

const VALID_TYPES = new Set(["dockage", "stay", "dining", "fuel", "general"]);

export async function POST(req: Request) {
  try {
    if (!(await rateLimitDb(`inquiry:${clientKey(req)}`, 6, 60_000))) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    const body = (await req.json().catch(() => null)) as
      | Record<string, unknown>
      | null;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Invalid request." },
        { status: 400 },
      );
    }

    // Honeypot: silently accept bot submissions without storing anything.
    if (clean(body.companyWebsite, 200)) {
      return NextResponse.json({ ok: true, id: 0 });
    }

    const type = clean(body.type, 20);
    const fullName = clean(body.fullName, 120);
    const email = clean(body.email, 160);
    const arrivalDate = clean(body.arrivalDate, 20) || null;
    const departureDate = clean(body.departureDate, 20) || null;
    const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

    if ((arrivalDate && !DATE_RE.test(arrivalDate)) || (departureDate && !DATE_RE.test(departureDate))) {
      return NextResponse.json(
        { ok: false, error: "Please use a valid date (YYYY-MM-DD)." },
        { status: 400 },
      );
    }
    if (
      type !== "dining" &&
      arrivalDate &&
      departureDate &&
      departureDate <= arrivalDate
    ) {
      return NextResponse.json(
        { ok: false, error: "Departure must be after your arrival date." },
        { status: 400 },
      );
    }

    if (!VALID_TYPES.has(type)) {
      return NextResponse.json(
        { ok: false, error: "Unknown inquiry type." },
        { status: 400 },
      );
    }
    if (!fullName) {
      return NextResponse.json(
        { ok: false, error: "Please provide your full name." },
        { status: 400 },
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const row = await db.createInquiry({
        type,
        fullName,
        email,
        phone: clean(body.phone, 40) || null,
        vesselName: clean(body.vesselName, 120) || null,
        vesselLength: clean(body.vesselLength, 30) || null,
        arrivalDate,
        departureDate,
        timeOfDay: clean(body.timeOfDay, 10) || null,
        serviceRequirements: clean(body.serviceRequirements, 300) || null,
        partySize: clean(body.partySize, 10) || null,
        message: clean(body.message, 2000) || null,
      });

    await notifyNewInquiry(row);
    return NextResponse.json({ ok: true, id: row.id });
  } catch (err) {
    console.error("Inquiry submission failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't store your inquiry due to a server error. Please try again, or call us directly.",
      },
      { status: 500 },
    );
  }
}
