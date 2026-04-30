import { Skeleton } from "@/components/ui/skeleton";

export default function ReportesLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 rounded-[2rem]" />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-[1.4rem]" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-[1.4rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}
