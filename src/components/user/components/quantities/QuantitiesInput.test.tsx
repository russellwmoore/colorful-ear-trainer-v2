import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { QuantitiesInput } from "./QuantitiesInput";

const renderInput = (value: number) => {
  const onValueChange = vi.fn();
  render(
    <QuantitiesInput
      label="Notes:"
      subLabel="after cadence"
      value={value}
      min={1}
      max={10}
      step={2}
      onValueChange={onValueChange}
    />,
  );
  return { onValueChange, input: screen.getByRole("textbox") };
};

describe("QuantitiesInput", () => {
  test("renders the label, sub label and value", () => {
    const { input } = renderInput(5);

    expect(screen.getByText("Notes:")).toBeInTheDocument();
    expect(screen.getByText("after cadence")).toBeInTheDocument();
    expect(input).toHaveValue("5");
  });

  test("increments and decrements by step", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderInput(5);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(onValueChange).toHaveBeenLastCalledWith(7);

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(onValueChange).toHaveBeenLastCalledWith(3);
  });

  test("clamps increment to max", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderInput(9);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  test("clamps decrement to min", async () => {
    const user = userEvent.setup();
    const { onValueChange } = renderInput(2);

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  test("passes typed values through unclamped", () => {
    const { input, onValueChange } = renderInput(5);

    fireEvent.change(input, { target: { value: "100" } });
    expect(onValueChange).toHaveBeenLastCalledWith(100);
  });

  test("ignores typed values that are not numbers", () => {
    const { input, onValueChange } = renderInput(5);

    fireEvent.change(input, { target: { value: "abc" } });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test.each([
    ["100", 10],
    ["-3", 1],
    ["4", 4],
    ["", 1],
  ])("clamps %j to %d on blur", (typed, expected) => {
    const { input, onValueChange } = renderInput(5);

    fireEvent.blur(input, { target: { value: typed } });
    expect(onValueChange).toHaveBeenLastCalledWith(expected);
  });

  test("falls back to the clamped current value when blurred with a non-number", () => {
    const { input, onValueChange } = renderInput(50);

    fireEvent.blur(input, { target: { value: "abc" } });
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });
});
