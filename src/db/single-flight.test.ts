import { describe, expect, it, vi } from "vitest";
import { getOrCreatePromise } from "@/db/single-flight";

describe("database initialization single-flight", () => {
  it("shares one concurrent initialization promise", async () => {
    const cache: { promise?: Promise<string> } = {};
    let resolve!: (value: string) => void;
    const initialize = vi.fn(
      () => new Promise<string>((done) => { resolve = done; }),
    );
    const read = () => cache.promise;
    const write = (promise: Promise<string> | undefined) => { cache.promise = promise; };

    const first = getOrCreatePromise(read, write, initialize);
    const second = getOrCreatePromise(read, write, initialize);
    expect(first).toBe(second);
    expect(initialize).toHaveBeenCalledTimes(1);

    resolve("connected");
    await expect(Promise.all([first, second])).resolves.toEqual([
      "connected",
      "connected",
    ]);
  });

  it("clears a rejected initialization so a later request can retry", async () => {
    const cache: { promise?: Promise<number> } = {};
    let attempts = 0;
    const initialize = vi.fn(async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("temporary connection failure");
      return 1;
    });
    const read = () => cache.promise;
    const write = (promise: Promise<number> | undefined) => { cache.promise = promise; };

    await expect(getOrCreatePromise(read, write, initialize)).rejects.toThrow(
      "temporary connection failure",
    );
    await expect(getOrCreatePromise(read, write, initialize)).resolves.toBe(1);
    expect(initialize).toHaveBeenCalledTimes(2);
  });
});