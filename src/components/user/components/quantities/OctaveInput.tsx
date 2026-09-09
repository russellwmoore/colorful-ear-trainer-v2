import { useEartrainerStore } from "@/store/store";
import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 1;
const MAX = 7;
const STEP = 1;

export function OctaveInput() {
  const octave = useEartrainerStore((state) => state.octave);
  const setOctave = useEartrainerStore((state) => state.setOctave);

  const handleIncrement = () => {
    if (octave >= MAX) return;
    setOctave(octave + STEP);
  };

  const handleDecrement = () => {
    if (octave <= MIN) return;
    setOctave(octave - STEP);
  };

  return (
    <QuantitiesInput
      label="Octave:"
      subLabel="of cadence"
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      value={octave}
      min={MIN}
      max={MAX}
      step={STEP}
    />
  );
}
