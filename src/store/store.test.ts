import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { secondsToMs } from "@/utils/time";

import { countup, selectCountUpLimitMs, useEartrainerStore } from "./store";
import { useTimerStore } from "./timerStore";

const initialState = useEartrainerStore.getState();

describe("cadence tempo persistence", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("starts the in-play tempo at the initial tempo with nothing persisted", () => {
    const { cadenceTempoInit, inPlayCadenceTempo } =
      useEartrainerStore.getState();
    expect(cadenceTempoInit).toBe(60);
    expect(inPlayCadenceTempo).toBe(cadenceTempoInit);
  });

  test("persists the in-play tempo as the initial tempo", () => {
    useEartrainerStore.setState({
      cadenceTempoInit: 90,
      inPlayCadenceTempo: 120,
    });

    const { state } = JSON.parse(localStorage.getItem("EarTrainerStore")!) as {
      state: Record<string, unknown>;
    };
    expect(state.cadenceTempoInit).toBe(90);
    expect(state.inPlayCadenceTempo).toBe(90);
  });

  test("resets the in-play tempo to the persisted initial tempo on rehydrate", async () => {
    useEartrainerStore.setState({ cadenceTempoInit: 55 });
    useEartrainerStore.setState({ inPlayCadenceTempo: 150 });

    await useEartrainerStore.persist.rehydrate();
    expect(useEartrainerStore.getState()).toMatchObject({
      cadenceTempoInit: 55,
      inPlayCadenceTempo: 55,
    });
  });
});

describe("count-up expiration", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ["performance", "requestAnimationFrame", "cancelAnimationFrame"],
    });
    useEartrainerStore.setState(initialState, true);
    countup.reset();
  });

  afterEach(() => {
    countup.reset();
    vi.useRealTimers();
  });

  test("the limit is notes to guess times time per note", () => {
    useEartrainerStore.setState({
      amountOfNotesToGuess: 3,
      timePerNoteMs: secondsToMs(2),
    });
    expect(selectCountUpLimitMs(useEartrainerStore.getState())).toBe(
      secondsToMs(6),
    );
  });

  test("flags expiration once past the limit and clears it on reset", () => {
    useEartrainerStore.setState({
      amountOfNotesToGuess: 1,
      timePerNoteMs: secondsToMs(1),
    });
    countup.start();

    vi.advanceTimersByTime(900);
    expect(useTimerStore.getState().isCountUpExpired).toBe(false);

    vi.advanceTimersByTime(200);
    expect(useTimerStore.getState().isCountUpExpired).toBe(true);

    countup.reset();
    expect(useTimerStore.getState().isCountUpExpired).toBe(false);
  });

  test("uses settings changed after the stopwatch was created", () => {
    useEartrainerStore.setState({
      amountOfNotesToGuess: 2,
      timePerNoteMs: secondsToMs(5),
    });
    countup.start();

    vi.advanceTimersByTime(9000);
    expect(useTimerStore.getState().isCountUpExpired).toBe(false);

    vi.advanceTimersByTime(1100);
    expect(useTimerStore.getState().isCountUpExpired).toBe(true);
  });
});
