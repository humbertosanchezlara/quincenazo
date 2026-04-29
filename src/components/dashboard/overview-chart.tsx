"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function OverviewChart({
  budgetComparisons,
  categoryBreakdown,
}: {
  budgetComparisons: {
    categoryName: string;
    categoryColor: string;
    planned: number;
    actual: number;
  }[];
  categoryBreakdown: {
    categoryName: string;
    color: string;
    actual: number;
  }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="h-72 rounded-[1.5rem] border border-border bg-white/60 p-4 chart-grid">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={budgetComparisons}>
            <CartesianGrid stroke="rgba(29,42,37,0.08)" vertical={false} />
            <XAxis dataKey="categoryName" tick={{ fill: "#5d6f67", fontSize: 12 }} />
            <YAxis tick={{ fill: "#5d6f67", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="planned" fill="#d6a756" radius={[10, 10, 0, 0]} />
            <Bar dataKey="actual" fill="#1f6a52" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-72 rounded-[1.5rem] border border-border bg-white/60 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryBreakdown.slice(0, 5)}
              dataKey="actual"
              nameKey="categoryName"
              innerRadius={64}
              outerRadius={92}
              paddingAngle={4}
            >
              {categoryBreakdown.slice(0, 5).map((entry) => (
                <Cell key={entry.categoryName} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
