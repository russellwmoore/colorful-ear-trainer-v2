import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEartrainerStore } from "@/store/store";
import { TotalTimeInput } from "./TotalTimeInput";

const initialState = useEartrainerStore.getState();

const MAX_TOTAL_TIME_MS = (99 * 60 + 59) * 1000;

const setTotalTime = (ms: number) =>
  useEartrainerStore.setState({ totalInitialGameTime: ms });
const getTotalTime = () => useEartrainerStore.getState().totalInitialGameTime;

const getInputs = () => {
  const [minutes, seconds] = screen.getAllByRole("textbox");
  return { minutes, seconds };
};

describe("TotalTimeInput", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("renders the label and the store time as MM:SS", () => {
    setTotalTime((2 * 60 + 5) * 1000);
    render(<TotalTimeInput />);

    expect(screen.getByText("Total Time:")).toBeInTheDocument();
    expect(screen.getByText("in minutes")).toBeInTheDocument();
    const { minutes, seconds } = getInputs();
    expect(minutes).toHaveValue("02");
    expect(seconds).toHaveValue("05");
  });

  test("+ and - change the time by one second", async () => {
    const user = userEvent.setup();
    setTotalTime(60 * 1000);
    render(<TotalTimeInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(getTotalTime()).toBe(61 * 1000);
    expect(getInputs().seconds).toHaveValue("01");

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(getTotalTime()).toBe(59 * 1000);
    expect(getInputs().minutes).toHaveValue("00");
    expect(getInputs().seconds).toHaveValue("59");
  });

  test("- does not go below 00:00", async () => {
    const user = userEvent.setup();
    setTotalTime(0);
    render(<TotalTimeInput />);

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(getTotalTime()).toBe(0);
  });

  test("+ does not go above 99:59", async () => {
    const user = userEvent.setup();
    setTotalTime(MAX_TOTAL_TIME_MS);
    render(<TotalTimeInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(getTotalTime()).toBe(MAX_TOTAL_TIME_MS);
  });

  test("holds typed values as a draft and commits them to the store on blur", async () => {
    const user = userEvent.setup();
    setTotalTime(5 * 60 * 1000);
    render(<TotalTimeInput />);
    const { minutes, seconds } = getInputs();

    await user.clear(minutes);
    await user.type(minutes, "3");
    await user.click(seconds);
    expect(getTotalTime()).toBe(3 * 60 * 1000);
    // Draft is cleared, so the field is re-formatted from the store
    expect(minutes).toHaveValue("03");

    await user.clear(seconds);
    expect(getTotalTime()).toBe(3 * 60 * 1000);
    await user.type(seconds, "30");
    await user.tab();
    expect(getTotalTime()).toBe((3 * 60 + 30) * 1000);
  });

  test("strips non-digit characters while typing", async () => {
    const user = userEvent.setup();
    setTotalTime(0);
    render(<TotalTimeInput />);
    const { minutes } = getInputs();

    await user.clear(minutes);
    await user.type(minutes, "1a-2");
    expect(minutes).toHaveValue("12");
  });

  test("rolls overflowing seconds into minutes on commit", async () => {
    const user = userEvent.setup();
    setTotalTime(0);
    render(<TotalTimeInput />);
    const { minutes, seconds } = getInputs();

    await user.clear(seconds);
    await user.type(seconds, "90");
    await user.tab();
    expect(getTotalTime()).toBe(90 * 1000);
    expect(minutes).toHaveValue("01");
    expect(seconds).toHaveValue("30");
  });

  test("clamps a committed draft to 99:59", async () => {
    const user = userEvent.setup();
    setTotalTime(0);
    render(<TotalTimeInput />);
    const { minutes, seconds } = getInputs();

    await user.clear(minutes);
    await user.type(minutes, "99");
    await user.clear(seconds);
    await user.type(seconds, "99");
    await user.tab();
    expect(getTotalTime()).toBe(MAX_TOTAL_TIME_MS);
  });

  test("blurring without typing leaves the store unchanged", async () => {
    const user = userEvent.setup();
    setTotalTime(42 * 1000);
    render(<TotalTimeInput />);

    await user.click(getInputs().minutes);
    await user.tab();
    expect(getTotalTime()).toBe(42 * 1000);
  });

  test("+ commits a typed draft before incrementing", async () => {
    const user = userEvent.setup();
    setTotalTime(60 * 1000);
    render(<TotalTimeInput />);
    const { minutes } = getInputs();

    await user.clear(minutes);
    await user.type(minutes, "7");
    // Clicking + blurs the field, which commits 07:00 first
    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(getTotalTime()).toBe((7 * 60 + 1) * 1000);
    expect(minutes).toHaveValue("07");
    expect(getInputs().seconds).toHaveValue("01");
  });
});
