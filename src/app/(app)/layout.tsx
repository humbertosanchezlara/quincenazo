import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SetupEmptyState } from "@/components/dashboard/setup-empty-state";
import { ensureProfile, getAuthState } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthState();

  if (!auth.configured) {
    return <SetupEmptyState />;
  }

  if (!auth.user) {
    redirect("/");
  }

  await ensureProfile();

  return <AppShell userEmail={auth.user.email}>{children}</AppShell>;
}
