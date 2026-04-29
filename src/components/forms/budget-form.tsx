"use client";

import { useActionState } from "react";
import { upsertBudgetAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import type { Category } from "@/lib/types";

const initialState = { ok: false, message: "" };

export function BudgetForm({
  month,
  categories,
}: {
  month: string;
  categories: Category[];
}) {
  const [state, formAction] = useActionState(upsertBudgetAction, initialState);
  const expenseCategories = categories.filter((category) => category.transaction_type === "expense");

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="month" value={month} />
      <Field as="select" name="category_id" label="Categoría">
        <option value="">Selecciona una categoría</option>
        {expenseCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Field>
      <Field label="Monto planeado" name="planned_amount" type="number" min="1" step="0.01" />
      <Field as="textarea" label="Contexto" name="notes" placeholder="Opcional: viaje, ajuste, recibo extra..." />
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>{state.message}</p>
      ) : null}
      <SubmitButton label="Guardar presupuesto" pendingLabel="Guardando..." />
    </form>
  );
}
