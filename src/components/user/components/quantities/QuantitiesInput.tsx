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
          className="rounded-sm w-8 h-8 p-0 flex flex-none justify-center items-center border border-theme-text text-theme-text bg-theme-bg active:text-theme-bg active:bg-theme-text"
          aria-label="Decrease Quantity"
          onClick={onDecrement}
        >
          –
        </button>
        <input
          value={value}
          min={min}
          max={max}
          step={step}
          className="appearance-none grow min-w-0 bg-theme-bg text-theme-text h-8 border-0 py-0 px-2 text-center border-t border-b border-theme-text"
          inputMode="decimal"
          // TODO: add general onChange to be passed from wrapper
        />
        <button
          type="button"
          className="rounded-sm w-8 h-8 p-0 flex flex-none justify-center items-center border border-theme-text text-theme-text bg-theme-bg active:text-theme-bg active:bg-theme-text"
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
