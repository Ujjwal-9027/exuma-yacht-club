"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import {
  clearAdminCookie,
  isAdminAuthed,
  setAdminCookie,
  verifyPassword,
} from "@/lib/admin-auth";
import { EMAIL_RE, rateLimitDb } from "@/lib/server-utils";
import type { InquiryStatus, ProductImage, ProductVariant } from "@/db/schema";
import {
  DEFAULT_ORDER_STATUS_EMAIL_TEMPLATES,
  ORDER_STATUS_EMAIL_STATUSES,
} from "@/lib/order-email-templates";
import {
  sendOrderCancellationToCustomer,
  sendOrderStatusUpdateToCustomer,
} from "@/lib/notifications";

const ORDER_STATUSES = new Set([
  "pending",
  "processing",
  "ready",
  "shipped",
  "delivered",
  "fulfilled",
  "cancelled",
]);

const INQUIRY_STATUSES = z.enum([
  "new",
  "read",
  "in_progress",
  "replied",
  "confirmed",
  "declined",
  "archived",
]);
const INQUIRY_ID = z.number().int().positive();

export type LoginState = { error: string | null };
export type ActionState = { error: string | null };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  // Throttle brute-force attempts per password-guess window.
  if (!(await rateLimitDb("admin-login", 5, 60_000))) {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/login");
}

async function assertAdmin(): Promise<void> {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }
}

export async function markInquiryHandled(
  id: number,
  handled: boolean,
): Promise<void> {
  await assertAdmin();
  await db.updateInquiryStatus(id, handled ? "replied" : "new");
  revalidatePath("/admin/inquiries");
}

export async function updateInquiryStatusAction(
  id: number,
  formData: FormData,
): Promise<void> {
  await assertAdmin();
  const inquiryId = INQUIRY_ID.parse(id);
  const nextStatus = INQUIRY_STATUSES.parse(String(formData.get("status") ?? ""));
  const requestedReturnTo = String(formData.get("returnTo") ?? "");
  const returnTo = requestedReturnTo.startsWith("/admin/")
    ? requestedReturnTo
    : `/admin/inquiries/${inquiryId}?saved=status`;
  const inquiry = await db.getInquiryById(inquiryId);
  if (!inquiry) redirect("/admin/inquiries?error=missing");
  if ((nextStatus === "confirmed" || nextStatus === "declined") && inquiry.type !== "dining") {
    redirect(`/admin/inquiries/${inquiryId}?error=status`);
  }
  await db.updateInquiryStatus(inquiryId, nextStatus);
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
  revalidatePath("/admin");
  redirect(returnTo);
}

export async function markInquiryReadAction(id: number): Promise<void> {
  await assertAdmin();
  const inquiryId = INQUIRY_ID.parse(id);
  await db.markInquiryRead(inquiryId);
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
  revalidatePath("/admin");
}

