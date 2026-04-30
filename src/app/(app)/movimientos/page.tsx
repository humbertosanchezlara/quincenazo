import { format } from "date-fns";
import { TransactionForm } from "@/components/forms/transaction-form";
import { MovimientosFilters } from "@/components/movimientos/movimientos-filters";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { sanitizeMonth } from "@/lib/format";
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
        <MovimientosFilters transactions={transactions} categories={categories} />
      </Card>
    </div>
  );
}
