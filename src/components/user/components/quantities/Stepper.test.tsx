import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Stepper, StepperInput } from "./Stepper";

describe("Stepper", () => {
  test("renders the label, sub label and children", () => {
    render(
      <Stepper
        label="Label:"
        subLabel="sub label"
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      >
        <StepperInput defaultValue="3" />
      </Stepper>,
    );

    expect(screen.getByText("Label:")).toBeInTheDocument();
    expect(screen.getByText("sub label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("3");
  });

  test("calls onIncrement and onDecrement from the +/- buttons", async () => {
    const user = userEvent.setup();
    const onIncrement = vi.fn();
    const onDecrement = vi.fn();
    render(
      <Stepper
        label="Label:"
        subLabel="sub label"
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      >
        <StepperInput />
      </Stepper>,
    );

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(onIncrement).toHaveBeenCalledOnce();
    expect(onDecrement).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(onDecrement).toHaveBeenCalledOnce();
  });

  test("buttons are type=button so they never submit a form", () => {
    render(
      <Stepper
        label="Label:"
        subLabel="sub label"
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      >
        <StepperInput />
      </Stepper>,
    );

    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("type", "button");
    }
  });
});

describe("StepperInput", () => {
  test("merges className and forwards props to the input", () => {
    render(<StepperInput className="custom" name="qty" defaultValue="7" />);
    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("custom", "text-center");
    expect(input).toHaveAttribute("name", "qty");
    expect(input).toHaveValue("7");
  });
});
