import Link from "next/link";
import { BellRing, ChartColumnBig, FolderTree, NotebookTabs, ReceiptText, Repeat, ShieldCheck } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navigation = [
  { href: "/panel", label: "Panel", icon: ChartColumnBig },
  { href: "/movimientos", label: "Movimientos", icon: ReceiptText },
  { href: "/presupuestos", label: "Presupuestos", icon: BellRing },
  { href: "/categorias", label: "Categorías", icon: FolderTree },
  { href: "/reportes", label: "Reportes", icon: NotebookTabs },
  { href: "/auditoria", label: "Auditoría", icon: ShieldCheck },
];

export function AppShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string | null;
}) {
  return (
    <div className="page-shell min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="glass-panel rounded-[2rem] p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-[300px]">
          <div className="mb-8 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-foreground/45">Quincenazo</p>
              <h1 className="display-copy mt-2 text-3xl text-foreground">La quincena, clara.</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="rounded-full bg-brand/10 p-3 text-brand">
                <Repeat className="h-5 w-5" />
              </div>
            </div>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground/72 transition hover:bg-white/70 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 rounded-[1.6rem] border border-border bg-white/65 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">Sesión</p>
            <p className="mt-2 text-sm font-medium text-foreground">{userEmail ?? "Cuenta activa"}</p>
            <form action={signOutAction} className="mt-4">
              <Button type="submit" variant="secondary" className="w-full">
                Cerrar sesión
              </Button>
            </form>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
