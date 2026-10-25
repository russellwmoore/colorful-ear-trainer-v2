import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useEartrainerStore } from "@/store/store";
import { RangeInput } from "./RangeInput";

const initialState = useEartrainerStore.getState();

// Base UI hides thumbs until it can measure layout, which jsdom never provides
const getThumbs = () => screen.getAllByRole("slider", { hidden: true });

describe("RangeInput", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("renders the label and a thumb for each end of the store range", () => {
    useEartrainerStore.setState({ octaveRange: [2, 5] });
    render(<RangeInput />);

    expect(screen.getByText("Range (Octaves):")).toBeInTheDocument();
    const [low, high] = getThumbs();
    expect(low).toHaveValue("2");
    expect(high).toHaveValue("5");
  });

  test("moving a thumb with the keyboard updates the store", () => {
    useEartrainerStore.setState({ octaveRange: [2, 5] });
    render(<RangeInput />);
    const [low, high] = getThumbs();

    fireEvent.keyDown(high, { key: "ArrowRight" });
    expect(useEartrainerStore.getState().octaveRange).toStrictEqual([2, 6]);

    fireEvent.keyDown(low, { key: "ArrowLeft" });
    expect(useEartrainerStore.getState().octaveRange).toStrictEqual([1, 6]);
  });

  test("keeps at least one octave between the thumbs", () => {
    useEartrainerStore.setState({ octaveRange: [3, 4] });
    render(<RangeInput />);
    const [low] = getThumbs();

    fireEvent.keyDown(low, { key: "ArrowRight" });
    expect(useEartrainerStore.getState().octaveRange).toStrictEqual([3, 4]);
  });
});
