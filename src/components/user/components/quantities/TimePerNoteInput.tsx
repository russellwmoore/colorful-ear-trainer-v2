import { useEartrainerStore } from "@/store/store";

import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 0.5;
const MAX = 999999;
const STEP = 0.5;

export function TimePerNoteInput() {
  const amountOfTimePerNote = useEartrainerStore((state) => state.timePerNote);
  const setAmountOfTimePerNote = useEartrainerStore(
    (state) => state.setTimePerNote,
  );

  return (
    <QuantitiesInput
      label="Time Per Note:"
      subLabel="seconds"
      value={amountOfTimePerNote}
      min={MIN}
      max={MAX}
      step={STEP}
      onValueChange={setAmountOfTimePerNote}
    />
  );
}
