"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/db/schema";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [selected, setSelected] = useState(images[0]);
  if (!selected) return null;
  return (
    <div>
      <div className="img-zoom relative aspect-square border border-sand-300 bg-ivory-100">
        <Image
          src={selected.url}
          alt={selected.alt || name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div
          className="mt-4 grid grid-cols-5 gap-3"
          aria-label={`${name} image gallery`}
        >
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(image)}
              aria-label={`View ${image.alt || name}`}
              aria-pressed={selected.id === image.id}
              className={`relative aspect-square overflow-hidden border ${selected.id === image.id ? "border-navy-900" : "border-sand-300"}`}
            >
              <Image
                src={image.url}
                alt={image.alt || name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
