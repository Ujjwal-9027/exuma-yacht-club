import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { AdminShell } from "@/components/admin-shell";
import { formatMoney } from "@/lib/format";
import { deleteProductAction } from "@/app/admin/actions";
import { DeleteProductButton } from "./delete-product-button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Products",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; error?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const rows = await db.listProducts(query || undefined);

  return (
    <AdminShell title="Products">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <form
          className="flex min-w-[min(100%,26rem)] flex-1 gap-2"
          role="search"
        >
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <input
            id="product-search"
            name="q"
            defaultValue={query}
            placeholder="Search name, price, slug, or SKU"
            className="field"
          />
          <button
            type="submit"
            className="border border-navy-900 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-900 hover:bg-navy-900 hover:text-ivory-50"
          >
            Search
          </button>
        </form>
        <Link
          href="/admin/products/new"
          className="border border-navy-900 bg-navy-900 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory-50 hover:bg-transparent hover:text-navy-900"
        >
          Add product
        </Link>
      </div>
      {params.error === "ordered" && (
        <p
          role="alert"
          className="mb-5 border border-[#e3c2bb] bg-[#fbf1ef] p-4 text-sm text-[#8f3526]"
        >
          This product is preserved because it is referenced by an existing
          order. Unpublish it instead.
        </p>
      )}
      {params.deleted === "1" && (
        <p
          role="status"
          className="mb-5 border border-green-700/30 bg-green-50 p-4 text-sm text-green-900"
        >
          Product deleted.
        </p>
      )}
      <div className="overflow-x-auto border border-sand-300 bg-white">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-sand-200 bg-ivory-100">
              {[
                "Name",
                "Slug / SKU",
                "Price",
                "Variants",
                "Stock",
                "Status / actions",
              ].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-900"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3.5 font-medium text-navy-900">
                  {row.name}
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-ink-500">
                  {row.slug}
                  <span className="block text-[10px] text-ink-400">
                    {row.sku || "No SKU"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-ink-700">
                  {formatMoney(row.priceCents, row.currency)}
                </td>
                <td className="px-4 py-3.5 text-xs text-ink-500">
                  {row.sizes.length > 0 && (
                    <span>Sizes: {row.sizes.join(", ")} </span>
                  )}
                  {row.colors.length > 0 && (
                    <span>Colours: {row.colors.join(", ")}</span>
                  )}
                  {row.sizes.length === 0 && row.colors.length === 0 && "—"}
                </td>
                <td className="px-4 py-3.5 text-xs text-ink-500">
                  {row.trackInventory
                    ? `${row.stockQty ?? 0} units`
                    : "Not tracked"}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      row.active
                        ? "border-navy-900 bg-navy-900 text-ivory-50"
                        : "border-sand-300 bg-white text-ink-400"
                    }`}
                  >
                    {row.active ? "Active" : "Hidden"}
                  </span>
                  <div className="mt-2 flex gap-3 text-[10px] font-semibold uppercase tracking-[0.1em]">
                    <Link
                      href={`/admin/products/${row.id}`}
                      className="text-navy-800 underline decoration-gold-500 underline-offset-2"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton
                      action={deleteProductAction.bind(null, row.id)}
                      productName={row.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
