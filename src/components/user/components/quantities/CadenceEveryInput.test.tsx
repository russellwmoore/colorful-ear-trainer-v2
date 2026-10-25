import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";

import { useEartrainerStore } from "@/store/store";

import { CadenceEveryInput } from "./CadenceEveryInput";

const initialState = useEartrainerStore.getState();

describe("CadenceEveryInput", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("renders the label and the cadenceEvery from the store", () => {
    useEartrainerStore.setState({ cadenceEvery: 3 });
    render(<CadenceEveryInput />);

    expect(screen.getByText("Cadence every:")).toBeInTheDocument();
    expect(screen.getByText("question(s)")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("3");
  });

  test("+ and - update cadenceEvery in the store", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ cadenceEvery: 3 });
    render(<CadenceEveryInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().cadenceEvery).toBe(4);
    expect(screen.getByRole("textbox")).toHaveValue("4");

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().cadenceEvery).toBe(3);
  });

  test("+ does not go above 999999", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ cadenceEvery: 999999 });
    render(<CadenceEveryInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(useEartrainerStore.getState().cadenceEvery).toBe(999999);
  });

  test("- does not go below 1", async () => {
    const user = userEvent.setup();
    useEartrainerStore.setState({ cadenceEvery: 1 });
    render(<CadenceEveryInput />);

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(useEartrainerStore.getState().cadenceEvery).toBe(1);
  });

  test("clamps a typed value into range on blur", async () => {
    const user = userEvent.setup();
    render(<CadenceEveryInput />);
    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "9999999");
    await user.tab();
    expect(useEartrainerStore.getState().cadenceEvery).toBe(999999);
  });
});
