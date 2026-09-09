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

  const handleIncrement = () => {
    if (amountOfTimePerNote >= MAX) return;
    setAmountOfTimePerNote(amountOfTimePerNote + STEP);
  };

  const handleDecrement = () => {
    if (amountOfTimePerNote <= MIN) return;
    setAmountOfTimePerNote(amountOfTimePerNote - STEP);
  };

  return (
    <QuantitiesInput
      label="Time Per Note:"
      subLabel="seconds"
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      value={amountOfTimePerNote}
      min={MIN}
      max={MAX}
      step={STEP}
    />
  );
}
