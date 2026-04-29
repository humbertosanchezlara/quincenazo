"use client";

import { useActionState } from "react";
import { createCategoryAction, createSubcategoryAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import type { Category } from "@/lib/types";

const initialState = { ok: false, message: "" };

export function CategoryForm() {
  const [state, formAction] = useActionState(createCategoryAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre" name="name" placeholder="Comida, casa, freelance..." />
        <Field as="select" label="Tipo" name="transaction_type" defaultValue="expense">
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Color" name="color" type="color" defaultValue="#1f6a52" />
        <Field label="Icono" name="icon" placeholder="Wallet, House, Sparkles..." />
      </div>
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>{state.message}</p>
      ) : null}
      <SubmitButton label="Crear categoría" pendingLabel="Creando..." />
    </form>
  );
}

export function SubcategoryForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState(createSubcategoryAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field as="select" label="Categoría padre" name="category_id">
        <option value="">Selecciona una categoría</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Field>
      <Field label="Subcategoría" name="name" placeholder="Supermercado, gasolina, freelance..." />
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>{state.message}</p>
      ) : null}
      <SubmitButton label="Crear subcategoría" pendingLabel="Creando..." />
    </form>
  );
}
