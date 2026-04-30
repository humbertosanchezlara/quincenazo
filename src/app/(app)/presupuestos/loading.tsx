import { Skeleton } from "@/components/ui/skeleton";

export default function PresupuestosLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 rounded-[2rem]" />
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Skeleton className="h-64 rounded-[2rem]" />
        <Skeleton className="h-64 rounded-[2rem]" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Skeleton className="h-72 rounded-[2rem]" />
        <Skeleton className="h-72 rounded-[2rem]" />
      </div>
    </div>
  );
}
