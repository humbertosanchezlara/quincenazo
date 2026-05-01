import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuditLog } from "@/lib/queries";
import { formatLongDate } from "@/lib/format";

const PAGE_SIZE = 20;

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const entries = await getAuditLog(PAGE_SIZE, (page - 1) * PAGE_SIZE);
  const hasMore = entries.length === PAGE_SIZE;

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="glass-panel rounded-[1.7rem] p-4 sm:rounded-[2rem] sm:p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Trazabilidad</p>
        <h1 className="display-copy mt-3 text-3xl text-foreground md:text-5xl">
          Auditoría de cambios.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/68 md:leading-7">
          Historial cronológico para revisar altas, ajustes y eliminaciones sobre la capa financiera.
        </p>
      </header>
      <Card>
        <div className="space-y-3">
          {entries.length ? (
            entries.map((entry) => (
              <div key={entry.id} className="rounded-[1.4rem] border border-border bg-white/65 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {entry.entity_type} · {entry.action.replaceAll("_", " ")}
                    </p>
                    <p className="mt-2 text-sm text-foreground/58">{entry.entity_id}</p>
                  </div>
                  <p className="text-sm text-foreground/45">{formatLongDate(entry.created_at)}</p>
                </div>
                {entry.payload ? (
                  <pre className="mt-3 overflow-x-auto rounded-[1rem] bg-[#f4efe6] p-3 text-xs text-foreground/70">
                    {JSON.stringify(entry.payload, null, 2)}
                  </pre>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-border bg-white/45 p-5 text-sm text-foreground/60">
              {page > 1 ? "No hay más entradas en esta página." : "Aún no hay eventos auditables."}
            </div>
          )}
          {(page > 1 || hasMore) ? (
            <div className="flex items-center justify-between pt-2">
              {page > 1 ? (
                <a href={`/auditoria?page=${page - 1}`}>
                  <Button variant="ghost">← Anterior</Button>
                </a>
              ) : <span />}
              <span className="text-sm text-foreground/45">Página {page}</span>
              {hasMore ? (
                <a href={`/auditoria?page=${page + 1}`}>
                  <Button variant="ghost">Siguiente →</Button>
                </a>
              ) : <span />}
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
