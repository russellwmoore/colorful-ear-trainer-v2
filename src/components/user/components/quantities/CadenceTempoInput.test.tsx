import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEartrainerStore } from "@/store/store";
import { CadenceTempoInput } from "./CadenceTempoInput";

const initialState = useEartrainerStore.getState();

describe("CadenceTempoInput", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("renders the label and the in-play tempo", () => {
    useEartrainerStore.setState({
      cadenceTempoInit: 80,
      inPlayCadenceTempo: 90,
    });
    render(<CadenceTempoInput />);

    expect(screen.getByText("Cadence Tempo:")).toBeInTheDocument();
    expect(screen.getByText("beats per minute")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("90");
  });

  test("updates both tempos while the in-play tempo matches the initial tempo", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({
      cadenceTempoInit: 80,
      inPlayCadenceTempo: 80,
    });
    render(<CadenceTempoInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState()).toMatchObject({
      cadenceTempoInit: 81,
      inPlayCadenceTempo: 81,
    });
  });

  test("only updates the in-play tempo once it has drifted from the initial tempo", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({
      cadenceTempoInit: 80,
      inPlayCadenceTempo: 90,
    });
    render(<CadenceTempoInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState()).toMatchObject({
      cadenceTempoInit: 80,
      inPlayCadenceTempo: 91,
    });
  });

  test.each([
    ["Increase Quantity", 400],
    ["Decrease Quantity", 60],
  ])("%s stays within 60-400 bpm", async (name, bound) => {
    const user = userEvent.setup();
    useEartrainerStore.setState({
      cadenceTempoInit: bound,
      inPlayCadenceTempo: bound,
    });
    render(<CadenceTempoInput />);

    await user.click(screen.getByRole("button", { name }));
    expect(useEartrainerStore.getState().inPlayCadenceTempo).toBe(bound);
  });
});
