"use client";

import { useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Star, Trash2, Upload, X } from "lucide-react";
import type { ProductImage } from "@/db/schema";

type GalleryItem = ProductImage & {
  name: string;
  preview: string;
  file?: File;
  status?: "ready" | "uploading" | "uploaded" | "error";
  progress?: number;
  error?: string;
};

const ACCEPTED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 5 * 1024 * 1024;

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ImageGalleryEditor({
  initialImages = [],
}: {
  initialImages?: ProductImage[];
}) {
  const [items, setItems] = useState<GalleryItem[]>(() =>
    initialImages.map((image) => ({
      ...image,
      name: image.url.split("/").pop() ?? image.id,
      preview: image.url,
      status: "uploaded",
    })),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const serialized = useMemo(
    () =>
      JSON.stringify(
        items
          .filter((item) => item.url)
          .map(({ id, url, alt, order, isMain }) => ({
            id,
            url,
            alt,
            order,
            isMain,
          })),
      ),
    [items],
  );

  function addFiles(fileList: FileList | File[]) {
    const existing = new Set(
      items.map((item) => `${item.name}:${item.file?.size ?? item.url}`),
    );
    const additions: GalleryItem[] = [];
    for (const file of Array.from(fileList)) {
      const key = `${file.name}:${file.size}`;
      if (
        existing.has(key) ||
        !ACCEPTED.has(file.type) ||
        file.size > MAX_BYTES
      )
        continue;
      existing.add(key);
      additions.push({
        id: makeId(),
        url: "",
        alt: "",
        order: items.length + additions.length,
        isMain: items.length === 0 && additions.length === 0,
        name: file.name,
        preview: URL.createObjectURL(file),
        file,
        status: "ready",
        progress: 0,
      });
    }
    if (additions.length > 0) setItems((current) => [...current, ...additions]);
    if (fileList.length !== additions.length)
      setMessage(
        "Some files were skipped. Use JPEG, PNG, WebP, or GIF images up to 5 MB each.",
      );
  }

  function uploadItem(item: GalleryItem) {
    if (!item.file || item.status === "uploading" || item.status === "uploaded")
      return;
    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? { ...entry, status: "uploading", progress: 0, error: undefined }
          : entry,
      ),
    );
    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/products/images");
    request.upload.onprogress = (event) => {
      if (event.lengthComputable)
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  progress: Math.round((event.loaded / event.total) * 100),
                }
              : entry,
          ),
        );
    };
    request.onload = () => {
      try {
        const result = JSON.parse(request.responseText) as {
          results?: Array<{ ok: boolean; url?: string; error?: string }>;
        };
        const uploaded = result.results?.[0];
        if (!uploaded?.ok || !uploaded.url)
          throw new Error(uploaded?.error ?? "Upload failed.");
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  url: uploaded.url!,
                  preview: uploaded.url!,
                  status: "uploaded",
                  progress: 100,
                }
              : entry,
          ),
        );
      } catch (error) {
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed.",
                }
              : entry,
          ),
        );
      }
    };
    request.onerror = () =>
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, status: "error", error: "Upload failed. Try again." }
            : entry,
        ),
      );
    const data = new FormData();
    data.append("files", item.file);
    request.send(data);
  }

  function uploadReady() {
    setMessage(null);
    items
      .filter((item) => item.status === "ready" || item.status === "error")
      .forEach(uploadItem);
  }

  function removeItem(item: GalleryItem) {
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    if (item.url.startsWith("/uploads/products/")) {
      void fetch("/api/admin/products/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: item.url }),
      });
    }
  }

  function moveItem(from: number, to: number) {
    if (from === to) return;
    setItems((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next.map((item, index) => ({ ...item, order: index }));
    });
  }

  return (
    <div className="sm:col-span-2">
      <input type="hidden" name="imageGallery" value={serialized} readOnly />
      <div
        className="border border-dashed border-sand-400 bg-ivory-50 p-5 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
      >
        <ImagePlus
          className="mx-auto h-7 w-7 text-gold-600"
          aria-hidden="true"
        />
        <p className="mt-2 text-sm text-ink-700">
          Drop product images here or choose files
        </p>
        <p className="mt-1 text-xs text-ink-400">
          Multiple JPEG, PNG, WebP, or GIF files, 5 MB maximum each.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 inline-flex items-center gap-2 border border-navy-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-900 hover:bg-navy-900 hover:text-ivory-50"
        >
          <Upload className="h-4 w-4" aria-hidden="true" /> Choose images
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 border border-sand-200 bg-white p-4 text-sm text-ink-400">
          No product images uploaded yet.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedIndex !== null) moveItem(draggedIndex, index);
                setDraggedIndex(null);
              }}
              className="border border-sand-300 bg-white p-3"
            >
              <div className="relative aspect-square overflow-hidden bg-ivory-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.preview}
                  alt={item.alt || item.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeItem(item)}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center bg-white/90 text-[#8f3526] shadow-sm hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
                {item.isMain && (
                  <span className="absolute bottom-2 left-2 bg-navy-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ivory-50">
                    Main image
                  </span>
                )}
              </div>
              {item.status === "uploading" && (
                <div className="mt-2">
                  <div className="h-1 bg-sand-200">
                    <div
                      className="h-1 bg-gold-500"
                      style={{ width: `${item.progress ?? 0}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-400">
                    Uploading {item.progress ?? 0}%
                  </p>
                </div>
              )}
              {item.status === "error" && (
                <p role="alert" className="mt-2 text-xs text-[#8f3526]">
                  {item.error}
                </p>
              )}
              {item.status === "uploaded" && (
                <p className="mt-2 text-xs text-green-700">
                  Uploaded successfully.
                </p>
              )}
              <label className="mt-3 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                Alt text
                <input
                  value={item.alt}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, alt: event.target.value }
                          : entry,
                      ),
                    )
                  }
                  maxLength={200}
                  className="field mt-1"
                  placeholder={item.name}
                />
              </label>
              <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setItems((current) =>
                      current.map((entry) => ({
                        ...entry,
                        isMain: entry.id === item.id,
                      })),
                    )
                  }
                  className={`inline-flex items-center gap-1 ${item.isMain ? "font-semibold text-gold-700" : "text-ink-500 hover:text-navy-900"}`}
                >
                  <Star
                    className="h-3.5 w-3.5"
                    fill={item.isMain ? "currentColor" : "none"}
                  />{" "}
                  {item.isMain ? "Main image" : "Make main"}
                </button>
                {item.status === "ready" || item.status === "error" ? (
                  <button
                    type="button"
                    onClick={() => uploadItem(item)}
                    className="inline-flex items-center gap-1 text-navy-900 underline underline-offset-2"
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload
                  </button>
                ) : item.status === "uploading" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gold-600" />
                ) : (
                  <Trash2
                    className="h-3.5 w-3.5 text-ink-300"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {items.some(
        (item) => item.status === "ready" || item.status === "error",
      ) && (
        <button
          type="button"
          onClick={uploadReady}
          className="mt-4 border border-navy-900 bg-navy-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory-50 hover:bg-transparent hover:text-navy-900"
        >
          Upload selected images
        </button>
      )}
      {message && (
        <p role="status" className="mt-3 text-xs text-[#8f3526]">
          {message}
        </p>
      )}
    </div>
  );
}
