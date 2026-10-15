import { config, isPlaceholder } from "@/config/site";
import { db } from "@/db";

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
};

export async function getManagedSiteSettings() {
  if (!process.env.MONGODB_URI) return defaults;
  const stored = await db.getSiteSettings();
  if (!stored) return defaults;
  return {
    ...defaults,
    ...stored,
    dockwaUrl: isPlaceholder(stored.dockwaUrl) ? config.dockwaUrl : stored.dockwaUrl,
  };
}
