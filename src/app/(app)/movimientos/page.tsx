import { format } from "date-fns";
import { DeleteTransactionForm } from "@/components/forms/delete-transaction-form";
import { TransactionForm } from "@/components/forms/transaction-form";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { formatCurrency, formatLongDate, sanitizeMonth } from "@/lib/format";
import { getCategories, getTransactionsByMonth } from "@/lib/queries";

export default async function MovimientosPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = sanitizeMonth(params.month);
  const [transactions, categories] = await Promise.all([
    getTransactionsByMonth(month),
    getCategories(),
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Alta y edición</p>
          <h1 className="display-copy mt-3 text-4xl text-foreground">Movimientos manuales.</h1>
          <p className="mt-3 text-sm leading-7 text-foreground/68">
            Captura rápida para ingresos y gastos con categorías, subcategorías, notas y
            sugerencias basadas en historial de texto.
          </p>
        </div>
        <TransactionForm
          month={month}
          categories={categories}
          defaultDate={format(new Date(), "yyyy-MM-dd")}
        />
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bitácora del mes</h2>
            <p className="text-sm text-foreground/58">{transactions.length} movimientos cargados.</p>
          </div>
          <StatusPill>{month}</StatusPill>
        </div>
        <div className="space-y-3">
          {transactions.length ? (
            transactions.map((transaction) => (
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
              Todavía no hay movimientos para este mes.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
