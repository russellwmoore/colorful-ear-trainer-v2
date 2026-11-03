import { create } from "zustand";

/**
 * High-frequency timer values, written every animation frame.
 * Kept in a plain store, separate from useEartrainerStore,
 * so ticks skip its devtools and persist middleware.
 * Game logic and flags stay in the main store, this store only
 * holds time values. Only the timer instances write here, through
 * their callbacks, so it always mirrors them.
 */

type TimerState = {
  countdownRemainingMs: number;
  countUpElapsedMs: number;
};

export const useTimerStore = create<TimerState>()(() => ({
  countdownRemainingMs: 0,
  countUpElapsedMs: 0,
}));
