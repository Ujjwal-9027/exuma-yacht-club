import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { getRoom, rooms } from "@/data/rooms";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { ConfiguredBookingLink } from "@/components/configured-link";
import { getManagedSiteSettings } from "@/lib/managed-site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return { title: "Room not found" };
  return {
    title: room.name,
    description: room.shortDescription,
    alternates: { canonical: `/stay/${room.slug}` },
    openGraph: {
      title: `${room.name} · Exuma Yacht Club`,
      description: room.shortDescription,
      images: [room.images[0]?.src ?? "/images/stay-room.jpg"],
    },
  };
}

export default async function RoomPage({ params }: Props) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();

  const settings = await getManagedSiteSettings();
  const bookingUrl = settings.resnexusBookingUrl;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Stay", item: "/stay" },
      { "@type": "ListItem", position: 2, name: room.name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="py-10 lg:py-16">
        <Container>
          <Reveal>
            <Link
              href="/stay"
              className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-500 transition-colors hover:text-navy-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All Rooms
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="img-zoom relative aspect-[3/2] border border-sand-300 bg-ivory-100">
                <Image
                  src={room.images[0]?.src ?? "/images/stay-room.jpg"}
                  alt={room.images[0]?.alt ?? room.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {room.images.length > 1 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {room.images.slice(1).map((img) => (
                    <div
                      key={img.src}
                      className="img-zoom relative aspect-[4/3] border border-sand-300 bg-ivory-100"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 1024px) 16vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Reveal>

            <div>
              <Reveal>
                <p className="overline-label">Accommodation</p>
                <h1 className="mt-3 font-display text-3xl leading-[1.1] font-medium text-navy-900 sm:text-4xl lg:text-[2.75rem]">
                  {room.name}
                </h1>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-400">
                  Availability and rates through ResNexus
                </p>
              </Reveal>

              <Reveal delay={80}>
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-700">
                  {room.longDescription}
                </p>
              </Reveal>

              {room.amenities.length > 0 && (
                <Reveal delay={140} className="mt-8">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                    Amenities
                  </h2>
                  <ul className="mt-4 grid max-w-lg gap-2.5 sm:grid-cols-2">
                    {room.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-2.5 text-sm text-ink-700"
                      >
                        <Check
                          className="h-4 w-4 shrink-0 text-gold-600"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              <Reveal
                delay={200}
                className="mt-10 flex flex-col gap-4 border-t border-sand-200 pt-8"
              >
                <ConfiguredBookingLink
                  url={bookingUrl}
                  label="Book Now"
                  fallbackHref="/stay#stay-inquiry"
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
