import "server-only";

import { cache } from "react";
import { parseISO } from "date-fns";
import { getCurrentMonthValue, getMonthBounds } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AuditWithPayload,
  BudgetWithCategory,
  Category,
  RecurringWithRelations,
  TransactionWithRelations,
} from "@/lib/types";

export type AuthState =
  | { configured: false; reason: string }
  | {
      configured: true;
      user: { id: string; email: string | null } | null;
    };

export const getAuthState = cache(async (): Promise<AuthState> => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      configured: false,
      reason:
        "Configura Supabase para activar el acceso, la persistencia y los datos reales.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    configured: true,
    user: user ? { id: user.id, email: user.email ?? null } : null,
  };
});

export async function ensureProfile() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email ?? null,
    full_name:
      typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : null,
  });

  return user;
}

export async function getCurrentUserOrThrow() {
  const auth = await getAuthState();

  if (!auth.configured) {
    throw new Error(auth.reason);
  }

  if (!auth.user) {
    throw new Error("No hay una sesión activa.");
  }

  return auth.user;
}

export async function maybeSyncRecurringTransactions(month: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const [year, monthNumber] = month.split("-").map(Number);

  const { data: recurringItems } = await supabase
    .from("recurring_transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!recurringItems?.length) return;

  for (const item of recurringItems) {
    const startDate = parseISO(item.start_date);
    const endDate = item.end_date ? parseISO(item.end_date) : null;
    const targetDate = new Date(year, monthNumber - 1, item.day_of_month);

    if (startDate > targetDate) continue;
    if (endDate && endDate < targetDate) continue;

    const recurringInstanceKey = `${item.id}-${month}`;

    const { data: existing } = await supabase
      .from("transactions")
      .select("id")
      .eq("user_id", user.id)
      .eq("recurring_instance_key", recurringInstanceKey)
      .maybeSingle();

    if (existing) continue;

    const safeDay = Math.min(item.day_of_month, new Date(year, monthNumber, 0).getDate());
    const occurredOn = new Date(year, monthNumber - 1, safeDay)
      .toISOString()
      .slice(0, 10);

    await supabase.from("transactions").insert({
      user_id: user.id,
      amount: item.amount,
      occurred_on: occurredOn,
      transaction_type: item.transaction_type,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      payee: item.payee,
      notes: item.notes,
      recurring_transaction_id: item.id,
      recurring_instance_key: recurringInstanceKey,
      is_recurring_generated: true,
    });
  }
}

export async function getCategories() {
  const user = await getCurrentUserOrThrow();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .eq("user_id", user.id)
    .order("transaction_type", { ascending: false })
    .order("name");

  return (data ?? []) as (Category & { subcategories: { id: string; name: string }[] })[];
}

export async function getTransactionsByMonth(
  month = getCurrentMonthValue(),
) {
  await maybeSyncRecurringTransactions(month);
  const user = await getCurrentUserOrThrow();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { start, end } = getMonthBounds(month);
  const { data } = await supabase
    .from("transactions")
    .select(
      "*, category:categories(id,name,color), subcategory:subcategories(id,name)",
    )
    .eq("user_id", user.id)
    .gte("occurred_on", start)
    .lte("occurred_on", end)
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false });

  return (data ?? []) as TransactionWithRelations[];
}

export async function getBudgetsByMonth(month = getCurrentMonthValue()) {
  const user = await getCurrentUserOrThrow();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("budgets")
    .select("*, category:categories(id,name,color)")
    .eq("user_id", user.id)
    .eq("month", `${month}-01`)
    .order("created_at");

  return (data ?? []) as BudgetWithCategory[];
}

export async function getRecurringTransactions() {
  const user = await getCurrentUserOrThrow();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("recurring_transactions")
    .select(
      "*, category:categories(id,name,color), subcategory:subcategories(id,name)",
    )
    .eq("user_id", user.id)
    .order("day_of_month")
    .order("name");

  return (data ?? []) as RecurringWithRelations[];
}

export async function getAuditLog(limit = 40) {
  const user = await getCurrentUserOrThrow();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("audit_log")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as AuditWithPayload[];
}

export async function getReports() {
  const currentMonth = getCurrentMonthValue();
  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - index);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });

  const series = [];
  for (const month of months.reverse()) {
    const transactions = await getTransactionsByMonth(month);
    const income = transactions
      .filter((item) => item.transaction_type === "income")
      .reduce((total, item) => total + Number(item.amount), 0);
    const expenses = transactions
      .filter((item) => item.transaction_type === "expense")
      .reduce((total, item) => total + Number(item.amount), 0);

    series.push({
      month,
      income,
      expenses,
      net: income - expenses,
      current: month === currentMonth,
    });
  }

  return series;
}

export async function getDashboardData(month = getCurrentMonthValue()) {
  const [transactions, budgets, categories, recurring, auditLog] =
    await Promise.all([
      getTransactionsByMonth(month),
      getBudgetsByMonth(month),
      getCategories(),
      getRecurringTransactions(),
      getAuditLog(8),
    ]);

  const income = transactions
    .filter((item) => item.transaction_type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);
  const expenses = transactions
    .filter((item) => item.transaction_type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const actualByCategory = new Map<string, number>();
  transactions
    .filter((item) => item.transaction_type === "expense" && item.category)
    .forEach((transaction) => {
      actualByCategory.set(
        transaction.category!.id,
        (actualByCategory.get(transaction.category!.id) ?? 0) +
          Number(transaction.amount),
      );
    });

  const budgetComparisons = budgets.map((budget) => {
    const actual = actualByCategory.get(budget.category_id) ?? 0;
    return {
      budgetId: budget.id,
      categoryId: budget.category_id,
      categoryName: budget.category?.name ?? "Sin categoría",
      categoryColor: budget.category?.color ?? "#1f6a52",
      planned: Number(budget.planned_amount),
      actual,
      variance: Number(budget.planned_amount) - actual,
    };
  });

  const uncappedCategoryBreakdown = Array.from(actualByCategory.entries())
    .map(([categoryId, actual]) => {
      const category = categories.find((item) => item.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name ?? "Sin categoría",
        color: category?.color ?? "#1f6a52",
        actual,
      };
    })
    .sort((a, b) => b.actual - a.actual);

  return {
    month,
    transactions,
    budgets,
    recurring,
    auditLog,
    summary: {
      income,
      expenses,
      net: income - expenses,
      savingsRate: income > 0 ? Math.max(0, ((income - expenses) / income) * 100) : 0,
    },
    categoryBreakdown: uncappedCategoryBreakdown,
    budgetComparisons,
    alerts: budgetComparisons
      .filter((item) => item.variance < 0)
      .sort((a, b) => a.variance - b.variance)
      .slice(0, 4),
  };
}
