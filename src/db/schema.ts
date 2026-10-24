export type OrderItem = {
  slug: string;
  name: string;
  priceCents: number;
  qty: number;
  size?: string | null;
  color?: string | null;
  image?: string | null;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
  isMain: boolean;
};

export type ProductVariant = {
  id: string;
  size?: string | null;
  color?: string | null;
  sku?: string | null;
  priceCents?: number | null;
  stockQty?: number | null;
};

export type Product = {
  id: number;
  slug: string;
  sku?: string | null;
  name: string;
  tagline: string;
  description: string;
  category: string;
  priceCents: number;
  currency: string;
  image: string;
  imageAlt: string;
  sizes: string[];
  colors: string[];
  active: boolean;
  trackInventory?: boolean;
  stockQty?: number | null;
  sortOrder: number;
  images?: ProductImage[];
  featured?: boolean;
  newArrival?: boolean;
  newArrivalWindowDays?: number;
  limitedEdition?: boolean;
  eycExclusive?: boolean;
  giftIdea?: boolean;
  compareAtPriceCents?: number | null;
  salePriceCents?: number | null;
  saleStartsAt?: Date | null;
  saleEndsAt?: Date | null;
  lowStockThreshold?: number | null;
  outOfStockBehavior?: "hide" | "show";
  variants?: ProductVariant[];
  collections?: string[];
  status?: "draft" | "published" | "archived";
  publishedAt?: Date | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  material?: string | null;
  fit?: string | null;
  careInstructions?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  createdAt: Date;
  updatedAt?: Date;
};

export type InquiryStatus =
  | "new"
  | "read"
  | "in_progress"
  | "replied"
  | "confirmed"
  | "declined"
  | "archived";

export type InquiryNote = {
  id: string;
  text: string;
  createdAt: Date;
};

export type Inquiry = {
  id: number;
  type: string;
  fullName: string;
  email: string;
  phone: string | null;
  vesselName: string | null;
  vesselLength: string | null;
  arrivalDate: string | null;
  departureDate: string | null;
  timeOfDay: string | null;
  serviceRequirements: string | null;
  partySize: string | null;
  message: string | null;
  handled: boolean;
  status?: InquiryStatus;
  readAt?: Date | null;
  internalNotes?: InquiryNote[];
  createdAt: Date;
};

export type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string | null;
  shippingAddress?: ShippingAddress | null;
  fulfillment: string;
  deliverySpeed?: string;
  notes: string | null;
  items: OrderItem[];
  subtotalCents: number;
  shippingFeeCents?: number;
  totalCents: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  customerAccessTokenHash?: string;
  customerAccessCodeHash?: string;
  customerAccessCodeExpiresAt?: Date;
  cancellationReason?: string | null;
  fulfillmentStatus?: string;
  shippingCarrier?: string | null;
  trackingNumber?: string | null;
  createdAt: Date;
  updatedAt?: Date;
};

export type ShippingAddress = {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  region: string | null;
  postalCode: string | null;
  country: string;
};

export type OrderStatusEmailStatus =
  | "pending"
  | "processing"
  | "ready"
  | "shipped"
  | "delivered"
  | "fulfilled"
  | "cancelled";

export type OrderStatusEmailTemplate = {
  subject: string;
  body: string;
};

export type OrderStatusEmailTemplates = Partial<
  Record<OrderStatusEmailStatus, OrderStatusEmailTemplate>
>;

export type SiteSettings = {
  id: "site";
  businessName: string;
  contactEmail: string;
  resnexusBookingUrl: string;
  dockwaUrl: string;
  whatsappNumber: string;
  seoTitle: string;
  seoDescription: string;
  homeHeroTitle: string;
  homeHeroLede: string;
  addressStreet?: string;
  addressLocality?: string;
  addressCountry?: string;
  addressPoBox?: string;
  marinaPhone?: string;
  whatsappLabel?: string;
  vhfChannel?: string;
  googleMapsUrl?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  inquiryNotificationEmail?: string;
  orderNotificationEmail?: string;
  orderStatusEmailTemplates?: OrderStatusEmailTemplates;
  adminPasswordHash?: string;
  updatedAt: Date;
};
