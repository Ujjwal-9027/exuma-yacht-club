import type { Collection } from "mongodb";
import { describe, expect, it, vi } from "vitest";
import type { Product } from "@/db/schema";
import { reserveProductStock } from "@/db/inventory";

describe("reserveProductStock", () => {
  it("does not reserve aggregate stock for an unavailable configured variant", async () => {
    const updateOne = vi.fn().mockResolvedValue({ matchedCount: 0 });
    const findOne = vi.fn().mockResolvedValue({ variants: [{ size: "S", stockQty: 2 }] });
    const products = { updateOne, findOne } as unknown as Collection<Product>;

    await expect(reserveProductStock(products, "shirt", 1, "M", null)).resolves.toBe(false);
    expect(updateOne).toHaveBeenCalledTimes(2);
    expect(updateOne.mock.calls[0][0]).toMatchObject({
      variants: { $elemMatch: { size: "M", color: null, stockQty: { $gte: 1 } } },
    });
  });

  it("uses a size-only stock record for a product with a global color option", async () => {
    const updateOne = vi
      .fn()
      .mockResolvedValueOnce({ matchedCount: 0 })
      .mockResolvedValueOnce({ matchedCount: 1 });
    const findOne = vi.fn();
    const products = { updateOne, findOne } as unknown as Collection<Product>;

    await expect(
      reserveProductStock(products, "hoodie", 1, "Large", "Royal Blue"),
    ).resolves.toBe(true);

    expect(updateOne).toHaveBeenCalledTimes(2);
    expect(updateOne.mock.calls[0][0]).toMatchObject({
      variants: { $elemMatch: { size: "Large", color: "Royal Blue" } },
    });
    expect(updateOne.mock.calls[1][0]).toMatchObject({
      variants: { $elemMatch: { size: "Large", color: null } },
    });
    expect(findOne).not.toHaveBeenCalled();
  });

  it("reserves available stock against the selected variant", async () => {
    const updateOne = vi.fn().mockResolvedValue({ matchedCount: 1 });
    const findOne = vi.fn();
    const products = { updateOne, findOne } as unknown as Collection<Product>;

    await expect(reserveProductStock(products, "shirt", 2, "M", "blue")).resolves.toBe(true);
    expect(updateOne).toHaveBeenCalledTimes(1);
    expect(findOne).not.toHaveBeenCalled();
  });
});