import { create } from "zustand";

/**
 * High-frequency timer values, written every animation frame.
 * Kept in a plain store, separate from useEartrainerStore,
 * so ticks skip its devtools and persist middleware.
 * Game logic and flags stay in the main store, this store only
 * holds the amount of time remaining in ms, plus the flag the
 * count-up stopwatch sets once it passes its limit.
 */

type TimerState = {
  countdownRemainingMs: number;
  countUpElapsedMs: number;
  // Set once per question by the stopwatch's onComplete, cleared on reset
  isCountUpExpired: boolean;
};
// TODO: Add game play stopwatch timer.
export const useTimerStore = create<TimerState>()(() => ({
  countdownRemainingMs: 0,
  countUpElapsedMs: 0,
  isCountUpExpired: false,
}));
