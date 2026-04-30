"use client";

import { useActionState } from "react";
import { upsertRecurringAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import type { Category } from "@/lib/types";

const initialState = { ok: false, message: "" };

export function RecurringForm({
  categories,
  defaultStartDate,
}: {
  categories: (Category & { subcategories: { id: string; name: string }[] })[];
  defaultStartDate: string;
}) {
  const [state, formAction] = useActionState(upsertRecurringAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre interno" name="name" placeholder="Renta, Spotify, colegiatura..." />
        <Field label="Monto" name="amount" type="number" min="1" step="0.01" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field as="select" label="Tipo" name="transaction_type" defaultValue="expense">
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </Field>
        <Field label="Día del mes" name="day_of_month" type="number" min="1" max="31" defaultValue="5" />
      </div>
      <Field as="select" label="Categoría" name="category_id">
        <option value="">Opcional</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Payee" name="payee" placeholder="Comercio o destinatario" />
        <Field label="Inicio" name="start_date" type="date" defaultValue={defaultStartDate} />
      </div>
      <Field as="textarea" label="Notas" name="notes" placeholder="Opcional" />
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>{state.message}</p>
      ) : null}
      <SubmitButton label="Guardar recurrencia" pendingLabel="Guardando..." />
    </form>
  );
}
