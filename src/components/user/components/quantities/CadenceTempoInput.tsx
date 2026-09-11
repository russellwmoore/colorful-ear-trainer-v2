import { useEartrainerStore } from "@/store/store";
import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 1;
const MAX = 400;
const STEP = 1;

export function CadenceTempoInput() {
  const cadenceTempo = useEartrainerStore((state) => state.cadenceTempo);
  const setCadenceTempo = useEartrainerStore((state) => state.setCadenceTempo);

  const handleIncrement = () => {
    if (cadenceTempo >= MAX) return;
    setCadenceTempo(cadenceTempo + STEP);
  };

  const handleDecrement = () => {
    if (cadenceTempo <= MIN) return;
    setCadenceTempo(cadenceTempo - STEP);
  };

  return (
    <QuantitiesInput
      label="Cadence Tempo:"
      subLabel="beats per minute"
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      value={cadenceTempo}
      min={MIN}
      max={MAX}
      step={STEP}
    />
  );
}
