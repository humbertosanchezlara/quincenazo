import { format } from "date-fns";
import { TransactionForm } from "@/components/forms/transaction-form";
import { MovimientosFilters } from "@/components/movimientos/movimientos-filters";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { formatMonthLabel, sanitizeMonth } from "@/lib/format";
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
    <div className="space-y-4 md:space-y-6">
      <Card className="space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.3em] text-foreground/45">
          Movimientos
        </p>
        <h1 className="display-copy text-3xl leading-none text-foreground md:text-4xl">
          Bitácora de {formatMonthLabel(month)}.
        </h1>
        <p className="text-sm leading-6 text-foreground/68">
          En mobile primero va la lectura del mes; la captura queda disponible más abajo sin
          tapar la lista.
        </p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr] xl:gap-6">
        <Card className="order-1">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Bitácora del mes</h2>
              <p className="text-sm text-foreground/58">{transactions.length} movimientos cargados.</p>
            </div>
            <StatusPill>{month}</StatusPill>
          </div>
          <MovimientosFilters transactions={transactions} categories={categories} />
        </Card>

        <Card className="order-2 space-y-4 xl:order-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Alta y edición</p>
            <h2 className="display-copy mt-3 text-3xl text-foreground md:text-4xl">
              Captura manual.
            </h2>
            <p className="mt-3 text-sm leading-7 text-foreground/68">
              Registra ingresos y gastos con categorías, subcategorías, notas y sugerencias
              basadas en historial de texto.
            </p>
          </div>
          <TransactionForm
            month={month}
            categories={categories}
            defaultDate={format(new Date(), "yyyy-MM-dd")}
          />
        </Card>
      </div>
    </div>
  );
}