export async function addInquiryNoteAction(
  id: number,
  formData: FormData,
): Promise<void> {
  await assertAdmin();
  const inquiryId = INQUIRY_ID.parse(id);
  const text = z
    .string()
    .trim()
    .min(1, "Enter a note before saving.")
    .max(2000, "Notes must be 2,000 characters or fewer.")
    .parse(String(formData.get("note") ?? ""));
  await db.addInquiryNote(inquiryId, {
    id: randomUUID(),
    text,
    createdAt: new Date(),
  });
  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

export async function updateOrderStatus(
  id: number,
  status: string,
): Promise<void> {
  await assertAdmin();
  if (!ORDER_STATUSES.has(status)) return;
  const existing = await db.getOrderById(id);
  if (!existing) return;
  if (status === "cancelled") {
    redirect(`/admin/orders/${id}?error=cancel-reason`);
  }
  await db.setOrderStatus(id, status);
  if (existing.status !== status) {
    await sendOrderStatusUpdateToCustomer(
      { ...existing, status, fulfillmentStatus: status },
      status,
    );
  }
  revalidatePath("/admin/orders");
}

export async function updateOrderDetailsAction(
  id: number,
  formData: FormData,
): Promise<void> {
  await assertAdmin();
  const status = String(formData.get("status") ?? "");
  if (!ORDER_STATUSES.has(status)) redirect("/admin/orders");
  const existing = await db.getOrderById(id);
  if (!existing) redirect("/admin/orders?error=order-missing");
  const cancellationReason = String(formData.get("cancellationReason") ?? "")
    .trim()
    .slice(0, 1000);
  if (status === "cancelled" && !cancellationReason) {
    redirect(`/admin/orders/${id}?error=cancel-reason`);
  }
  await db.setOrderStatus(id, status, {
    shippingCarrier: String(formData.get("shippingCarrier") ?? "").trim().slice(0, 120) || null,
    trackingNumber: String(formData.get("trackingNumber") ?? "").trim().slice(0, 160) || null,
    cancellationReason: status === "cancelled" ? cancellationReason : null,
  });
  if (status === "cancelled" && existing.status !== "cancelled") {
    await sendOrderCancellationToCustomer({
      ...existing,
      status: "cancelled",
      fulfillmentStatus: "cancelled",
      cancellationReason,
    }, cancellationReason);
  } else if (status !== "cancelled" && existing.status !== status) {
    await sendOrderStatusUpdateToCustomer(
      { ...existing, status, fulfillmentStatus: status },
      status,
    );
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}`);
}

function listValues(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}

function moneyToCents(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) throw new Error("Enter valid prices with no more than two decimal places.");
  const cents = Math.round(Number(raw) * 100);
  if (!Number.isSafeInteger(cents) || cents < 0) throw new Error("Prices must be non-negative.");
  return cents;
}

function parseVariants(value: FormDataEntryValue | null): ProductVariant[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error("Variants must be valid JSON."); }
  if (!Array.isArray(parsed) || parsed.length > 100) throw new Error("Variants must be a list of 100 items or fewer.");
  return parsed.map((item, index) => {
    if (!item || typeof item !== "object") throw new Error(`Variant ${index + 1} is invalid.`);
    const record = item as Record<string, unknown>;
    const stockQty = record.stockQty == null || record.stockQty === "" ? null : Number(record.stockQty);
    const priceCents = record.priceCents == null || record.priceCents === "" ? null : Number(record.priceCents);
    if ((stockQty !== null && (!Number.isInteger(stockQty) || stockQty < 0)) || (priceCents !== null && (!Number.isInteger(priceCents) || priceCents < 0))) throw new Error(`Variant ${index + 1} has invalid stock or price.`);
    return {
      id: String(record.id ?? `variant-${index + 1}`).slice(0, 80),
      size: record.size ? String(record.size).trim().slice(0, 40) : null,
      color: record.color ? String(record.color).trim().slice(0, 40) : null,
      sku: record.sku ? String(record.sku).trim().slice(0, 80) : null,
      priceCents,
      stockQty,
    };
  });
}

function parseGallery(value: FormDataEntryValue | null): ProductImage[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error("Product images could not be saved."); }
  if (!Array.isArray(parsed) || parsed.length > 100) throw new Error("A product can have up to 100 images.");
  const images = parsed.map((item, index) => {
    if (!item || typeof item !== "object") throw new Error("Product images could not be saved.");
    const record = item as Record<string, unknown>;
    const url = String(record.url ?? "").trim().slice(0, 500);
    if (!url || !(url.startsWith("/") || url.startsWith("https://"))) throw new Error("Product image paths must be local paths or HTTPS URLs.");
    return { id: String(record.id ?? `image-${index + 1}`).slice(0, 100), url, alt: String(record.alt ?? "").trim().slice(0, 200), order: index, isMain: record.isMain === true };
  });
  if (images.length > 0 && !images.some((image) => image.isMain)) images[0].isMain = true;
  let foundMain = false;
  return images.map((image) => ({ ...image, isMain: image.isMain && !foundMain ? ((foundMain = true), true) : false }));
}

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const slug = slugify(String(formData.get("slug") || name));
  const tagline = String(formData.get("tagline") ?? "").trim().slice(0, 240);
  const description = String(formData.get("description") ?? "").trim().slice(0, 5000);
  const category = String(formData.get("category") ?? "").trim().slice(0, 80);
  const stockQty = Number(formData.get("stockQty") ?? 0);
  const trackInventory = formData.get("trackInventory") === "on";
  const existing = id > 0 ? await db.getProductById(id) : null;
  const legacyImage = String(formData.get("image") ?? "").trim().slice(0, 500);
  let image = legacyImage;
  try {
    const gallery = parseGallery(formData.get("imageGallery"));
    if (gallery.length > 0) image = gallery.find((entry) => entry.isMain)?.url ?? gallery[0].url;
    else if (legacyImage.startsWith("/uploads/products/")) image = "";
    const compareAtPriceCents = moneyToCents(formData.get("compareAtPrice"));
    const salePriceCents = moneyToCents(formData.get("salePrice"));
    if (salePriceCents !== null && salePriceCents >= (compareAtPriceCents ?? moneyToCents(formData.get("price")) ?? 0)) throw new Error("Sale price must be lower than the regular or compare-at price.");
    const saleStartsAt = String(formData.get("saleStartsAt") ?? "").trim();
    const saleEndsAt = String(formData.get("saleEndsAt") ?? "").trim();
    const starts = saleStartsAt ? new Date(saleStartsAt) : null;
    const ends = saleEndsAt ? new Date(saleEndsAt) : null;
    if ((starts && Number.isNaN(starts.valueOf())) || (ends && Number.isNaN(ends.valueOf())) || (starts && ends && starts >= ends)) throw new Error("Sale dates must be valid and the end must be after the start.");
    const variants = parseVariants(formData.get("variants"));
    const sizes = listValues(formData.get("sizes"));
    const sizedVariants = sizes.length > 1 ? variants : [];
    if (sizes.length > 1) {
      const variantSizes = sizedVariants.map((variant) => variant.size).filter(Boolean);
      const hasDuplicateSize = new Set(variantSizes).size !== variantSizes.length;
      const missingSize = sizes.some((size) => !variantSizes.includes(size));
      if (hasDuplicateSize || missingSize || sizedVariants.length !== sizes.length) {
        throw new Error("Set a stock quantity for every product size before saving.");
      }
      if (sizedVariants.some((variant) => variant.stockQty === null)) {
        throw new Error("Enter stock for every product size before saving.");
      }
    }
    const variantStockQty = sizedVariants.reduce((total, variant) => total + (variant.stockQty ?? 0), 0);
    const status = String(formData.get("status") ?? "published");
    if (!["draft", "published", "archived"].includes(status)) throw new Error("Choose a valid publishing status.");
    const galleryValues = gallery.length > 0 ? gallery : (image ? [{ id: "legacy-main", url: image, alt: String(formData.get("imageAlt") ?? name).trim().slice(0, 200), order: 0, isMain: true }] : []);
    const input = {
      slug,
      sku: String(formData.get("sku") ?? "").trim().slice(0, 80) || null,
      name,
      tagline,
      description,
      category,
      priceCents: moneyToCents(formData.get("price")) ?? -1,
      currency: "USD",
      image,
      imageAlt: String(formData.get("imageAlt") ?? name).trim().slice(0, 200),
      images: galleryValues,
      sizes,
      colors: listValues(formData.get("colors")),
      active: status === "published",
      status: status as "draft" | "published" | "archived",
      publishedAt: status === "published" ? existing?.publishedAt ?? new Date() : null,
      trackInventory,
      stockQty: trackInventory ? (sizedVariants.length > 0 ? variantStockQty : stockQty) : null,
      lowStockThreshold: formData.get("lowStockThreshold") ? Number(formData.get("lowStockThreshold")) : null,
      outOfStockBehavior: formData.get("outOfStockBehavior") === "show" ? ("show" as const) : ("hide" as const),
      compareAtPriceCents,
      salePriceCents,
      saleStartsAt: starts,
      saleEndsAt: ends,
      variants: sizedVariants,
      featured: formData.get("featured") === "on",
      newArrival: formData.get("newArrival") === "on",
      newArrivalWindowDays: Number(formData.get("newArrivalWindowDays") ?? 30),
      limitedEdition: formData.get("limitedEdition") === "on",
      eycExclusive: formData.get("eycExclusive") === "on",
      giftIdea: formData.get("giftIdea") === "on",
      collections: listValues(formData.get("collections")),
      sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      metaTitle: String(formData.get("metaTitle") ?? "").trim().slice(0, 160) || null,
      metaDescription: String(formData.get("metaDescription") ?? "").trim().slice(0, 320) || null,
      material: String(formData.get("material") ?? "").trim().slice(0, 160) || null,
      fit: String(formData.get("fit") ?? "").trim().slice(0, 160) || null,
      careInstructions: String(formData.get("careInstructions") ?? "").trim().slice(0, 1000) || null,
      dimensions: String(formData.get("dimensions") ?? "").trim().slice(0, 160) || null,
      weight: String(formData.get("weight") ?? "").trim().slice(0, 80) || null,
    };
    if (!name || !slug || !category || !Number.isInteger(input.priceCents) || input.priceCents < 0 || !Number.isInteger(stockQty) || stockQty < 0 || (input.lowStockThreshold !== null && (!Number.isInteger(input.lowStockThreshold) || input.lowStockThreshold < 0)) || !Number.isInteger(input.newArrivalWindowDays) || input.newArrivalWindowDays < 1 || input.newArrivalWindowDays > 365) throw new Error("Enter a name, category, valid price, stock, threshold, and new-arrival window.");
    try {
      if (id > 0) await db.updateProduct(id, input);
      else await db.createProduct(input);
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("duplicate")) return { error: "That slug is already in use. Choose a unique slug." };
      return { error: "The product could not be saved. Check the values and try again." };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The product could not be saved." };
  }
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(id: number): Promise<void> {
  await assertAdmin();
  const result = await db.deleteProduct(id);
  revalidatePath("/admin/products");
  if (result === "ordered") redirect("/admin/products?error=ordered");
  if (result === "missing") redirect("/admin/products?error=missing");
  redirect("/admin/products?deleted=1");
}

export async function saveSiteSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const current = await db.getSiteSettings();
  const orderStatusEmailTemplates = Object.fromEntries(
    ORDER_STATUS_EMAIL_STATUSES.map((status) => {
      const fallback =
        current?.orderStatusEmailTemplates?.[status] ??
        DEFAULT_ORDER_STATUS_EMAIL_TEMPLATES[status];
      const subject = String(formData.get(`orderEmail_${status}_subject`) ?? "")
        .trim()
        .slice(0, 180);
      const body = String(formData.get(`orderEmail_${status}_body`) ?? "")
        .trim()
        .slice(0, 4000);
      return [
        status,
        {
          subject: subject || fallback.subject,
          body: body || fallback.body,
        },
      ];
    }),
  );
  const input = {
    businessName: String(formData.get("businessName") ?? "").trim().slice(0, 160),
    contactEmail: String(formData.get("contactEmail") ?? "").trim().slice(0, 160),
    addressStreet: String(formData.get("addressStreet") ?? "").trim().slice(0, 160),
    addressLocality: String(formData.get("addressLocality") ?? "").trim().slice(0, 160),
    addressCountry: String(formData.get("addressCountry") ?? "").trim().slice(0, 120),
    addressPoBox: String(formData.get("addressPoBox") ?? "").trim().slice(0, 160),
    marinaPhone: String(formData.get("marinaPhone") ?? "").trim().slice(0, 60),
    restaurantPhone: String(formData.get("restaurantPhone") ?? "").trim().slice(0, 60),
    whatsappLabel: String(formData.get("whatsappLabel") ?? "").trim().slice(0, 60),
    vhfChannel: String(formData.get("vhfChannel") ?? "").trim().slice(0, 60),
    googleMapsUrl: String(formData.get("googleMapsUrl") ?? "").trim().slice(0, 500),
    socialFacebook: String(formData.get("socialFacebook") ?? "").trim().slice(0, 500),
    socialInstagram: String(formData.get("socialInstagram") ?? "").trim().slice(0, 500),
    inquiryNotificationEmail: String(formData.get("inquiryNotificationEmail") ?? "").trim().slice(0, 160),
    orderNotificationEmail: String(formData.get("orderNotificationEmail") ?? "").trim().slice(0, 160),
    resnexusBookingUrl: String(formData.get("resnexusBookingUrl") ?? "").trim().slice(0, 500),
    dockwaUrl: String(formData.get("dockwaUrl") ?? "").trim().slice(0, 500),
    whatsappNumber: String(formData.get("whatsappNumber") ?? "").replace(/[^0-9]/g, "").slice(0, 20),
    seoTitle: String(formData.get("seoTitle") ?? "").trim().slice(0, 160),
    seoDescription: String(formData.get("seoDescription") ?? "").trim().slice(0, 320),
    homeHeroTitle: current?.homeHeroTitle ?? "Your Exuma escape starts here.",
    homeHeroLede: current?.homeHeroLede ?? "Marina services, island stays, waterfront dining and essentials — all on the edge of Elizabeth Harbour.",
    orderStatusEmailTemplates,
  };
  if (!input.businessName || !input.seoTitle) return { error: "Business name and SEO title are required." };
  if ((input.inquiryNotificationEmail && !EMAIL_RE.test(input.inquiryNotificationEmail)) || (input.orderNotificationEmail && !EMAIL_RE.test(input.orderNotificationEmail))) {
    return { error: "Notification email addresses must be valid email addresses." };
  }
  for (const [label, value] of [["Facebook", input.socialFacebook], ["Instagram", input.socialInstagram]] as const) {
    if (value && !value.includes("PLACEHOLDER")) {
      try {
        if (new URL(value).protocol !== "https:") throw new Error();
      } catch {
        return { error: `${label} URL must be a valid HTTPS URL.` };
      }
    }
  }
  for (const [label, value] of [["ResNexus", input.resnexusBookingUrl], ["Dockwa", input.dockwaUrl]] as const) {
    if (value && !value.includes("PLACEHOLDER")) {
      try {
        if (new URL(value).protocol !== "https:") throw new Error();
      } catch {
        return { error: `${label} booking URL must be a valid HTTPS URL.` };
      }
    }
  }
  if (input.googleMapsUrl && !input.googleMapsUrl.includes("PLACEHOLDER")) {
    try {
      if (new URL(input.googleMapsUrl).protocol !== "https:") throw new Error();
    } catch {
      return { error: "Google Maps URL must be a valid HTTPS URL." };
    }
  }
  await db.setSiteSettings(input);
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/stay");
  revalidatePath("/marina");
  redirect("/admin/settings?saved=1");
}

export async function saveContentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const current = await db.getSiteSettings();
  const input = {
    businessName: current?.businessName ?? "Exuma Yacht Club & Marina",
    contactEmail: current?.contactEmail ?? "",
    addressStreet: current?.addressStreet ?? "",
    addressLocality: current?.addressLocality ?? "",
    addressCountry: current?.addressCountry ?? "",
    addressPoBox: current?.addressPoBox ?? "",
    marinaPhone: current?.marinaPhone ?? "",
    restaurantPhone: current?.restaurantPhone ?? "",
    whatsappLabel: current?.whatsappLabel ?? "",
    vhfChannel: current?.vhfChannel ?? "",
    googleMapsUrl: current?.googleMapsUrl ?? "",
    socialFacebook: current?.socialFacebook ?? "",
    socialInstagram: current?.socialInstagram ?? "",
    inquiryNotificationEmail: current?.inquiryNotificationEmail ?? "",
    orderNotificationEmail: current?.orderNotificationEmail ?? "",
    resnexusBookingUrl: current?.resnexusBookingUrl ?? "",
    dockwaUrl: current?.dockwaUrl ?? "",
    whatsappNumber: current?.whatsappNumber ?? "",
    seoTitle: current?.seoTitle ?? "Exuma Yacht Club & Marina",
    seoDescription: current?.seoDescription ?? "A boutique marina, hotel, restaurant and gift shop in George Town, Great Exuma.",
    homeHeroTitle: String(formData.get("homeHeroTitle") ?? "").trim().slice(0, 160),
    homeHeroLede: String(formData.get("homeHeroLede") ?? "").trim().slice(0, 320),
    orderStatusEmailTemplates: current?.orderStatusEmailTemplates ?? {},
  };
  if (!input.homeHeroTitle || !input.homeHeroLede) return { error: "Homepage heading and description are required." };
  await db.setSiteSettings(input);
  revalidatePath("/");
  redirect("/admin/content?saved=1");
}
