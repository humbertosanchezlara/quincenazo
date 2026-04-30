"use client";

import { useMemo, useState } from "react";
import { DeleteTransactionForm } from "@/components/forms/delete-transaction-form";
import { StatusPill } from "@/components/ui/status-pill";
import { formatCurrency, formatLongDate } from "@/lib/format";
import type { Category, TransactionWithRelations } from "@/lib/types";

type CategoryOption = Pick<Category, "id" | "name" | "transaction_type">;

export function MovimientosFilters({
  transactions,
  categories,
}: {
  transactions: TransactionWithRelations[];
  categories: CategoryOption[];
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((t) => {
      if (q && !t.payee.toLowerCase().includes(q) && !t.notes?.toLowerCase().includes(q)) {
        return false;
      }
      if (typeFilter !== "all" && t.transaction_type !== typeFilter) return false;
      if (categoryFilter && t.category_id !== categoryFilter) return false;
      return true;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const hasActiveFilter = search || typeFilter !== "all" || categoryFilter;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="search"
          placeholder="Buscar por comercio o nota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-2xl border border-border bg-white/80 px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "all" | "income" | "expense")}
          className="rounded-2xl border border-border bg-white/80 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        >
          <option value="all">Todos los tipos</option>
          <option value="income">Solo ingresos</option>
          <option value="expense">Solo gastos</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-2xl border border-border bg-white/80 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilter && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground/58">
            {filtered.length} de {transactions.length} movimientos
          </p>
          <button
            onClick={() => { setSearch(""); setTypeFilter("all"); setCategoryFilter(""); }}
            className="text-xs font-medium text-brand hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length ? (
          filtered.map((transaction) => (
            <div key={transaction.id} className="rounded-[1.4rem] border border-border bg-white/65 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-foreground">{transaction.payee}</p>
                    <StatusPill tone={transaction.transaction_type === "income" ? "success" : "neutral"}>
                      {transaction.transaction_type === "income" ? "Ingreso" : "Gasto"}
                    </StatusPill>
                  </div>
                  <p className="mt-2 text-sm text-foreground/58">
                    {transaction.category?.name ?? "Sin categoría"}
                    {transaction.subcategory ? ` · ${transaction.subcategory.name}` : ""}
                    {" · "}
                    {formatLongDate(transaction.occurred_on)}
                  </p>
                  {transaction.notes ? (
                    <p className="mt-2 text-sm text-foreground/60">{transaction.notes}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-semibold text-foreground">
                    {transaction.transaction_type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <DeleteTransactionForm id={transaction.id} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.4rem] border border-dashed border-border bg-white/45 p-5 text-sm text-foreground/60">
            {hasActiveFilter
              ? "No hay movimientos que coincidan con los filtros."
              : "Todavía no hay movimientos para este mes."}
          </div>
        )}
      </div>
    </div>
  );
}
