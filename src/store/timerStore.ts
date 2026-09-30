import { create } from "zustand";

/**
 * High-frequency timer values, written every animation frame.
 * Kept in a plain store, separate from useEartrainerStore,
 * so ticks skip its devtools and persist middleware.
 * Game logic and flags stay in the main store, this store only
 * holds the amount of time remaining in ms.
 */

type TimerState = {
  // ms
  countdownRemaining: number;
};
// TODO: Add game play stopwatch timer.
export const useTimerStore = create<TimerState>()(() => ({
  countdownRemaining: 0,
}));
