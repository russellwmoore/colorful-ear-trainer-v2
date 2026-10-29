import { useEartrainerStore } from "@/store/store";
import { msToSeconds, secondsToMs } from "@/utils/time";

import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 0.5;
const MAX = 999999;
const STEP = 0.5;

export function TimePerNoteInput() {
  const timePerNoteMs = useEartrainerStore((state) => state.timePerNoteMs);
  const setTimePerNoteMs = useEartrainerStore(
    (state) => state.setTimePerNoteMs,
  );

  return (
    <QuantitiesInput
      label="Time Per Note:"
      subLabel="seconds"
      // The store holds ms, the input shows and steps in seconds
      value={msToSeconds(timePerNoteMs)}
      min={MIN}
      max={MAX}
      step={STEP}
      onValueChange={(value) => setTimePerNoteMs(secondsToMs(value))}
    />
  );
}
