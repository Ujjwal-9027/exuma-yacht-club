import { NextResponse } from "next/server";
import { db } from "@/db";
import type { InquiryStatus } from "@/db/schema";
import { isAdminAuthed } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const validTypes = new Set(["general", "dining", "dockage", "stay", "fuel"]);
const validStatuses = new Set<InquiryStatus>([
  "new",
  "read",
  "in_progress",
  "replied",
  "confirmed",
  "declined",
  "archived",
]);

function dateValue(value: string | null, end = false): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T${end ? "23:59:59.999" : "00:00:00.000"}Z`);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

function spreadsheetSafe(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function csvCell(value: unknown): string {
  const text = spreadsheetSafe(String(value ?? ""));
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = validTypes.has(url.searchParams.get("type") ?? "")
    ? url.searchParams.get("type") ?? undefined
    : undefined;
  const statusValue = url.searchParams.get("status") ?? "";
  const status = validStatuses.has(statusValue as InquiryStatus)
    ? (statusValue as InquiryStatus)
    : undefined;
  const inquiries = await db.listInquiries({
    type,
    status,
    search: (url.searchParams.get("q") ?? "").slice(0, 120),
    from: dateValue(url.searchParams.get("from")),
    to: dateValue(url.searchParams.get("to"), true),
    limit: 10000,
  });

  const rows = [
    ["Date", "Type", "Name", "Email", "Phone", "Message", "Status", "Read"],
    ...inquiries.map((inquiry) => [
      inquiry.createdAt.toISOString(),
      inquiry.type,
      inquiry.fullName,
      inquiry.email,
      inquiry.phone ?? "",
      inquiry.message ?? inquiry.serviceRequirements ?? "",
      inquiry.status ?? "new",
      inquiry.readAt ? "Yes" : "No",
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  return new NextResponse(`\uFEFF${csv}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=eyc-inquiries.csv",
      "Cache-Control": "no-store",
    },
  });
}
