import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type StepperProps = {
  label: string;
  subLabel: string;
  onIncrement: () => void;
  onDecrement: () => void;
  // One or more StepperInputs (plus any separators) rendered between the -/+ buttons
  children: ReactNode;
};

export function Stepper({
  label,
  subLabel,
  onIncrement,
  onDecrement,
  children,
}: StepperProps) {
  return (
    <div>
      <p className="text-sm">{label}</p>
      <div className="mt-1 flex max-w-full items-center">
        <StepperButton aria-label="Decrease Quantity" onClick={onDecrement}>
          –
        </StepperButton>
        <div className="flex min-w-0 grow items-center border-y border-foreground">
          {children}
        </div>
        <StepperButton
          aria-label="Increase Quantity"
          data-increment=""
          onClick={onIncrement}
        >
          +
        </StepperButton>
      </div>
      <p className="text-xs text-muted-foreground">{subLabel}</p>
    </div>
  );
}

export function StepperInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-7.5 w-full min-w-0 grow appearance-none border-0 bg-background px-2 py-0 text-center text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function StepperButton(props: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className="flex size-8 flex-none items-center justify-center border border-foreground bg-background p-0 text-foreground active:bg-foreground active:text-background"
      {...props}
    />
  );
}
