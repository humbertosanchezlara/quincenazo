import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("glass-panel rounded-[1.7rem] p-4 sm:rounded-[2rem] sm:p-5 md:p-6", className)}>
      {children}
    </section>
  );
}
