import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { gameLevels } from "@/components/levels/LevelsMetaData";
import { secondsToMs } from "@/utils/time";
import { notesAsNumber } from "@/utils/transpose";

import {
  countup,
  selectCountUpLimitMs,
  selectScoreKey,
  useEartrainerStore,
} from "./store";
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
    expect(useEartrainerStore.getState().isCountUpExpired).toBe(false);

    vi.advanceTimersByTime(200);
    expect(useEartrainerStore.getState().isCountUpExpired).toBe(true);

    countup.reset();
    expect(useEartrainerStore.getState().isCountUpExpired).toBe(false);
  });

  test("uses settings changed after the stopwatch was created", () => {
    useEartrainerStore.setState({
      amountOfNotesToGuess: 2,
      timePerNoteMs: secondsToMs(5),
    });
    countup.start();

    vi.advanceTimersByTime(9000);
    expect(useEartrainerStore.getState().isCountUpExpired).toBe(false);

    vi.advanceTimersByTime(1100);
    expect(useEartrainerStore.getState().isCountUpExpired).toBe(true);
  });

  test("reset clears the displayed elapsed time", () => {
    countup.start();
    vi.advanceTimersByTime(1500);
    expect(useTimerStore.getState().countUpElapsedMs).toBeGreaterThan(0);

    countup.reset();
    expect(useTimerStore.getState().countUpElapsedMs).toBe(0);
  });
});

describe("countdown display", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("floors the remaining time to tents of a second", () => {
    useEartrainerStore.getState().setTotalInitialGameTimeMs(90_590);
    expect(useTimerStore.getState().countdownRemainingMs).toBe(90_500);
  });
});

describe("game mode and play level", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  const guessFirstNoteCorrectly = () => {
    // Two notes, so the question isn't complete and no next question starts
    useEartrainerStore.setState({ keyCenter: "C", notesToGuess: ["C4", "E4"] });
    return useEartrainerStore.getState().submitGuess(notesAsNumber("C", "C"));
  };

  test("practice guesses score in the practice bucket only", () => {
    useEartrainerStore.setState({
      gameMode: "practice",
      playLevel: "beginner2",
    });
    expect(guessFirstNoteCorrectly()).toBe(true);

    const { bests } = useEartrainerStore.getState();
    expect(bests.practice.bestScore).toBe(1);
    expect(bests.beginner1.bestScore).toBe(0);
    expect(bests.beginner2.bestScore).toBe(0);
  });

  test("play guesses score in the selected level's bucket", () => {
    useEartrainerStore.getState().setGameMode("play");
    useEartrainerStore.getState().setPlayLevel("beginner3");
    guessFirstNoteCorrectly();

    const state = useEartrainerStore.getState();
    expect(selectScoreKey(state)).toBe("beginner3");
    expect(state.bests.beginner3.bestScore).toBe(1);
    expect(state.bests.practice.bestScore).toBe(0);
  });

  test("the selected level sticks across a trip through practice mode", () => {
    const { setGameMode, setPlayLevel } = useEartrainerStore.getState();
    setGameMode("play");
    setPlayLevel("intermediate2");
    setGameMode("practice");
    expect(selectScoreKey(useEartrainerStore.getState())).toBe("practice");

    setGameMode("play");
    expect(useEartrainerStore.getState().playLevel).toBe("intermediate2");
  });

  test("switching to play applies the level's settings", () => {
    useEartrainerStore.setState({
      gameMode: "practice",
      playLevel: "beginner1",
      amountOfNotesToGuess: 5,
      timePerNoteMs: secondsToMs(1),
    });
    useEartrainerStore.getState().setGameMode("play");

    const beginner1 = gameLevels.find((l) => l.id === "beginner1")!;
    expect(useEartrainerStore.getState()).toMatchObject({
      amountOfNotesToGuess: beginner1.amountOfNotesToGuess,
      timePerNoteMs: beginner1.timePerNoteMs,
    });
  });

  test("switching mode stops the run and clears its counters", () => {
    useEartrainerStore.setState({
      gameMode: "play",
      gameStatus: "playing",
      correctStreak: 4,
      correctAttempts: 6,
    });
    useEartrainerStore.getState().setGameMode("practice");

    expect(useEartrainerStore.getState()).toMatchObject({
      gameStatus: "idle",
      correctStreak: 0,
      correctAttempts: 0,
    });
  });
});
