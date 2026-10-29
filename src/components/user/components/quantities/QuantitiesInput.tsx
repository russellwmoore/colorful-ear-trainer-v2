import { Stepper, StepperInput } from "./Stepper";

type QuantitiesInputProps = {
  label: string;
  subLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  name: string;
  onValueChange: (value: number) => void;
};

export function QuantitiesInput({
  label,
  subLabel,
  value,
  min,
  max,
  step,
  name,
  onValueChange,
}: QuantitiesInputProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  // Typing is left unclamped so intermediate values (e.g. "1" on the way to "120")
  // are allowed, then the value is clamped once the user leaves the field.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (Number.isNaN(val)) return;
    onValueChange(val);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onValueChange(Number.isNaN(val) ? clamp(value) : clamp(val));
  };

  return (
    <Stepper
      label={label}
      subLabel={subLabel}
      onIncrement={() => onValueChange(clamp(value + step))}
      onDecrement={() => onValueChange(clamp(value - step))}
    >
      <StepperInput
        value={value}
        min={min}
        max={max}
        step={step}
        inputMode="decimal"
        onChange={handleChange}
        onBlur={handleBlur}
        name={`${name}StepperInput`}
      />
    </Stepper>
  );
}
