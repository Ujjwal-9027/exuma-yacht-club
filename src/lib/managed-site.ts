import { config, isPlaceholder } from "@/config/site";
import { db } from "@/db";
import { DEFAULT_ORDER_STATUS_EMAIL_TEMPLATES } from "@/lib/order-email-templates";
import { site } from "@/lib/site";

const defaults = {
  businessName: "Exuma Yacht Club & Marina",
  contactEmail: "",
  resnexusBookingUrl: config.resnexusBookingUrl,
  dockwaUrl: config.dockwaUrl,
  whatsappNumber: config.whatsappNumber,
  seoTitle: "Exuma Yacht Club & Marina",
  seoDescription: "A boutique marina, hotel, restaurant and gift shop in George Town, Great Exuma.",
  homeHeroTitle: "Your Exuma escape starts here.",
  homeHeroLede: "Marina services, island stays, waterfront dining and essentials — all on the edge of Elizabeth Harbour.",
  addressStreet: site.address.street,
  addressLocality: site.address.locality,
  addressCountry: site.address.country,
  addressPoBox: site.address.poBox,
  marinaPhone: site.phone.label,
  restaurantPhone: site.restaurantPhone.label,
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
  restaurantPhone: string;
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
    restaurantPhone: settings.restaurantPhone,
    whatsappLabel: settings.whatsappLabel,
    whatsappNumber,
    vhfChannel: settings.vhfChannel,
    googleMapsUrl: settings.googleMapsUrl,
    socialFacebook: settings.socialFacebook,
    socialInstagram: settings.socialInstagram,
  };
}
