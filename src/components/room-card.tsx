import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Room } from "@/data/rooms";
import { ConfiguredBookingLink } from "@/components/configured-link";
import { config } from "@/config/site";

export function RoomCard({ room }: { room: Room }) {
  return (
    <article className="flex h-full flex-col border border-sand-300 bg-white transition-colors hover:border-gold-500">
      <div className="img-zoom relative aspect-[3/2] border-b border-sand-200 bg-ivory-100">
        <Image
          src={room.images[0]?.src ?? "/images/stay-room.jpg"}
          alt={room.images[0]?.alt ?? room.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mt-2 font-display text-xl text-navy-900">{room.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">
          {room.shortDescription}
        </p>
        <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center">
          <Link
            href={`/stay/${room.slug}`}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900 transition-colors hover:text-gold-600"
          >
            View Room
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <ConfiguredBookingLink
            url={config.resnexusBookingUrl}
            label="Book Now"
            className="sm:ml-auto"
          />
        </div>
      </div>
    </article>
  );
}
