import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import { SignInForm } from "@/components/forms/sign-in-form";
import { Card } from "@/components/ui/card";
import { getAuthState } from "@/lib/queries";
import { redirect } from "next/navigation";

const highlights = [
  {
    icon: LayoutDashboard,
    title: "Panel mensual premium",
    copy: "Compara presupuesto vs real, detecta variaciones y mantén tu mes bajo control.",
  },
  {
    icon: Zap,
    title: "Captura sin fricción",
    copy: "Registra ingresos y gastos en segundos desde móvil o escritorio.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Insights claros",
    copy: "Top categorías, alertas de sobre gasto, tendencias y ahorros netos.",
  },
  {
    icon: ShieldCheck,
    title: "Supabase Auth + RLS",
    copy: "Tus datos viven en Postgres con aislamiento por usuario y bitácora de cambios.",
  },
];

export default async function HomePage() {
  const auth = await getAuthState();

  if (auth.configured && auth.user) {
    redirect("/panel");
  }

  return (
    <div className="page-shell min-h-screen px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1450px] gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="glass-panel relative overflow-hidden rounded-[2.25rem] p-8 md:p-12">
          <div className="absolute right-10 top-10 hidden h-28 w-28 rounded-full bg-accent/25 blur-3xl md:block" />
          <p className="text-sm uppercase tracking-[0.34em] text-foreground/45">
            Finanzas personales en español mexicano
          </p>
          <h1 className="display-copy mt-6 max-w-3xl text-5xl leading-[1.02] text-foreground md:text-7xl">
            Quincenazo te ayuda a estirar la quincena con claridad, ritmo y contexto.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/72 md:text-lg">
            Una experiencia inspirada en Rocket Money, Mint y Monarch: visual, sobria y
            realmente útil para aterrizar gastos, presupuesto y decisiones del mes.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {highlights.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-[1.7rem] border border-border bg-white/60 p-5">
                <div className="mb-4 inline-flex rounded-full bg-brand/10 p-3 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-foreground/68">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-foreground/55">
            <span>Ingresos y gastos manuales</span>
            <span>Presupuesto mensual por categoría</span>
            <span>Recurrencias y alertas</span>
            <span>Historial auditable</span>
          </div>
        </section>

        <div className="grid gap-6">
          <Card className="p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Entrar</p>
            <h2 className="display-copy mt-3 text-4xl text-foreground">Accede con link mágico.</h2>
            <p className="mt-3 text-sm leading-7 text-foreground/68">
              Usa Supabase Auth para iniciar sesión sin contraseña y empezar a capturar
              tus movimientos reales desde el primer minuto.
            </p>
            <div className="mt-6">
              <SignInForm />
            </div>
          </Card>
          <Card className="p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Qué incluye</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-[1.5rem] bg-white/70 px-4 py-4">
                <span className="font-medium">Comparativo presupuesto vs real</span>
                <ArrowRight className="h-4 w-4 text-brand" />
              </div>
              <div className="flex items-center justify-between rounded-[1.5rem] bg-white/70 px-4 py-4">
                <span className="font-medium">Sugerencias inteligentes por historial</span>
                <ArrowRight className="h-4 w-4 text-brand" />
              </div>
              <div className="flex items-center justify-between rounded-[1.5rem] bg-white/70 px-4 py-4">
                <span className="font-medium">Movimientos recurrentes y alertas</span>
                <ArrowRight className="h-4 w-4 text-brand" />
              </div>
            </div>
            {!auth.configured ? (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-brand/35 bg-brand/6 p-4 text-sm text-foreground/68">
                Falta configurar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
                para activar la sesión y la persistencia.
              </div>
            ) : null}
            <div className="mt-6">
              <Link href="/panel" className="text-sm font-semibold text-brand">
                Ir directo al panel si ya tienes sesión
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
