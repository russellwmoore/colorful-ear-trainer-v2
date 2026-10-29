import { describe, expect, test } from "vitest";

import {
  MINUTE_MS,
  minutesToMs,
  msToSeconds,
  SECOND_MS,
  secondsToMs,
} from "./time";

describe("Constants", () => {
  test("SECOND_MS is 1000", () => {
    expect(SECOND_MS).toBe(1000);
  });

  test("MINUTE_MS is 60 seconds", () => {
    // the _ can act as a separator here so these numbers are easier to read
    expect(MINUTE_MS).toBe(60_000);
  });
});

describe("secondsToMs", () => {
  test("Whole seconds", () => {
    expect(secondsToMs(0)).toBe(0);
    expect(secondsToMs(1)).toBe(1_000);
    expect(secondsToMs(5)).toBe(5_000);
  });

  test("Fractional seconds", () => {
    expect(secondsToMs(0.5)).toBe(500);
    expect(secondsToMs(1.25)).toBe(1_250);
  });
});

describe("minutesToMs", () => {
  test("Whole minutes", () => {
    expect(minutesToMs(0)).toBe(0);
    expect(minutesToMs(1)).toBe(60_000);
    expect(minutesToMs(5)).toBe(300_000);
  });

  test("Fractional minutes", () => {
    expect(minutesToMs(0.5)).toBe(30_000);
  });
});

describe("msToSeconds", () => {
  test("Whole seconds", () => {
    expect(msToSeconds(0)).toBe(0);
    expect(msToSeconds(1000)).toBe(1);
    expect(msToSeconds(60_000)).toBe(60);
  });

  test("Does not round partial seconds", () => {
    expect(msToSeconds(500)).toBe(0.5);
    expect(msToSeconds(1)).toBe(0.001);
    expect(msToSeconds(1999)).toBe(1.999);
  });
});

describe("Round trips", () => {
  test("msToSeconds undoes secondsToMs", () => {
    for (const s of [0, 1, 0.5, 2.75, 90]) {
      expect(msToSeconds(secondsToMs(s))).toBe(s);
    }
  });

  test("minutesToMs agrees with secondsToMs", () => {
    expect(minutesToMs(2)).toBe(secondsToMs(120));
  });
});

describe("Adding or subtracting", () => {
  test("can add", () => {
    expect(secondsToMs(1) + minutesToMs(1)).toBe(61_000);
  });

  test("can subtract", () => {
    expect(minutesToMs(1) - secondsToMs(1)).toBe(59_000);
    expect(minutesToMs(5) - minutesToMs(2)).toBe(minutesToMs(3));
  });

  test("subtracting a larger duration goes negative", () => {
    expect(secondsToMs(1) - secondsToMs(3)).toBe(-2_000);
  });

  test("adding then subtracting the same duration is a no-op", () => {
    const start = minutesToMs(2);
    expect(start + secondsToMs(15) - secondsToMs(15)).toBe(start);
  });

  test("converting a sum equals summing the conversions", () => {
    expect(secondsToMs(2 + 3)).toBe(secondsToMs(2) + secondsToMs(3));
    expect(msToSeconds(1_500 + 2_500)).toBe(
      msToSeconds(1_500) + msToSeconds(2_500),
    );
  });

  test("fractional seconds sum exactly in ms but not in seconds", () => {
    // 100 + 200 is exact, but 0.1 + 0.2 is not, so do math in ms
    // This test is the whole reason everything in the app is measured in ms
    expect(secondsToMs(0.1) + secondsToMs(0.2)).toBe(300);
    expect(msToSeconds(100) + msToSeconds(200)).not.toBe(0.3);
    expect(msToSeconds(100) + msToSeconds(200)).toBeCloseTo(0.3);
  });
});
