import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/components/cart-provider";
import { SiteChrome } from "@/components/site-chrome";
import { getPublicContactSettings } from "@/lib/managed-site";
import { getPublicAssetPath } from "@/lib/public-assets";

const socialImage = getPublicAssetPath("/images/marina-1.jpg");

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — George Town, Exuma, Bahamas`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — George Town, Exuma, Bahamas`,
    description: site.description,
    images: [
      {
        url: socialImage,
        width: 1600,
        height: 900,
        alt: "Aerial view of the marina at Exuma Yacht Club on Elizabeth Harbour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — George Town, Exuma, Bahamas`,
    description: site.description,
    images: [socialImage],
  },
};

function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Marina"],
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone.href.replace("tel:", ""),
    email: site.email.label,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: "George Town",
      addressRegion: "Exuma",
      addressCountry: "BS",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.coordinates.lat,
      longitude: site.coordinates.lng,
    },
    image: socialImage,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const contactSettings = await getPublicContactSettings();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="bg-ivory-50 text-ink-900 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <CartProvider>
          <SiteChrome contactSettings={contactSettings}>{children}</SiteChrome>
        </CartProvider>
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
