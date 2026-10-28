import { useEartrainerStore } from "@/store/store";

import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 1;
const MAX = 12;
const STEP = 1;

export function NoteQuantitiesInput() {
  const amountOfNotes = useEartrainerStore(
    (state) => state.amountOfNotesToGuess,
  );
  const setAmountOfNotes = useEartrainerStore(
    (state) => state.setAmountOfNotesToGuess,
  );

  return (
    <QuantitiesInput
      label="Notes:"
      subLabel="after cadence"
      value={amountOfNotes}
      min={MIN}
      max={MAX}
      step={STEP}
      onValueChange={setAmountOfNotes}
    />
  );
}
