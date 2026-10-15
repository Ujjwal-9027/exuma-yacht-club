import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function hasValidSignature(type: string, bytes: Uint8Array): boolean {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/gif") return bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
  if (type === "image/webp") return bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  return false;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length === 0) return NextResponse.json({ error: "Choose at least one image." }, { status: 400 });

  const directory = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(directory, { recursive: true });
  const results: Array<{ name: string; ok: boolean; url?: string; error?: string }> = [];

  for (const file of files) {
    const extension = EXTENSIONS[file.type];
    if (!extension) {
      results.push({ name: file.name, ok: false, error: "Use JPEG, JPG, PNG, WebP, or GIF." });
      continue;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      results.push({ name: file.name, ok: false, error: "Image must be 5 MB or smaller." });
      continue;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!hasValidSignature(file.type, bytes)) {
      results.push({ name: file.name, ok: false, error: "The file contents do not match its image type." });
      continue;
    }
    const filename = `${randomUUID()}.${extension}`;
    await writeFile(path.join(directory, filename), bytes);
    results.push({ name: file.name, ok: true, url: `/uploads/products/${filename}` });
  }
  return NextResponse.json({ results });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { url?: string };
  if (!body.url?.startsWith("/uploads/products/")) return NextResponse.json({ error: "Invalid image path." }, { status: 400 });
  const filename = path.basename(body.url);
  await unlink(path.join(process.cwd(), "public", "uploads", "products", filename)).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
