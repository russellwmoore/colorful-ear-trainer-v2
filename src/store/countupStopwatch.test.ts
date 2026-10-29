import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { SECOND_MS } from "@/utils/time";

import { Countup } from "./countupStopwatch";

function makeCountup(expirationMs = 5 * SECOND_MS) {
  const onTick = vi.fn();
  const onComplete = vi.fn();
  const onReset = vi.fn();
  const getExpirationMs = vi.fn(() => expirationMs);
  const countup = new Countup({
    getExpirationMs,
    onTick,
    onComplete,
    onReset,
  });
  return { countup, onTick, onComplete, onReset, getExpirationMs };
}

describe("Countup", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ["performance", "requestAnimationFrame", "cancelAnimationFrame"],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("starts paused with nothing elapsed", () => {
    const { countup, onTick } = makeCountup();
    expect(countup.isPaused).toBe(true);
    expect(countup.elapsedTime).toBe(0);
    expect(onTick).not.toHaveBeenCalled();
  });

  test("ticks up while running", () => {
    const { countup, onTick } = makeCountup();
    countup.start();
    expect(countup.isPaused).toBe(false);
    expect(onTick).toHaveBeenLastCalledWith(0);

    vi.advanceTimersByTime(2 * SECOND_MS);
    const lastTick = onTick.mock.lastCall![0] as number;
    expect(lastTick).toBeGreaterThanOrEqual(2 * SECOND_MS - 20);
    expect(lastTick).toBeLessThanOrEqual(2 * SECOND_MS);
  });

  test("does not complete before the expiration time", () => {
    const { countup, onComplete } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(4 * SECOND_MS);
    expect(onComplete).not.toHaveBeenCalled();
  });

  test("completes once past the expiration time", () => {
    const { countup, onComplete } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(5 * SECOND_MS + 50);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  test("keeps ticking after expiration without completing again", () => {
    const { countup, onTick, onComplete } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(10 * SECOND_MS);

    expect(countup.isPaused).toBe(false);
    expect(onComplete).toHaveBeenCalledOnce();
    const lastTick = onTick.mock.lastCall![0] as number;
    expect(lastTick).toBeGreaterThanOrEqual(10 * SECOND_MS - 20);
  });

  test("does not complete again after pausing and resuming past expiration", () => {
    const { countup, onComplete } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(6 * SECOND_MS);
    countup.pause();
    countup.start();
    vi.advanceTimersByTime(SECOND_MS);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  test("completes again after a reset", () => {
    const { countup, onComplete } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(6 * SECOND_MS);
    countup.reset();
    countup.start();
    vi.advanceTimersByTime(4 * SECOND_MS);
    expect(onComplete).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(2 * SECOND_MS);
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  test("pause freezes the elapsed time and stops ticking", () => {
    const { countup, onTick } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(SECOND_MS);
    countup.pause();

    expect(countup.isPaused).toBe(true);
    expect(countup.elapsedTime).toBe(SECOND_MS);

    const tickCount = onTick.mock.calls.length;
    vi.advanceTimersByTime(2 * SECOND_MS);
    expect(onTick).toHaveBeenCalledTimes(tickCount);
    expect(countup.elapsedTime).toBe(SECOND_MS);
  });

  test("pause is a no-op while already paused", () => {
    const { countup } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(SECOND_MS);
    countup.pause();
    vi.advanceTimersByTime(SECOND_MS);
    countup.pause();
    expect(countup.elapsedTime).toBe(SECOND_MS);
  });

  test("resumes from where it was paused", () => {
    const { countup, onTick } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(SECOND_MS);
    countup.pause();

    vi.advanceTimersByTime(10 * SECOND_MS);
    countup.start();
    expect(onTick).toHaveBeenLastCalledWith(SECOND_MS);

    vi.advanceTimersByTime(SECOND_MS);
    const lastTick = onTick.mock.lastCall![0] as number;
    expect(lastTick).toBeGreaterThanOrEqual(2 * SECOND_MS - 20);
    expect(lastTick).toBeLessThanOrEqual(2 * SECOND_MS);
  });

  test("time spent paused does not count toward expiration", () => {
    const { countup, onComplete } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(3 * SECOND_MS);
    countup.pause();
    vi.advanceTimersByTime(10 * SECOND_MS);
    countup.start();
    vi.advanceTimersByTime(SECOND_MS);
    expect(onComplete).not.toHaveBeenCalled();
  });

  test("start is a no-op while already running", () => {
    const { countup } = makeCountup();
    countup.start();
    const startTime = countup.startTime;
    vi.advanceTimersByTime(SECOND_MS);
    countup.start();
    expect(countup.startTime).toBe(startTime);
  });

  test("reset pauses and clears the elapsed time", () => {
    const { countup, onTick } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(2 * SECOND_MS);
    countup.reset();

    expect(countup.isPaused).toBe(true);
    expect(countup.elapsedTime).toBe(0);

    const tickCount = onTick.mock.calls.length;
    vi.advanceTimersByTime(SECOND_MS);
    expect(onTick).toHaveBeenCalledTimes(tickCount);
  });

  test("reset calls onReset", () => {
    const { countup, onReset } = makeCountup();
    countup.start();
    countup.reset();
    expect(onReset).toHaveBeenCalledOnce();
  });

  test("works without an onReset callback", () => {
    const countup = new Countup({
      getExpirationMs: () => SECOND_MS,
      onTick: vi.fn(),
      onComplete: vi.fn(),
    });
    expect(() => countup.reset()).not.toThrow();
  });

  test("uses the current expiration limit, not the one at construction", () => {
    const { countup, onComplete, getExpirationMs } = makeCountup();
    getExpirationMs.mockReturnValue(10 * SECOND_MS);
    countup.start();
    vi.advanceTimersByTime(6 * SECOND_MS);
    expect(onComplete).not.toHaveBeenCalled();

    getExpirationMs.mockReturnValue(SECOND_MS);
    vi.advanceTimersByTime(20);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  test("starting after reset counts from zero", () => {
    const { countup, onTick } = makeCountup();
    countup.start();
    vi.advanceTimersByTime(2 * SECOND_MS);
    countup.pause();
    countup.reset();

    countup.start();
    expect(onTick).toHaveBeenLastCalledWith(0);
  });
});
