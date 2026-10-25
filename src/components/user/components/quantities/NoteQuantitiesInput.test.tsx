import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEartrainerStore } from "@/store/store";
import { NoteQuantitiesInput } from "./NoteQuantitiesInput";

const initialState = useEartrainerStore.getState();

describe("NoteQuantitiesInput", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("renders the label and the amountOfnotesToGuess from the store", () => {
    useEartrainerStore.setState({ amountOfnotesToGuess: 3 });
    render(<NoteQuantitiesInput />);

    expect(screen.getByText("Notes:")).toBeInTheDocument();
    expect(screen.getByText("after cadence")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("3");
  });

  test("+ and - update amountOfnotesToGuess in the store", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ amountOfnotesToGuess: 3 });
    render(<NoteQuantitiesInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().amountOfnotesToGuess).toBe(4);
    expect(screen.getByRole("textbox")).toHaveValue("4");

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().amountOfnotesToGuess).toBe(3);
  });

  test("+ does not go above 12", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ amountOfnotesToGuess: 12 });
    render(<NoteQuantitiesInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().amountOfnotesToGuess).toBe(12);
  });

  test("- does not go below 1", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ amountOfnotesToGuess: 1 });
    render(<NoteQuantitiesInput />);

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().amountOfnotesToGuess).toBe(1);
  });

  test("clamps a typed value into range on blur", async () => {
    const user = userEvent.setup();
    render(<NoteQuantitiesInput />);
    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "99");
    await user.tab();
    expect(useEartrainerStore.getState().amountOfnotesToGuess).toBe(12);
  });
});
