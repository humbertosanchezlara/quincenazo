import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-brand text-white shadow-[0_18px_30px_rgba(31,106,82,0.22)] hover:bg-brand-strong",
        variant === "secondary" &&
          "border border-border bg-surface-strong text-foreground hover:bg-white",
        variant === "ghost" && "text-foreground/70 hover:bg-white/70",
        variant === "danger" && "bg-danger text-white hover:bg-[#954534]",
        className,
      )}
      {...props}
    />
  );
}
