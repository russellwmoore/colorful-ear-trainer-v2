import { useEartrainerStore } from "@/store/store";
import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 1;
const MAX = 999999;
const STEP = 1;

export function CadenceEveryInput() {
  const cadenceEvery = useEartrainerStore((state) => state.cadenceEvery);
  const setCadenceEvery = useEartrainerStore((state) => state.setCadenceEvery);

  const handleIncrement = () => {
    if (cadenceEvery >= MAX) return;
    setCadenceEvery(cadenceEvery + STEP);
  };

  const handleDecrement = () => {
    if (cadenceEvery <= MIN) return;
    setCadenceEvery(cadenceEvery - STEP);
  };

  return (
    <QuantitiesInput
      label="Cadence every:"
      subLabel="question(s)"
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      value={cadenceEvery}
      min={MIN}
      max={MAX}
      step={STEP}
    />
  );
}
