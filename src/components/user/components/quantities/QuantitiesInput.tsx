import { Stepper, StepperInput } from "./Stepper";

type QuantitiesInputProps = {
  label: string;
  subLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function QuantitiesInput({
  label,
  subLabel,
  value,
  onIncrement,
  onDecrement,
  min,
  max,
  step,
}: QuantitiesInputProps) {
  return (
    <Stepper
      label={label}
      subLabel={subLabel}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
    >
      <StepperInput
        value={value}
        min={min}
        max={max}
        step={step}
        inputMode="decimal"
        // TODO: add general onChange to be passed from wrapper
      />
    </Stepper>
  );
}
