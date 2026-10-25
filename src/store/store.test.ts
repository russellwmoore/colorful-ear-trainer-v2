import { beforeEach, describe, expect, test } from "vitest";
import { useEartrainerStore } from "./store";

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
