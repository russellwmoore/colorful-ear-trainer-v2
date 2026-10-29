import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";

import { useEartrainerStore } from "@/store/store";
import { secondsToMs } from "@/utils/time";

import { TimePerNoteInput } from "./TimePerNoteInput";

const initialState = useEartrainerStore.getState();

describe("TimePerNoteInput", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("renders the label and the time per note from the store", () => {
    useEartrainerStore.setState({ timePerNoteMs: secondsToMs(3) });
    render(<TimePerNoteInput />);

    expect(screen.getByText("Time Per Note:")).toBeInTheDocument();
    expect(screen.getByText("seconds")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("3");
  });

  test("+ and - update the time per note in the store", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ timePerNoteMs: secondsToMs(3) });
    render(<TimePerNoteInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().timePerNoteMs).toBe(secondsToMs(3.5));
    expect(screen.getByRole("textbox")).toHaveValue("3.5");

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().timePerNoteMs).toBe(secondsToMs(3));
  });

  test("+ does not go above 999999", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ timePerNoteMs: secondsToMs(999999) });
    render(<TimePerNoteInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().timePerNoteMs).toBe(
      secondsToMs(999999),
    );
  });

  test("- does not go below 0.5", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ timePerNoteMs: secondsToMs(0.5) });
    render(<TimePerNoteInput />);

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().timePerNoteMs).toBe(secondsToMs(0.5));
  });

  test("clamps a typed value into range on blur", async () => {
    const user = userEvent.setup();
    render(<TimePerNoteInput />);
    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "9999999");
    await user.tab();
    expect(useEartrainerStore.getState().timePerNoteMs).toBe(
      secondsToMs(999999),
    );
  });
});
