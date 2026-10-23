import { config, isPlaceholder } from "@/config/site";
import { db } from "@/db";
import { DEFAULT_ORDER_STATUS_EMAIL_TEMPLATES } from "@/lib/order-email-templates";
import { site } from "@/lib/site";

const defaults = {
  businessName: site.name,
  contactEmail: site.email.label,
  resnexusBookingUrl: config.resnexusBookingUrl,
  dockwaUrl: config.dockwaUrl,
  whatsappNumber: config.whatsappNumber,
  seoTitle: site.name,
  seoDescription: site.description,
  homeHeroTitle: "Your Exuma escape starts here.",
  homeHeroLede: "Marina services, island stays, waterfront dining and essentials — all on the edge of Elizabeth Harbour.",
  addressStreet: site.address.street,
  addressLocality: site.address.locality,
  addressCountry: site.address.country,
  addressPoBox: site.address.poBox,
  marinaPhone: site.phone.label,
  whatsappLabel: site.whatsapp.label,
  vhfChannel: site.vhf,
  googleMapsUrl: config.googleMapsUrl,
  socialFacebook: config.social.facebook,
  socialInstagram: config.social.instagram,
  inquiryNotificationEmail: "",
  orderNotificationEmail: "",
  orderStatusEmailTemplates: DEFAULT_ORDER_STATUS_EMAIL_TEMPLATES,
};

export async function getManagedSiteSettings() {
  if (!process.env.MONGODB_URI) return defaults;
  const stored = await db.getSiteSettings();
  if (!stored) return defaults;
  const {
    _id: _ignoredMongoId,
    updatedAt: _ignoredUpdatedAt,
    ...storedValues
  } = stored as typeof stored & { _id?: unknown };
  return {
    ...defaults,
    ...storedValues,
    businessName: site.name,
    contactEmail: site.email.label,
    addressStreet: site.address.street,
    addressLocality: site.address.locality,
    addressCountry: site.address.country,
    marinaPhone: site.phone.label,
    whatsappNumber: config.whatsappNumber,
    whatsappLabel: site.whatsapp.label,
    orderStatusEmailTemplates: {
      ...DEFAULT_ORDER_STATUS_EMAIL_TEMPLATES,
      ...(stored.orderStatusEmailTemplates ?? {}),
    },
    dockwaUrl: isPlaceholder(stored.dockwaUrl) ? config.dockwaUrl : stored.dockwaUrl,
  };
}

export type PublicContactSettings = {
  addressStreet: string;
  addressLocality: string;
  addressCountry: string;
  addressPoBox: string;
  marinaPhone: string;
  businessEmail: string;
  whatsappLabel: string;
  whatsappNumber: string;
  vhfChannel: string;
  googleMapsUrl: string;
  socialFacebook: string;
  socialInstagram: string;
};

export async function getPublicContactSettings(): Promise<PublicContactSettings> {
  const settings = await getManagedSiteSettings();
  const whatsappNumber = settings.whatsappNumber;
  return {
    addressStreet: settings.addressStreet,
    addressLocality: settings.addressLocality,
    addressCountry: settings.addressCountry,
    addressPoBox: settings.addressPoBox,
    marinaPhone: settings.marinaPhone,
    businessEmail: site.email.label,
    whatsappLabel: settings.whatsappLabel,
    whatsappNumber,
    vhfChannel: settings.vhfChannel,
    googleMapsUrl: settings.googleMapsUrl,
    socialFacebook: settings.socialFacebook,
    socialInstagram: settings.socialInstagram,
  };
}
