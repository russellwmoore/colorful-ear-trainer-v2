import { useEartrainerStore } from "@/store/store";
import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 1;
const MAX = 12;
const STEP = 1;

export function NoteQuantitiesInput() {
  const amountOfNotes = useEartrainerStore((state) => state.notes);
  const setAmountOfNotes = useEartrainerStore((state) => state.setNotes);

  const handleIncrement = () => {
    if (amountOfNotes >= MAX) return;
    setAmountOfNotes(amountOfNotes + STEP);
  };

  const handleDecrement = () => {
    if (amountOfNotes <= MIN) return;
    setAmountOfNotes(amountOfNotes - STEP);
  };

  return (
    <QuantitiesInput
      label="Notes:"
      subLabel="after cadence"
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      value={amountOfNotes}
      min={MIN}
      max={MAX}
      step={STEP}
    />
  );
}
