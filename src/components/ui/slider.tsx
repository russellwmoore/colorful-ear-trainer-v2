import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbSize = 32,
  ...props
}: SliderPrimitive.Root.Props & { thumbSize?: number }) {
  // Explicit `readonly number[]` annotation: `value`/`defaultValue` come through as
  // `Value | undefined` from the generic `SliderPrimitive.Root.Props`, which resolves to
  // `any` here since `Slider` doesn't forward that generic — without this annotation
  // `_values` (and therefore `_values[0]`/`_values[1]`) infers as `any` too.
  const _values: readonly number[] = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      thumbCollisionBehavior="none"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-none border border-foreground bg-background select-none data-horizontal:h-4 data-horizontal:w-full data-vertical:h-2 data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-foreground select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <>
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              className="relative flex items-center justify-center shrink-0 rounded-none border border-foreground bg-background ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-1 focus-visible:ring-1 focus-visible:outline-hidden active:ring-1 disabled:pointer-events-none disabled:opacity-50"
              style={{ width: thumbSize, height: thumbSize }}
            >
              ||
              <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 text-sm font-large text-foreground select-none border border-foreground p-1.5 pl-2.5 pr-2.5">
                {_values[index]}
              </span>
            </SliderPrimitive.Thumb>
          </>
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
