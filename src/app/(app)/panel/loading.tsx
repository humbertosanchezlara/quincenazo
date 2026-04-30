import { Skeleton } from "@/components/ui/skeleton";

export default function PanelLoading() {
  return (
    <div className="space-y-6 py-1">
      <Skeleton className="h-40 rounded-[2rem]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-[1.8rem]" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Skeleton className="h-72 rounded-[2rem]" />
        <Skeleton className="h-72 rounded-[2rem]" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Skeleton className="h-52 rounded-[2rem]" />
        <Skeleton className="h-52 rounded-[2rem]" />
      </div>
    </div>
  );
}
