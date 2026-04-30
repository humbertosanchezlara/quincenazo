"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentMonthValue } from "@/lib/format";
import { getCurrentUserOrThrow } from "@/lib/queries";

type ActionState = {
  ok: boolean;
  message: string;
};

const success = (message: string): ActionState => ({ ok: true, message });
const failure = (message: string): ActionState => ({ ok: false, message });

function getAuthRedirectUrl() {
  return `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`;
}

async function logAudit(entityType: string, entityId: string, action: string, payload?: unknown) {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUserOrThrow();
  if (!supabase) return;

  await supabase.from("audit_log").insert({
    user_id: user.id,
    entity_type: entityType,
    entity_id: entityId,
    action,
    payload: (payload ?? null) as never,
  });
}

export async function signInAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      email: z.string().email("Escribe un correo válido."),
      password: z.string().min(8, "Tu contraseña debe tener al menos 8 caracteres."),
    })
    .safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Credenciales inválidas.");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return failure("Configura Supabase antes de iniciar sesión.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return failure(error.message);
  }

  redirect("/panel");
}

export async function signUpAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      email: z.string().email("Escribe un correo válido."),
      password: z.string().min(8, "Tu contraseña debe tener al menos 8 caracteres."),
      fullName: z.string().min(2, "Escribe tu nombre.").optional().or(z.literal("")),
    })
    .safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      fullName: formData.get("full_name"),
    });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Revisa tus datos.");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return failure("Configura Supabase antes de crear tu cuenta.");
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
      data: {
        full_name: parsed.data.fullName || null,
      },
    },
  });

  if (error) {
    return failure(error.message);
  }

  return success(
    "Cuenta creada. Revisa tu correo para confirmar el acceso si Supabase tiene confirmación de email activa.",
  );
}

export async function signInWithGoogleAction() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/?error=config");
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthRedirectUrl(),
    },
  });

  if (error || !data.url) {
    redirect("/?error=google-auth");
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}

const transactionSchema = z.object({
  id: z.string().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.coerce.number().positive("Captura un monto mayor a 0."),
  occurredOn: z.string().min(1, "Selecciona una fecha."),
  transactionType: z.enum(["income", "expense"]),
  categoryId: z.string().nullable().optional(),
  subcategoryId: z.string().nullable().optional(),
  payee: z.string().min(2, "Agrega un comercio o descripción."),
  notes: z.string().optional(),
});

export async function upsertTransactionAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = transactionSchema.safeParse({
    id: String(formData.get("id") || ""),
    month: String(formData.get("month") || getCurrentMonthValue()),
    amount: formData.get("amount"),
    occurredOn: formData.get("occurred_on"),
    transactionType: formData.get("transaction_type"),
    categoryId: formData.get("category_id") ? String(formData.get("category_id")) : null,
    subcategoryId: formData.get("subcategory_id")
      ? String(formData.get("subcategory_id"))
      : null,
    payee: formData.get("payee"),
    notes: String(formData.get("notes") || ""),
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Revisa los datos del movimiento.");
  }

  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUserOrThrow();
  if (!supabase) return failure("Supabase no está configurado.");

  const payload = {
    user_id: user.id,
    amount: parsed.data.amount,
    occurred_on: parsed.data.occurredOn,
    transaction_type: parsed.data.transactionType,
    category_id: parsed.data.categoryId || null,
    subcategory_id: parsed.data.subcategoryId || null,
    payee: parsed.data.payee,
    notes: parsed.data.notes || null,
  };

  const response = parsed.data.id
    ? await supabase
        .from("transactions")
        .update(payload)
        .eq("id", parsed.data.id)
        .eq("user_id", user.id)
        .select("id")
        .single()
    : await supabase.from("transactions").insert(payload).select("id").single();

  if (response.error || !response.data) {
    return failure(response.error?.message ?? "No se pudo guardar el movimiento.");
  }

  await logAudit(
    "transaction",
    response.data.id,
    parsed.data.id ? "updated" : "created",
    payload,
  );
  revalidatePath("/panel");
  revalidatePath("/movimientos");
  revalidatePath("/presupuestos");
  revalidatePath("/reportes");

  return success(parsed.data.id ? "Movimiento actualizado." : "Movimiento guardado.");
}

export async function deleteTransactionAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUserOrThrow();
  if (!supabase || !id) return;

  await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
  await logAudit("transaction", id, "deleted");
  revalidatePath("/panel");
  revalidatePath("/movimientos");
  revalidatePath("/reportes");
}

const budgetSchema = z.object({
  id: z.string().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  categoryId: z.string().min(1, "Selecciona una categoría."),
  plannedAmount: z.coerce.number().positive("Agrega un monto planeado válido."),
  notes: z.string().optional(),
});

