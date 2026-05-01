import Link from "next/link";
import {
  BellRing,
  ChartColumnBig,
  FolderTree,
  NotebookTabs,
  ReceiptText,
  Repeat,
  ShieldCheck,
} from "lucide-react";
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
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:min-h-screen lg:flex-row lg:gap-6 lg:px-6">
        <aside className="glass-panel rounded-[2rem] p-4 sm:p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-[300px] lg:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.34em] text-foreground/42 sm:text-sm sm:tracking-[0.3em]">
                Quincenazo
              </p>
              <h1 className="display-copy mt-2 max-w-[12ch] text-2xl leading-none text-foreground sm:text-3xl lg:text-[2.85rem]">
                La quincena, clara.
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <div className="rounded-full bg-brand/10 p-3 text-brand">
                <Repeat className="h-5 w-5" />
              </div>
            </div>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-white/58 px-3 py-2 text-sm font-semibold text-foreground/72 transition hover:bg-white/82 hover:text-foreground lg:rounded-2xl lg:border-transparent lg:bg-transparent lg:px-4 lg:py-3"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 rounded-[1.4rem] border border-border bg-white/72 p-4 lg:mt-8 lg:rounded-[1.6rem]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch">
              <div className="min-w-0">
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-foreground/45">Sesión</p>
                <p className="mt-2 truncate text-sm font-medium text-foreground">
                  {userEmail ?? "Cuenta activa"}
                </p>
              </div>
              <form action={signOutAction} className="sm:w-auto lg:mt-4">
                <Button type="submit" variant="secondary" className="w-full sm:px-5 lg:w-full">
                  Cerrar sesión
                </Button>
              </form>
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
