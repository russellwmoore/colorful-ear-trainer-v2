import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { SECOND_MS } from "@/utils/time";

import { Countdown } from "./countdownTimer";

function makeCountdown(initialDurationMs = 5 * SECOND_MS) {
  const onTick = vi.fn();
  const onComplete = vi.fn();
  const countdown = new Countdown({ initialDurationMs, onTick, onComplete });
  return { countdown, onTick, onComplete };
}

describe("Countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ["performance", "requestAnimationFrame", "cancelAnimationFrame"],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("starts paused with the full duration remaining", () => {
    const { countdown, onTick } = makeCountdown();
    expect(countdown.isPaused).toBe(true);
    expect(countdown.timeRemaining).toBe(5 * SECOND_MS);
    expect(onTick).not.toHaveBeenCalled();
  });

  test("ticks down while running", () => {
    const { countdown, onTick } = makeCountdown();
    countdown.start();
    expect(countdown.isPaused).toBe(false);
    expect(onTick).toHaveBeenLastCalledWith(5 * SECOND_MS);

    vi.advanceTimersByTime(2 * SECOND_MS);
    expect(countdown.timeRemaining).toBeLessThanOrEqual(3 * SECOND_MS);
    expect(countdown.timeRemaining).toBeGreaterThan(3 * SECOND_MS - 20);
    expect(onTick).toHaveBeenLastCalledWith(countdown.timeRemaining);
  });

  test("completes at zero and stops ticking", () => {
    const { countdown, onTick, onComplete } = makeCountdown();
    countdown.start();

    vi.advanceTimersByTime(6 * SECOND_MS);
    expect(countdown.timeRemaining).toBe(0);
    expect(countdown.isPaused).toBe(true);
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onTick).toHaveBeenLastCalledWith(0);

    const tickCount = onTick.mock.calls.length;
    vi.advanceTimersByTime(SECOND_MS);
    expect(onTick).toHaveBeenCalledTimes(tickCount);
  });

  test("works without an onComplete callback", () => {
    const onTick = vi.fn();
    const countdown = new Countdown({ initialDurationMs: SECOND_MS, onTick });
    countdown.start();
    expect(() => vi.advanceTimersByTime(2 * SECOND_MS)).not.toThrow();
    expect(countdown.timeRemaining).toBe(0);
  });

  test("pause freezes the remaining time", () => {
    const { countdown, onTick } = makeCountdown();
    countdown.start();
    vi.advanceTimersByTime(SECOND_MS);
    countdown.pause();

    const remaining = countdown.timeRemaining;
    const tickCount = onTick.mock.calls.length;
    vi.advanceTimersByTime(2 * SECOND_MS);
    expect(countdown.isPaused).toBe(true);
    expect(countdown.timeRemaining).toBe(remaining);
    expect(onTick).toHaveBeenCalledTimes(tickCount);
  });

  test("resumes from where it was paused", () => {
    const { countdown } = makeCountdown();
    countdown.start();
    vi.advanceTimersByTime(SECOND_MS);
    countdown.pause();
    const remaining = countdown.timeRemaining;

    vi.advanceTimersByTime(10 * SECOND_MS);
    countdown.start();
    expect(countdown.timeRemaining).toBe(remaining);

    vi.advanceTimersByTime(SECOND_MS);
    expect(countdown.timeRemaining).toBeLessThanOrEqual(remaining - SECOND_MS);
    expect(countdown.timeRemaining).toBeGreaterThan(remaining - SECOND_MS - 20);
  });

  test("stop pauses the countdown", () => {
    const { countdown } = makeCountdown();
    countdown.start();
    countdown.stop();
    expect(countdown.isPaused).toBe(true);
  });

  test("start is a no-op while already running", () => {
    const { countdown } = makeCountdown();
    countdown.start();
    const startTime = countdown.startTime;
    vi.advanceTimersByTime(SECOND_MS);
    countdown.start();
    expect(countdown.startTime).toBe(startTime);
  });

  test("start is a no-op once time has run out", () => {
    const { countdown, onTick } = makeCountdown(SECOND_MS);
    countdown.start();
    vi.advanceTimersByTime(2 * SECOND_MS);

    const tickCount = onTick.mock.calls.length;
    countdown.start();
    expect(countdown.isPaused).toBe(true);
    expect(onTick).toHaveBeenCalledTimes(tickCount);
  });

  test("reset pauses and restores the full duration", () => {
    const { countdown } = makeCountdown();
    countdown.start();
    vi.advanceTimersByTime(2 * SECOND_MS);

    expect(countdown.reset()).toBe(countdown);
    expect(countdown.isPaused).toBe(true);
    expect(countdown.timeRemaining).toBe(5 * SECOND_MS);

    vi.advanceTimersByTime(SECOND_MS);
    expect(countdown.timeRemaining).toBe(5 * SECOND_MS);
  });

  test("reset after completion allows starting again", () => {
    const { countdown, onComplete } = makeCountdown(SECOND_MS);
    countdown.start();
    vi.advanceTimersByTime(2 * SECOND_MS);
    countdown.reset().start();
    expect(countdown.isPaused).toBe(false);

    vi.advanceTimersByTime(2 * SECOND_MS);
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  test("restart runs again from the full duration", () => {
    const { countdown } = makeCountdown();
    countdown.start();
    vi.advanceTimersByTime(3 * SECOND_MS);
    countdown.restart();

    expect(countdown.isPaused).toBe(false);
    expect(countdown.timeRemaining).toBe(5 * SECOND_MS);
    vi.advanceTimersByTime(SECOND_MS);
    expect(countdown.timeRemaining).toBeLessThanOrEqual(4 * SECOND_MS);
    expect(countdown.timeRemaining).toBeGreaterThan(4 * SECOND_MS - 20);
  });

  describe("setDuration", () => {
    test("updates the duration while paused and ticks immediately", () => {
      const { countdown, onTick } = makeCountdown();
      expect(countdown.setDuration(10 * SECOND_MS)).toBe(countdown);
      expect(countdown.initialDuration).toBe(10 * SECOND_MS);
      expect(countdown.timeRemaining).toBe(10 * SECOND_MS);
      expect(onTick).toHaveBeenCalledExactlyOnceWith(10 * SECOND_MS);
    });

    test("is refused while running", () => {
      const warn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => undefined);
      const { countdown } = makeCountdown();
      countdown.start();

      expect(countdown.setDuration(10 * SECOND_MS)).toBe(false);
      expect(countdown.initialDuration).toBe(5 * SECOND_MS);
      expect(warn).toHaveBeenCalledOnce();
      warn.mockRestore();
    });

    test("the new duration is used when restarted", () => {
      const { countdown } = makeCountdown();
      countdown.start();
      vi.advanceTimersByTime(SECOND_MS);
      countdown.pause();
      countdown.setDuration(2 * SECOND_MS);
      countdown.start();

      vi.advanceTimersByTime(SECOND_MS);
      expect(countdown.timeRemaining).toBeLessThanOrEqual(SECOND_MS);
      expect(countdown.timeRemaining).toBeGreaterThan(0);
    });
  });
});
