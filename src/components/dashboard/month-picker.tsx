"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { monthOptions } from "@/lib/format";

export function MonthPicker({ month }: { month: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const options = monthOptions(month);

  return (
    <select
      className="rounded-full border border-border bg-white/85 px-4 py-2 text-sm font-medium text-foreground outline-none"
      value={month}
      onChange={(event) => {
        const next = new URLSearchParams(searchParams.toString());
        next.set("month", event.target.value);
        router.push(`?${next.toString()}`);
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
