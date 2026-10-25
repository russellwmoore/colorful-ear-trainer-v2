import { useEartrainerStore } from "@/store/store";
import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 1;
const MAX = 999999;
const STEP = 1;

export function CadenceEveryInput() {
  const cadenceEvery = useEartrainerStore((state) => state.cadenceEvery);
  const setCadenceEvery = useEartrainerStore((state) => state.setCadenceEvery);

  return (
    <QuantitiesInput
      label="Cadence every:"
      subLabel="question(s)"
      value={cadenceEvery}
      min={MIN}
      max={MAX}
      step={STEP}
      onValueChange={setCadenceEvery}
    />
  );
}
