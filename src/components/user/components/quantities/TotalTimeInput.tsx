import { useEartrainerStore } from "@/store/store";
import { useState } from "react";
import { Stepper, StepperInput } from "./Stepper";

const MAX_TOTAL_TIME = 5999;

const MIN_MINUTES = "0";
const MAX_MINUTES = "99";

const MAX_SECONDS = "59";
const MIN_SECONDS = "00";

const NON_DIGIT_REGEX = /\D/g;

export function TotalTimeInput() {
  const [minutes, setMinutes] = useState("05");
  const [seconds, setSeconds] = useState("00");
  const totalSeconds = useEartrainerStore((state) => state.totalTime);
  const setTotalSeconds = useEartrainerStore((state) => state.setTotalTime);

  const convertSecondsIntoMmSs = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    const minutesString = String(minutes);
    const secondsString = String(seconds);

    setMinutes(
      minutesString.length === 1 ? `0${minutesString}` : minutesString,
    );
    setSeconds(
      secondsString.length === 1 ? `0${secondsString}` : secondsString,
    );
  };

  const convertFromInputsToTotalSeconds = () => {
    const totalMinutes = Number(minutes) * 60;
    const totalSeconds = Number(seconds);
    const totalTime = totalMinutes + totalSeconds;
    if (totalTime > MAX_TOTAL_TIME) {
      setTotalSeconds(MAX_TOTAL_TIME);
      convertSecondsIntoMmSs(MAX_TOTAL_TIME);
    } else {
      setTotalSeconds(totalTime);
      convertSecondsIntoMmSs(totalTime);
    }
  };
  const handleMinuteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newMinutes = e.target.value.replace(NON_DIGIT_REGEX, "");
    setMinutes(newMinutes);
  };

  const handleSecondInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newSeconds = e.target.value.replace(NON_DIGIT_REGEX, "");
    setSeconds(newSeconds);
  };

  const onDecrement = () => {
    const next = totalSeconds - 1;
    setTotalSeconds(next);
    convertSecondsIntoMmSs(next);
  };

  const onIncrement = () => {
    const next = totalSeconds + 1;
    setTotalSeconds(next);
    convertSecondsIntoMmSs(next);
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
        onBlur={convertFromInputsToTotalSeconds}
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
        onChange={handleSecondInputChange}
        onBlur={convertFromInputsToTotalSeconds}
      />
    </Stepper>
  );
}
