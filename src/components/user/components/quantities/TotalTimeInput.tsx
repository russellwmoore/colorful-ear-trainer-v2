import { useEartrainerStore } from "@/store/store";
import { useState } from "react";
import { Stepper, StepperInput } from "./Stepper";
import { millisecondsToMMSS } from "@/utils/countdownUtils";

// 99:59, the most that fits in MM:SS
const MAX_TOTAL_TIME_MS = (99 * 60 + 59) * 1000;
const STEP_MS = 1000;

const MIN_MINUTES = millisecondsToMMSS(0).minutes;
const MAX_MINUTES = millisecondsToMMSS(MAX_TOTAL_TIME_MS).minutes;

const MAX_SECONDS = millisecondsToMMSS(MAX_TOTAL_TIME_MS).seconds;
const MIN_SECONDS = millisecondsToMMSS(0).seconds;

const NON_DIGIT_REGEX = /\D/g;

type Draft = { minutes: string; seconds: string };

const clampTotalTime = (ms: number) =>
  Math.min(MAX_TOTAL_TIME_MS, Math.max(0, ms));

// The store holds the total time in ms and is the source of truth. While the
// user is typing, the raw field values live in a local draft on blur the draft
// is committed to the store then it is cleared, and the fields go back to reading
// from the store. The time displayed in this component is always a formatted
// value of ms to MM:SS.
export function TotalTimeInput() {
  const totalTime = useEartrainerStore((state) => state.totalInitialGameTime);
  const setTotalInitialGameTime = useEartrainerStore(
    (state) => state.setTotalInitialGameTime,
  );

  const [draft, setDraft] = useState<Draft | null>(null);
  const { minutes, seconds } = draft ?? millisecondsToMMSS(totalTime);

  const commitDraft = () => {
    if (!draft) return;
    const totalSeconds = Number(draft.minutes) * 60 + Number(draft.seconds);
    const newTime = clampTotalTime(totalSeconds * 1000);
    setTotalInitialGameTime(newTime);
    setDraft(null);
  };

  const handleMinuteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft({
      minutes: e.target.value.replace(NON_DIGIT_REGEX, ""),
      seconds,
    });
  };

  const handleSecondInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft({
      minutes,
      seconds: e.target.value.replace(NON_DIGIT_REGEX, ""),
    });
  };

  const onDecrement = () => {
    setDraft(null);
    const newTime = clampTotalTime(totalTime - STEP_MS);
    setTotalInitialGameTime(newTime);
  };

  const onIncrement = () => {
    setDraft(null);
    const newTime = clampTotalTime(totalTime + STEP_MS);
    setTotalInitialGameTime(newTime);
  };

  return (
    <Stepper
      label="Total Time:"
      subLabel="in minutes"
      onIncrement={onIncrement}
      onDecrement={onDecrement}
    >
      <StepperInput
        id="CountdownMinutes"
        inputMode="numeric"
        min={MIN_MINUTES}
        max={MAX_MINUTES}
        name="countdown-minutes"
        value={minutes}
        pattern="\d{2}"
        step="1"
        autoComplete="off"
        data-countdown
        onBlur={commitDraft}
        onChange={handleMinuteInputChange}
      />
      :
      <StepperInput
        id="CountdownSeconds"
        inputMode="numeric"
        min={MIN_SECONDS}
        max={MAX_SECONDS}
        name="countdown-seconds"
        value={seconds}
        pattern="\d{2}"
        step="1"
        autoComplete="off"
        data-countdown
        onBlur={commitDraft}
        onChange={handleSecondInputChange}
      />
    </Stepper>
  );
}
