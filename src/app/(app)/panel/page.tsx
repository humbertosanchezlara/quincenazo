import { format } from "date-fns";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { MonthPicker } from "@/components/dashboard/month-picker";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { TransactionForm } from "@/components/forms/transaction-form";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import {
  formatCurrency,
  formatLongDate,
  formatMonthLabel,
  formatShortDate,
  sanitizeMonth,
} from "@/lib/format";
import { getCategories, getDashboardData } from "@/lib/queries";
import type { TransactionWithRelations } from "@/lib/types";

function groupTransactionsByDay(transactions: TransactionWithRelations[]) {
  const grouped = new Map<string, TransactionWithRelations[]>();

  transactions.forEach((transaction) => {
    const current = grouped.get(transaction.occurred_on) ?? [];
    current.push(transaction);
    grouped.set(transaction.occurred_on, current);
  });

  return Array.from(grouped.entries()).map(([date, items]) => ({
    date,
    items,
    total: items.reduce((sum, item) => sum + Number(item.amount), 0),
  }));
}

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = sanitizeMonth(params.month);
  const [dashboard, categories] = await Promise.all([
    getDashboardData(month),
    getCategories(),
  ]);
  const groupedTransactions = groupTransactionsByDay(dashboard.transactions);

  const summaryCards = [
    {
      label: "Ingresos",
      value: dashboard.summary.income,
      prev: dashboard.summary.prevIncome,
      icon: TrendingUp,
      tone: "success" as const,
    },
    {
      label: "Gastos",
      value: dashboard.summary.expenses,
      prev: dashboard.summary.prevExpenses,
      icon: TrendingDown,
      tone: "danger" as const,
    },
    {
      label: "Neto",
      value: dashboard.summary.net,
      prev: dashboard.summary.prevNet,
      icon: Wallet,
      tone: dashboard.summary.net >= 0 ? ("success" as const) : ("danger" as const),
    },
    {
      label: "Ahorro",
      value: dashboard.summary.savingsRate,
      prev: null,
      suffix: "%",
      icon: Wallet,
      tone: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-4 py-1 md:space-y-6">
      <section className="space-y-4 md:hidden">
        <Card className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.3em] text-foreground/45">
                Panel mensual
              </p>
              <h1 className="display-copy mt-2 text-3xl leading-none text-foreground">
                {formatMonthLabel(month)}
              </h1>
              <p className="mt-3 text-sm leading-6 text-foreground/65">
                Resumen claro del mes y actividad reciente en un solo vistazo.
              </p>
            </div>
            <MonthPicker month={month} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {summaryCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-[1.4rem] border border-border bg-white/68 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
                        {item.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold leading-tight text-foreground">
                        {item.suffix
                          ? `${item.value.toFixed(0)}${item.suffix}`
                          : formatCurrency(item.value)}
                      </p>
                    </div>
                    <div className="rounded-full bg-white/80 p-2.5 text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <StatusPill tone={item.tone}>
                      {item.label === "Ahorro" ? "Ritmo del mes" : "Corte actual"}
                    </StatusPill>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Actividad reciente</h2>
              <p className="text-sm text-foreground/58">
                {dashboard.transactions.length} movimientos en {formatMonthLabel(month)}.
              </p>
            </div>
            <StatusPill tone={dashboard.alerts.length ? "warning" : "success"}>
              {dashboard.alerts.length ? `${dashboard.alerts.length} alertas` : "En rango"}
            </StatusPill>
          </div>

          <div className="space-y-5">
            {groupedTransactions.length ? (
              groupedTransactions.map((group) => (
                <div key={group.date} className="space-y-3">
                  <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {formatShortDate(group.date)}
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/42">
                        {group.items.length} movimientos
                      </p>
                    </div>
                    <p className="text-base font-semibold text-foreground">
                      {formatCurrency(group.total)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="rounded-[1.2rem] border border-border bg-white/62 px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">
                              {transaction.payee}
                            </p>
                            <p className="mt-1 text-sm text-foreground/58">
                              {transaction.category?.name ?? "Sin categoría"}
                              {transaction.subcategory
                                ? ` · ${transaction.subcategory.name}`
                                : ""}
                            </p>
                          </div>
                          <p
                            className={`shrink-0 text-base font-semibold ${
                              transaction.transaction_type === "income"
                                ? "text-success"
                                : "text-foreground"
                            }`}
                          >
                            {transaction.transaction_type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-white/45 p-5 text-sm text-foreground/60">
                No hay movimientos cargados para este mes todavía.
              </div>
            )}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Alta rápida</h2>
            <p className="text-sm text-foreground/58">
              Captura un ingreso o gasto sin salir del panel.
            </p>
          </div>
          <TransactionForm
            month={month}
            categories={categories}
            defaultDate={format(new Date(), "yyyy-MM-dd")}
          />
        </Card>
      </section>

      <div className="hidden space-y-6 md:block">
        <header className="glass-panel rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Panel mensual</p>
              <h1 className="display-copy mt-3 text-4xl text-foreground md:text-5xl">
                {formatMonthLabel(month)}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/68 md:text-base">
                Vista premium para seguir tu quincena: saldo neto, categorías dominantes,
                desviaciones y recurrencias que ya impactaron este mes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <MonthPicker month={month} />
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;
            const pctChange =
              item.prev != null && item.prev !== 0
                ? ((item.value - item.prev) / Math.abs(item.prev)) * 100
                : null;

            return (
              <Card key={item.label} className="rounded-[1.8rem] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/55">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">
                      {item.suffix
                        ? `${item.value.toFixed(0)}${item.suffix}`
                        : formatCurrency(item.value)}
                    </p>
                  </div>
                  <div className="rounded-full bg-white/70 p-3 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <StatusPill tone={item.tone}>
                    {item.label === "Ahorro" ? "Meta saludable" : "Actualizado al momento"}
                  </StatusPill>
                  {pctChange !== null && (
                    <span
                      className={`text-xs font-semibold ${pctChange >= 0 ? "text-success" : "text-danger"}`}
                    >
                      {pctChange >= 0 ? "↑" : "↓"} {Math.abs(pctChange).toFixed(0)}% vs mes
                      anterior
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Lectura del mes</h2>
                <p className="text-sm text-foreground/58">
                  Presupuesto contra gasto real y mix de categorías.
                </p>
              </div>
            </div>
            <OverviewChart
              budgetComparisons={dashboard.budgetComparisons}
              categoryBreakdown={dashboard.categoryBreakdown}
            />
          </Card>

          <Card className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Alta rápida</h2>
              <p className="text-sm text-foreground/58">
                Flujo pensado para capturar en segundos sin salir del panel.
              </p>
            </div>
            <TransactionForm
              month={month}
              categories={categories}
              defaultDate={format(new Date(), "yyyy-MM-dd")}
            />
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Alertas de sobre gasto</h2>
                <p className="text-sm text-foreground/58">Top variaciones negativas del mes.</p>
              </div>
              <StatusPill tone={dashboard.alerts.length ? "warning" : "success"}>
                {dashboard.alerts.length ? `${dashboard.alerts.length} alertas` : "Todo en rango"}
              </StatusPill>
            </div>
            <div className="space-y-3">
              {dashboard.alerts.length ? (
                dashboard.alerts.map((alert) => (
                  <div
                    key={alert.budgetId}
                    className="rounded-[1.4rem] border border-border bg-white/65 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{alert.categoryName}</p>
                      <StatusPill tone="danger">
                        {formatCurrency(Math.abs(alert.variance))} arriba
                      </StatusPill>
                    </div>
                    <p className="mt-2 text-sm text-foreground/65">
                      Planeado {formatCurrency(alert.planned)} · Real {formatCurrency(alert.actual)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-border bg-white/45 p-5 text-sm text-foreground/60">
                  No hay sobre gasto este mes. Vas bien.
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Actividad reciente</h2>
                <p className="text-sm text-foreground/58">
                  Últimos movimientos y cambios auditables.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {dashboard.auditLog.length ? (
                dashboard.auditLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[1.4rem] border border-border bg-white/65 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">
                        {entry.action.replaceAll("_", " ")} · {entry.entity_type}
                      </p>
                      <span className="text-xs text-foreground/45">
                        {formatLongDate(entry.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground/62">{entry.entity_id}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-border bg-white/45 p-5 text-sm text-foreground/60">
                  Todavía no hay bitácora. Registra tu primer movimiento para empezar a ver
                  trazabilidad.
                </div>
              )}
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Movimientos del mes</h2>
              <p className="text-sm text-foreground/58">
                {dashboard.transactions.length} registros en {formatMonthLabel(month)}.
              </p>
            </div>
            <div className="space-y-3">
              {dashboard.transactions.slice(0, 8).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-[1.4rem] border border-border bg-white/65 p-4"
                >
                  <div>
                    <p className="font-semibold text-foreground">{transaction.payee}</p>
                    <p className="text-sm text-foreground/58">
                      {transaction.category?.name ?? "Sin categoría"}
                      {transaction.subcategory ? ` · ${transaction.subcategory.name}` : ""}
                      {" · "}
                      {formatLongDate(transaction.occurred_on)}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-semibold ${
                      transaction.transaction_type === "income"
                        ? "text-success"
                        : "text-foreground"
                    }`}
                  >
                    {transaction.transaction_type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recurrencias activas</h2>
              <p className="text-sm text-foreground/58">
                Se materializan una vez por mes sin duplicarse.
              </p>
            </div>
            <div className="space-y-3">
              {dashboard.recurring.length ? (
                dashboard.recurring.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.4rem] border border-border bg-white/65 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <StatusPill>{`Día ${item.day_of_month}`}</StatusPill>
                    </div>
                    <p className="mt-2 text-sm text-foreground/58">
                      {item.category?.name ?? "Sin categoría"} · {item.payee}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-border bg-white/45 p-5 text-sm text-foreground/60">
                  No hay reglas recurrentes todavía.
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