export async function upsertBudgetAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = budgetSchema.safeParse({
    id: String(formData.get("id") || ""),
    month: String(formData.get("month") || getCurrentMonthValue()),
    categoryId: formData.get("category_id"),
    plannedAmount: formData.get("planned_amount"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Revisa tu presupuesto.");
  }

  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUserOrThrow();
  if (!supabase) return failure("Supabase no está configurado.");

  const payload = {
    user_id: user.id,
    category_id: parsed.data.categoryId,
    month: `${parsed.data.month}-01`,
    planned_amount: parsed.data.plannedAmount,
    notes: parsed.data.notes || null,
  };

  const response = await supabase
    .from("budgets")
    .upsert(payload, {
      onConflict: "user_id,category_id,month",
    })
    .select("id")
    .single();

  if (response.error || !response.data) {
    return failure(response.error?.message ?? "No se pudo guardar el presupuesto.");
  }

  await logAudit("budget", response.data.id, "upserted", payload);
  revalidatePath("/panel");
  revalidatePath("/presupuestos");
  return success("Presupuesto guardado.");
}

const categorySchema = z.object({
  name: z.string().min(2, "Ponle nombre a la categoría."),
  transactionType: z.enum(["income", "expense"]),
  color: z.string().min(4),
  icon: z.string().optional(),
});

export async function createCategoryAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    transactionType: formData.get("transaction_type"),
    color: formData.get("color"),
    icon: formData.get("icon"),
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Revisa tu categoría.");
  }

  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUserOrThrow();
  if (!supabase) return failure("Supabase no está configurado.");

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      transaction_type: parsed.data.transactionType,
      color: parsed.data.color,
      icon: parsed.data.icon || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return failure(error?.message ?? "No se pudo crear la categoría.");
  }

  await logAudit("category", data.id, "created", parsed.data);
  revalidatePath("/categorias");
  revalidatePath("/movimientos");
  return success("Categoría creada.");
}

const subcategorySchema = z.object({
  categoryId: z.string().min(1, "Selecciona una categoría."),
  name: z.string().min(2, "Agrega un nombre a la subcategoría."),
});

export async function createSubcategoryAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = subcategorySchema.safeParse({
    categoryId: formData.get("category_id"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Revisa la subcategoría.");
  }

  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUserOrThrow();
  if (!supabase) return failure("Supabase no está configurado.");

  const { data, error } = await supabase
    .from("subcategories")
    .insert({
      user_id: user.id,
      category_id: parsed.data.categoryId,
      name: parsed.data.name,
    })
    .select("id")
    .single();

  if (error || !data) {
    return failure(error?.message ?? "No se pudo crear la subcategoría.");
  }

  await logAudit("subcategory", data.id, "created", parsed.data);
  revalidatePath("/categorias");
  revalidatePath("/movimientos");
  return success("Subcategoría creada.");
}

const recurringSchema = z.object({
  name: z.string().min(2),
  amount: z.coerce.number().positive(),
  transactionType: z.enum(["income", "expense"]),
  categoryId: z.string().nullable().optional(),
  subcategoryId: z.string().nullable().optional(),
  payee: z.string().min(2),
  notes: z.string().optional(),
  dayOfMonth: z.coerce.number().min(1).max(28),
  startDate: z.string().min(1),
});

export async function upsertRecurringAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = recurringSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    transactionType: formData.get("transaction_type"),
    categoryId: formData.get("category_id") ? String(formData.get("category_id")) : null,
    subcategoryId: formData.get("subcategory_id")
      ? String(formData.get("subcategory_id"))
      : null,
    payee: formData.get("payee"),
    notes: formData.get("notes"),
    dayOfMonth: formData.get("day_of_month"),
    startDate: formData.get("start_date"),
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Revisa el movimiento recurrente.");
  }

  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUserOrThrow();
  if (!supabase) return failure("Supabase no está configurado.");

  const { data, error } = await supabase
    .from("recurring_transactions")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      amount: parsed.data.amount,
      transaction_type: parsed.data.transactionType,
      category_id: parsed.data.categoryId || null,
      subcategory_id: parsed.data.subcategoryId || null,
      payee: parsed.data.payee,
      notes: parsed.data.notes || null,
      day_of_month: parsed.data.dayOfMonth,
      start_date: parsed.data.startDate,
    })
    .select("id")
    .single();

  if (error || !data) {
    return failure(error?.message ?? "No se pudo guardar la recurrencia.");
  }

  await logAudit("recurring_transaction", data.id, "created", parsed.data);
  revalidatePath("/panel");
  revalidatePath("/presupuestos");
  return success("Movimiento recurrente guardado.");
}
