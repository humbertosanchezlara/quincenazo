import { format } from "date-fns";
import { BudgetForm } from "@/components/forms/budget-form";
import { RecurringForm } from "@/components/forms/recurring-form";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { formatCurrency, formatMonthLabel, sanitizeMonth } from "@/lib/format";
import { getBudgetsByMonth, getCategories, getDashboardData, getRecurringTransactions } from "@/lib/queries";

export default async function PresupuestosPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = sanitizeMonth(params.month);
  const [budgets, categories, recurring, dashboard] = await Promise.all([
    getBudgetsByMonth(month),
    getCategories(),
    getRecurringTransactions(),
    getDashboardData(month),
  ]);

  return (
    <div className="space-y-6">
      <header className="glass-panel rounded-[2rem] p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Planeación</p>
        <h1 className="display-copy mt-3 text-4xl text-foreground md:text-5xl">
          Presupuestos de {formatMonthLabel(month)}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/68">
          Define techos por categoría, revisa la desviación real y administra cargos
          recurrentes para que el mes no te sorprenda.
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Nuevo presupuesto</h2>
            <p className="text-sm text-foreground/58">Comparativo category-by-category.</p>
          </div>
          <BudgetForm month={month} categories={categories} />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Resumen de variaciones</h2>
              <p className="text-sm text-foreground/58">{budgets.length} categorías con meta.</p>
            </div>
          </div>
          <div className="space-y-3">
            {dashboard.budgetComparisons.length ? (
              dashboard.budgetComparisons.map((item) => (
                <div key={item.budgetId} className="rounded-[1.4rem] border border-border bg-white/65 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{item.categoryName}</p>
                      <p className="text-sm text-foreground/58">
                        Planeado {formatCurrency(item.planned)} · Real {formatCurrency(item.actual)}
                      </p>
                    </div>
                    <StatusPill tone={item.variance >= 0 ? "success" : "danger"}>
                      {item.variance >= 0 ? "Debajo del plan" : "Sobre el plan"}
                    </StatusPill>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className={`h-full rounded-full ${item.variance < 0 ? "bg-danger" : "bg-brand"}`}
                      style={{
                        width: `${Math.min((item.actual / Math.max(item.planned, 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  {item.variance < 0 ? (
                    <p className="mt-1 text-xs text-danger">
                      {((item.actual / Math.max(item.planned, 1)) * 100).toFixed(0)}% del presupuesto usado
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-white/45 p-5 text-sm text-foreground/60">
                Todavía no hay presupuestos configurados para este mes.
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Nueva recurrencia</h2>
            <p className="text-sm text-foreground/58">Se genera una vez por mes y deja huella auditada.</p>
          </div>
          <RecurringForm categories={categories} defaultStartDate={format(new Date(), "yyyy-MM-dd")} />
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Calendario recurrente</h2>
            <p className="text-sm text-foreground/58">{recurring.length} cargos o ingresos fijos activos.</p>
          </div>
          <div className="space-y-3">
            {recurring.length ? (
              recurring.map((item) => (
                <div key={item.id} className="rounded-[1.4rem] border border-border bg-white/65 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-foreground/58">
                        {item.payee} · {item.category?.name ?? "Sin categoría"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{formatCurrency(item.amount)}</p>
                      <p className="text-xs text-foreground/45">Día {item.day_of_month}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-white/45 p-5 text-sm text-foreground/60">
                No tienes reglas recurrentes todavía.
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
