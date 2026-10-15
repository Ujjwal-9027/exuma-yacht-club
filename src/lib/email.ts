/**
 * EMAIL PROVIDER ABSTRACTION
 * ────────────────────────────────────────────────────────────────────────
 * Providers: SMTP via Nodemailer or Resend via REST API.
 * Configure with env vars (see .env.example):
 *   EMAIL_PROVIDER   — "smtp" or "resend"
 *   SMTP_HOST / SMTP_PORT / SMTP_SECURE
 *   SMTP_USER / SMTP_PASSWORD
 *   RESEND_API_KEY   — server-side secret
 *   NOTIFY_EMAIL     — staff inbox that receives inquiry/order alerts
 *   EMAIL_FROM       — verified sender (e.g. "Exuma Yacht Club <orders@yourdomain.com>")
 *
 * If any are missing, every send() logs a warning and resolves without
 * doing anything — the site never crashes because email isn't configured.
 */

import nodemailer from "nodemailer";
export { escapeHtml } from "@/lib/escape-html";

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export interface EmailProvider {
  id: string;
  configured: boolean;
  send(message: EmailMessage): Promise<void>;
}

const resendProvider: EmailProvider = {
  id: "resend",
  get configured() {
    return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
  },
  async send(message) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: message.to,
        subject: message.subject,
        html: message.html,
        reply_to: message.replyTo,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Resend send failed (${res.status}): ${detail.slice(0, 200)}`);
    }
  },
};

const smtpProvider: EmailProvider = {
  id: "smtp",
  get configured() {
    const host = process.env.SMTP_HOST ?? "";
    return Boolean(
      host &&
        !host.includes("example.com") &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASSWORD &&
        process.env.EMAIL_FROM,
    );
  },
  async send(message) {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: message.to,
      subject: message.subject,
      html: message.html,
      replyTo: message.replyTo,
    });
  },
};

export function getEmailProvider(): EmailProvider {
  return process.env.EMAIL_PROVIDER?.toLowerCase() === "smtp"
    ? smtpProvider
    : resendProvider;
}

let warned = false;

/** Fire-and-log email send. Never throws — notifications must not break requests. */
export async function sendNotification(message: EmailMessage): Promise<void> {
  const provider = getEmailProvider();
  const target = process.env.NOTIFY_EMAIL;
  if (!provider.configured || !target) {
    if (!warned) {
      console.warn(
        "Email provider / sender / notification recipient not configured — " +
          "notifications are being logged to the server console instead.",
      );
      warned = true;
    }
    console.info(`[email:dev] "${message.subject}" → ${target ?? "(no NOTIFY_EMAIL)"}`);
    return;
  }
  try {
    await provider.send({ ...message, to: target });
  } catch (err) {
    console.error("[email] notification failed:", err);
  }
}

/** Customer-facing transactional email (order confirmations). Never throws. */
export async function sendCustomerEmail(message: EmailMessage): Promise<void> {
  const provider = getEmailProvider();
  if (!provider.configured) {
    if (!warned) {
      console.warn("[email] provider not configured — customer emails are skipped.");
      warned = true;
    }
    return;
  }
  try {
    await provider.send(message);
  } catch (err) {
    console.error("[email] customer email failed:", err);
  }
}
