import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";

import { useEartrainerStore } from "@/store/store";
import {
  minutesToMs as minutesToMs,
  secondsToMs as secondsToMs,
} from "@/utils/time";

import { TotalTimeInput } from "./TotalTimeInput";

const initialState = useEartrainerStore.getState();

const MAX_TOTAL_TIME_MS = minutesToMs(99) + secondsToMs(59);

const setTotalTime = (ms: number) =>
  useEartrainerStore.setState({ totalInitialGameTimeMs: ms });
const getTotalTime = () => useEartrainerStore.getState().totalInitialGameTimeMs;

const getInputs = () => {
  const [minutes, seconds] = screen.getAllByRole("textbox");
  return { minutes, seconds };
};

describe("TotalTimeInput", () => {
  beforeEach(() => {
    useEartrainerStore.setState(initialState, true);
  });

  test("renders the label and the store time as MM:SS", () => {
    setTotalTime(minutesToMs(2) + secondsToMs(5));
    render(<TotalTimeInput />);

    expect(screen.getByText("Total Time:")).toBeInTheDocument();
    expect(screen.getByText("in minutes")).toBeInTheDocument();
    const { minutes, seconds } = getInputs();
    expect(minutes).toHaveValue("02");
    expect(seconds).toHaveValue("05");
  });

  test("+ and - change the time by one second", async () => {
    const user = userEvent.setup();
    setTotalTime(minutesToMs(1));
    render(<TotalTimeInput />);

    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(getTotalTime()).toBe(secondsToMs(61));
    expect(getInputs().seconds).toHaveValue("01");

    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    await user.click(screen.getByRole("button", { name: "Decrease Quantity" }));
    expect(getTotalTime()).toBe(secondsToMs(59));
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
    setTotalTime(minutesToMs(5));
    render(<TotalTimeInput />);
    const { minutes, seconds } = getInputs();

    await user.clear(minutes);
    await user.type(minutes, "3");
    await user.click(seconds);
    expect(getTotalTime()).toBe(minutesToMs(3));
    // Draft is cleared, so the field is re-formatted from the store
    expect(minutes).toHaveValue("03");

    await user.clear(seconds);
    expect(getTotalTime()).toBe(minutesToMs(3));
    await user.type(seconds, "30");
    await user.tab();
    expect(getTotalTime()).toBe(minutesToMs(3) + secondsToMs(30));
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
    expect(getTotalTime()).toBe(secondsToMs(90));
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
    setTotalTime(secondsToMs(42));
    render(<TotalTimeInput />);

    await user.click(getInputs().minutes);
    await user.tab();
    expect(getTotalTime()).toBe(secondsToMs(42));
  });

  test("+ commits a typed draft before incrementing", async () => {
    const user = userEvent.setup();
    setTotalTime(minutesToMs(1));
    render(<TotalTimeInput />);
    const { minutes } = getInputs();

    await user.clear(minutes);
    await user.type(minutes, "7");
    // Clicking + blurs the field, which commits 07:00 first
    await user.click(screen.getByRole("button", { name: "Increase Quantity" }));
    expect(getTotalTime()).toBe(minutesToMs(7) + secondsToMs(1));
    expect(minutes).toHaveValue("07");
    expect(getInputs().seconds).toHaveValue("01");
  });
});
