import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEartrainerStore } from "@/store/store";
import { TimePerNoteInput } from "./TimePerNoteInput";

const initialState = useEartrainerStore.getState();

describe("TimePerNoteInput", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("renders the label and the timePerNote from the store", () => {
    useEartrainerStore.setState({ timePerNote: 3 });
    render(<TimePerNoteInput />);

    expect(screen.getByText("Time Per Note:")).toBeInTheDocument();
    expect(screen.getByText("seconds")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("3");
  });

  test("+ and - update timePerNote in the store", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ timePerNote: 3 });
    render(<TimePerNoteInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().timePerNote).toBe(3.5);
    expect(screen.getByRole("textbox")).toHaveValue("3.5");

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().timePerNote).toBe(3);
  });

  test("+ does not go above 999999", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ timePerNote: 999999 });
    render(<TimePerNoteInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().timePerNote).toBe(999999);
  });

  test("- does not go below 0.5", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ timePerNote: 0.5 });
    render(<TimePerNoteInput />);

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().timePerNote).toBe(0.5);
  });

  test("clamps a typed value into range on blur", async () => {
    const user = userEvent.setup();
    render(<TimePerNoteInput />);
    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "9999999");
    await user.tab();
    expect(useEartrainerStore.getState().timePerNote).toBe(999999);
  });
});
