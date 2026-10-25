import { afterEach, describe, expect, test, vi } from "vitest";

import { getRandomNumberFromRange } from "./getRandomNumberFromRange";

describe("getRandomNumberFromRange", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns min when Math.random returns 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getRandomNumberFromRange([3, 7])).toBe(3);
  });

  test("returns max when Math.random approaches 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9999999);
    expect(getRandomNumberFromRange([3, 7])).toBe(7);
  });

  test("maps evenly spaced random values to each integer in the range", () => {
    // [3, 7] has 5 buckets; these values land in the middle of each one
    const results = [0.1, 0.3, 0.5, 0.7, 0.9].map((r) => {
      vi.spyOn(Math, "random").mockReturnValue(r);
      return getRandomNumberFromRange([3, 7]);
    });
    expect(results).toStrictEqual([3, 4, 5, 6, 7]);
  });

  test("returns the single value when min equals max", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    expect(getRandomNumberFromRange([4, 4])).toBe(4);
  });

  test("always returns an integer within [min, max] and hits both ends", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      const n = getRandomNumberFromRange([0, 3]);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(3);
      seen.add(n);
    }
    expect(seen).toStrictEqual(new Set([0, 1, 2, 3]));
  });
});
