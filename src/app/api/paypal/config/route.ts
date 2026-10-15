import { NextResponse } from "next/server";
import { getPayPalClientId } from "@/lib/paypal";

export function GET() {
  const clientId = getPayPalClientId();
  return NextResponse.json({ enabled: Boolean(clientId), clientId });
}