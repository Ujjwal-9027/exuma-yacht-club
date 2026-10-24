"use client";

import { useState } from "react";
import { Download, Loader2, Mail } from "lucide-react";
import { jsPDF } from "jspdf";
import { formatMoney } from "@/lib/format";
import {
  deliveryLabel,
  paymentLabel,
  paymentStatusLabel,
  type ReceiptData,
} from "@/lib/receipt";

async function loadLogoData(): Promise<string> {
  const response = await fetch("/logo/EYCflag.png");
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(new Error("The receipt logo could not be loaded."));
    reader.readAsDataURL(blob);
  });
}

export function ReceiptActions({ data }: { data: ReceiptData }) {
  const [email, setEmail] = useState(data.email);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "generating">(
    "idle",
  );

  async function downloadReceipt() {
    setDownloadStatus("generating");
    try {
      const logoData = await loadLogoData();
      const pdf = new jsPDF({ unit: "pt", format: "letter" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 46;
      const right = pageWidth - margin;
      const contentWidth = pageWidth - margin * 2;
      let y = 0;

      const drawHeader = () => {
        pdf.setFillColor(12, 39, 51);
        pdf.rect(0, 0, pageWidth, 128, "F");
        pdf.addImage(logoData, "PNG", margin, 31, 78, 48);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text("EXUMA YACHT CLUB", margin + 94, 47);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text("George Town · Bahamas", margin + 94, 65);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("ORDER RECEIPT", right, 43, { align: "right" });
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text(data.orderNumber, right, 61, { align: "right" });
        pdf.setFillColor(201, 168, 106);
        pdf.rect(margin, 101, contentWidth, 2, "F");
        y = 158;
      };
      const startNewPage = () => {
        pdf.addPage();
        drawHeader();
      };
      const ensureSpace = (height: number) => {
        if (y + height <= pageHeight - 58) return;
        startNewPage();
      };
      const text = (value: string | null | undefined) => value?.trim() || "-";
      const meta = (label: string, value: string, x: number, width: number) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        pdf.setTextColor(150, 119, 74);
        pdf.text(label.toUpperCase(), x, y);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(30, 36, 39);
        const lines = pdf.splitTextToSize(text(value), width - 86) as string[];
        pdf.text(lines, x + 86, y);
        return Math.max(18, lines.length * 12);
      };
      const drawTableHeader = () => {
        pdf.setFillColor(246, 242, 235);
        pdf.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        pdf.setTextColor(12, 39, 51);
        pdf.text("ITEM / PRODUCT", margin + 10, y + 17);
        pdf.text("QTY", margin + 330, y + 17, { align: "right" });
        pdf.text("UNIT PRICE", margin + 420, y + 17, { align: "right" });
        pdf.text("AMOUNT", right - 10, y + 17, { align: "right" });
        y += 38;
      };

      drawHeader();
      pdf.setTextColor(12, 39, 51);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Order summary", margin, y);
      y += 24;
      pdf.setDrawColor(226, 220, 209);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, y, contentWidth, 132, 4, 4, "FD");
      y += 22;
      const leftX = margin + 14;
      const rightX = margin + contentWidth / 2 + 8;
      const columnWidth = contentWidth / 2 - 28;
      const rows = [
        ["Order date", new Date(data.createdAt).toLocaleString("en-US")],
        ["Customer", text(data.customerName)],
        ["Email", text(data.email)],
        ["Delivery", deliveryLabel(data)],
        ["Payment", paymentLabel(data.paymentMethod, data.fulfillment)],
        ["Payment status", paymentStatusLabel(data)],
      ];
      rows.forEach(([label, value], index) => {
        const x = index % 2 === 0 ? leftX : rightX;
        if (index % 2 === 0 && index > 0) y += 22;
        const rowY = y;
        meta(label, value, x, columnWidth);
        if (index % 2 === 1) y = rowY;
      });
      y = 292;
      const address = data.shippingAddress
        ? [
            data.shippingAddress.addressLine1,
            data.shippingAddress.addressLine2,
            [
              data.shippingAddress.city,
              data.shippingAddress.region,
              data.shippingAddress.postalCode,
            ]
              .filter(Boolean)
              .join(", "),
            data.shippingAddress.country,
          ]
            .filter(Boolean)
            .join(", ")
        : "Collect at Exuma Yacht Club gift shop";
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(150, 119, 74);
      pdf.text("PAYMENT REFERENCE", leftX, y);
      pdf.text("ADDRESS", rightX, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(30, 36, 39);
      pdf.text(text(data.paymentReference), leftX, y + 16);
      pdf.text(
        pdf.splitTextToSize(address, columnWidth) as string[],
        rightX,
        y + 16,
      );
      y += 62;

      ensureSpace(80);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(12, 39, 51);
      pdf.text("Items", margin, y);
      y += 18;
      drawTableHeader();
      data.items.forEach((item) => {
        const description = `${text(item.name)}${item.size ? ` - ${item.size}` : ""}${item.color ? ` - ${item.color}` : ""}`;
        const lines = pdf.splitTextToSize(description, 270) as string[];
        const rowHeight = Math.max(26, lines.length * 13 + 10);
        ensureSpace(rowHeight + 10);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(30, 36, 39);
        pdf.text(lines, margin + 10, y);
        pdf.text(String(item.qty), margin + 330, y, { align: "right" });
        pdf.text(formatMoney(item.priceCents, data.currency), margin + 420, y, {
          align: "right",
        });
        pdf.text(
          formatMoney(item.priceCents * item.qty, data.currency),
          right - 10,
          y,
          { align: "right" },
        );
        y += rowHeight;
        pdf.setDrawColor(235, 231, 223);
        pdf.line(margin + 8, y - 7, right - 8, y - 7);
      });

      ensureSpace(128);
      y += 14;
      const totalBoxY = y;
      pdf.setFillColor(250, 248, 244);
      pdf.roundedRect(pageWidth - margin - 230, totalBoxY, 230, 96, 4, 4, "F");
      const totalLine = (label: string, value: string, strong = false) => {
        pdf.setFont("helvetica", strong ? "bold" : "normal");
        pdf.setFontSize(strong ? 13 : 9);
        pdf.setTextColor(12, 39, 51);
        pdf.text(label, pageWidth - margin - 214, y + 18);
        pdf.text(value, right - 14, y + 18, { align: "right" });
        y += strong ? 25 : 19;
      };
      totalLine("Subtotal", formatMoney(data.subtotalCents, data.currency));
      totalLine(
        "Delivery",
        data.shippingFeeCents
          ? formatMoney(data.shippingFeeCents, data.currency)
          : "Free",
      );
      totalLine(
        "GRAND TOTAL",
        formatMoney(data.totalCents, data.currency),
        true,
      );

      const footerY = pageHeight - 42;
      pdf.setDrawColor(201, 168, 106);
      pdf.line(margin, footerY - 14, right, footerY - 14);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(92, 104, 110);
      pdf.text("Thank you for choosing Exuma Yacht Club.", margin, footerY);
      pdf.text(`${data.contactPhone}  ·  ${data.website}`, right, footerY, {
        align: "right",
      });
      pdf.save(`${data.orderNumber}-receipt.pdf`);
    } finally {
      setDownloadStatus("idle");
    }
  }

  async function emailReceipt() {
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(data.orderNumber)}/receipt`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const body = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok)
        throw new Error(body.error || "Receipt email could not be sent.");
      setStatus("sent");
      setMessage("Receipt sent successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Receipt email could not be sent.",
      );
    }
  }

  return (
    <section
      className="mt-10 border border-sand-300 bg-ivory-100 p-6 sm:p-8"
      aria-labelledby="receipt-heading"
    >
      <h2 id="receipt-heading" className="font-display text-xl text-navy-900">
        Your receipt
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        Download a copy or send the full order receipt to an email address.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void downloadReceipt()}
          disabled={downloadStatus === "generating"}
          className="inline-flex items-center justify-center gap-2 border border-navy-900 bg-navy-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory-50 hover:bg-transparent hover:text-navy-900"
        >
          {downloadStatus === "generating" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          {downloadStatus === "generating"
            ? "Generating PDF…"
            : "Download PDF receipt"}
        </button>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="receipt-email">
          Receipt email address
        </label>
        <input
          id="receipt-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field flex-1"
          placeholder="Email address"
          autoComplete="email"
        />
        <button
          type="button"
          onClick={emailReceipt}
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 border border-gold-500 bg-gold-500 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-950 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Mail className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "sending" ? "Sending…" : "Email receipt"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm ${status === "error" ? "text-[#8f3526]" : "text-ink-500"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </section>
  );
}
