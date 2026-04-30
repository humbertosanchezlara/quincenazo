import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriasLoading() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <Skeleton className="h-52 rounded-[2rem]" />
        <Skeleton className="h-40 rounded-[2rem]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-40 rounded-full" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-[1.4rem]" />
        ))}
      </div>
    </div>
  );
}
