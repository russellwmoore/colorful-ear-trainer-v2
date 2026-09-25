import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // active:bg-none drops the gradient so the pressed state shows the solid foreground color
  "rounded-lg px-5 py-3 font-bold text-black bg-linear-to-r active:bg-none active:bg-foreground active:text-background",
  {
    variants: {
      variant: {
        play: "from-green-300 to-green-200",
        secondary: "from-blue-300 to-blue-200",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

export function Button({
  className,
  variant,
  type = "button",
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
