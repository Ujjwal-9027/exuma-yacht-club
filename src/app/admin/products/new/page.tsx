import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "../product-form";

export const metadata: Metadata = {
  title: "Admin — New product",
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <AdminShell title="Add product">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="max-w-xl text-sm leading-relaxed text-ink-500">
          Create a catalogue item for the public gift shop. Publish it only when
          its copy, image, price, and availability are ready.
        </p>
        <Link
          href="/admin/products"
          className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-navy-800 underline decoration-gold-500 underline-offset-4"
        >
          Back to products
        </Link>
      </div>
      <ProductForm />
    </AdminShell>
  );
}
