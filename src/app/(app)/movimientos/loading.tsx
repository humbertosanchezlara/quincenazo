import { Skeleton } from "@/components/ui/skeleton";

export default function MovimientosLoading() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Skeleton className="h-[480px] rounded-[2rem]" />
      <div className="space-y-3">
        <Skeleton className="h-10 rounded-[2rem]" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-[1.4rem]" />
        ))}
      </div>
    </div>
  );
}
