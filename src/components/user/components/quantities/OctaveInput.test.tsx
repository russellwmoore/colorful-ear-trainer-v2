import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";

import { useEartrainerStore } from "@/store/store";

import { OctaveInput } from "./OctaveInput";

const initialState = useEartrainerStore.getState();

describe("OctaveInput", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("renders the label and the octave from the store", () => {
    useEartrainerStore.setState({ octave: 3 });
    render(<OctaveInput />);

    expect(screen.getByText("Octave:")).toBeInTheDocument();
    expect(screen.getByText("of cadence")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("3");
  });

  test("+ and - update octave in the store", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ octave: 3 });
    render(<OctaveInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().octave).toBe(4);
    expect(screen.getByRole("textbox")).toHaveValue("4");

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().octave).toBe(3);
  });

  test("+ does not go above 7", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ octave: 7 });
    render(<OctaveInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().octave).toBe(7);
  });

  test("- does not go below 1", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ octave: 1 });
    render(<OctaveInput />);

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().octave).toBe(1);
  });

  test("clamps a typed value into range on blur", async () => {
    const user = userEvent.setup();
    render(<OctaveInput />);
    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "99");
    await user.tab();
    expect(useEartrainerStore.getState().octave).toBe(7);
  });
});
