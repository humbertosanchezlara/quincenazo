import Link from "next/link";
import { Card } from "@/components/ui/card";

export function SetupEmptyState() {
  return (
    <div className="page-shell min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">
            Configuración pendiente
          </p>
          <h1 className="display-copy text-4xl text-foreground">Conecta Supabase para encender Quincenazo.</h1>
          <p className="max-w-2xl text-base leading-8 text-foreground/70">
            El proyecto ya viene listo para auth, dashboards, categorías, presupuestos,
            movimientos recurrentes y auditoría. Solo falta agregar las variables de entorno.
          </p>
          <div className="rounded-[1.5rem] border border-border bg-surface-muted p-5">
            <p className="font-semibold text-foreground">Variables necesarias</p>
            <pre className="mt-4 overflow-x-auto text-sm text-foreground/75">
{`NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000`}
            </pre>
          </div>
          <Link
            href="https://supabase.com/docs/guides/auth/server-side/nextjs"
            target="_blank"
            className="inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Ver guía de integración
          </Link>
        </Card>
      </div>
    </div>
  );
}
