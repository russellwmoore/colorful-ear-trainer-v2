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
    <div>
      <p className="text-sm">{label}</p>
      <div className="mt-1 flex items-center max-w-full">
        <button
          type="button"
          className="incrementer"
          aria-label="Decrease Quantity"
          onClick={onDecrement}
        >
          –
        </button>
        <div className="time-input grow min-w-0">
          <input
            value={value}
            min={min}
            max={max}
            step={step}
            className="grow min-w-0 w-full"
            inputMode="decimal"
            // TODO: add general onChange to be passed from wrapper
          />
        </div>
        <button
          type="button"
          className="incrementer"
          data-increment=""
          aria-label="Increase Quantity"
          onClick={onIncrement}
        >
          +
        </button>
      </div>
      <p className="text-xs text-theme-secondary">{subLabel}</p>
    </div>
  );
}
