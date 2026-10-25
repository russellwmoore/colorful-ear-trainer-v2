import { useEartrainerStore } from "@/store/store";

import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 1;
const MAX = 7;
const STEP = 1;

export function OctaveInput() {
  const octave = useEartrainerStore((state) => state.octave);
  const setOctave = useEartrainerStore((state) => state.setOctave);

  return (
    <QuantitiesInput
      label="Octave:"
      subLabel="of cadence"
      value={octave}
      min={MIN}
      max={MAX}
      step={STEP}
      onValueChange={setOctave}
    />
  );
}
