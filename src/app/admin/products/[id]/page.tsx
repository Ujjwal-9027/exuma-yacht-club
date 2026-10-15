import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "../product-form";
import { db } from "@/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Edit product",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.getProductById(Number(id));
  if (!product) notFound();
  return (
    <AdminShell title="Edit product">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-500">
          Update catalogue details for{" "}
          <span className="font-semibold text-navy-900">{product.name}</span>.
        </p>
        <Link
          href="/admin/products"
          className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-navy-800 underline decoration-gold-500 underline-offset-4"
        >
          Back to products
        </Link>
      </div>
      <ProductForm product={product} />
    </AdminShell>
  );
}
