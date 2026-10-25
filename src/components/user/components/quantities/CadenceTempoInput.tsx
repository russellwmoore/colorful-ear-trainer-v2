import { useEartrainerStore } from "@/store/store";

import { QuantitiesInput } from "./QuantitiesInput";

const MIN = 60;
const MAX = 400;
const STEP = 1;

export function CadenceTempoInput() {
  const cadenceTempoInit = useEartrainerStore((s) => s.cadenceTempoInit);
  const inPlayCadenceTempo = useEartrainerStore((s) => s.inPlayCadenceTempo);
  const setCadenceTempo = useEartrainerStore((s) => s.setCadenceTempoInit);
  const setInPlayCadenceTempo = useEartrainerStore(
    (s) => s.setInPlayCadenceTempo,
  );

  const isInitialTempo = inPlayCadenceTempo === cadenceTempoInit;

  const setTempo = (val: number) => {
    setInPlayCadenceTempo(val);
    if (isInitialTempo) setCadenceTempo(val);
  };

  return (
    <QuantitiesInput
      label="Cadence Tempo:"
      subLabel="beats per minute"
      value={inPlayCadenceTempo}
      min={MIN}
      max={MAX}
      step={STEP}
      onValueChange={setTempo}
    />
  );
}
