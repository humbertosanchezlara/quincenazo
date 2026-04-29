import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { formatCurrency, formatMonthLabel } from "@/lib/format";
import { getDashboardData, getReports } from "@/lib/queries";

export default async function ReportesPage() {
  const [reports, currentDashboard] = await Promise.all([
    getReports(),
    getDashboardData(),
  ]);

  return (
    <div className="space-y-6">
      <header className="glass-panel rounded-[2rem] p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Análisis</p>
        <h1 className="display-copy mt-3 text-4xl text-foreground md:text-5xl">
          Reportes mensuales y varianza.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/68">
          Tendencia de ingreso, gasto y neto, con lectura de cuáles categorías están empujando la
          desviación del mes actual.
        </p>
      </header>
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Histórico de 6 meses</h2>
            <p className="text-sm text-foreground/58">Navegación mensual lista para comparar evolución.</p>
          </div>
          <div className="space-y-3">
            {reports.map((item) => (
              <div key={item.month} className="rounded-[1.4rem] border border-border bg-white/65 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-foreground">{formatMonthLabel(item.month)}</p>
                      {item.current ? <StatusPill>Mes activo</StatusPill> : null}
                    </div>
                    <p className="mt-2 text-sm text-foreground/58">
                      Ingreso {formatCurrency(item.income)} · Gasto {formatCurrency(item.expenses)}
                    </p>
                  </div>
                  <p className={`text-lg font-semibold ${item.net >= 0 ? "text-success" : "text-danger"}`}>
                    {formatCurrency(item.net)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Top contribuyentes a variación</h2>
            <p className="text-sm text-foreground/58">Dónde se está moviendo el presupuesto real.</p>
          </div>
          <div className="space-y-3">
            {currentDashboard.budgetComparisons.length ? (
              currentDashboard.budgetComparisons
                .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
                .slice(0, 6)
                .map((item) => (
                  <div key={item.budgetId} className="rounded-[1.4rem] border border-border bg-white/65 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{item.categoryName}</p>
                      <StatusPill tone={item.variance >= 0 ? "success" : "danger"}>
                        {item.variance >= 0 ? "+" : "-"}
                        {formatCurrency(Math.abs(item.variance))}
                      </StatusPill>
                    </div>
                    <p className="mt-2 text-sm text-foreground/58">
                      Planeado {formatCurrency(item.planned)} · Ejecutado {formatCurrency(item.actual)}
                    </p>
                  </div>
                ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-white/45 p-5 text-sm text-foreground/60">
                Crea presupuestos para ver el análisis de varianza.
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
