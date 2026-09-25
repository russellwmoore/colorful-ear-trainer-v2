import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full appearance-none rounded-lg border border-foreground bg-background pl-2 pr-6 text-lg leading-tight text-foreground",
          className,
        )}
        {...props}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-1 -mt-1 size-4 -translate-y-1/2 text-sm text-foreground"
      >
        ▾
      </span>
    </div>
  );
}
