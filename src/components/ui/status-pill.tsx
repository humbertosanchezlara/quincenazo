import { cn } from "@/lib/utils";

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "danger" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-white/70 text-foreground/70",
        tone === "success" && "bg-success/12 text-success",
        tone === "danger" && "bg-danger/12 text-danger",
        tone === "warning" && "bg-warning/12 text-warning",
      )}
    >
      {children}
    </span>
  );
}
