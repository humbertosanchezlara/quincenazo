"use client";

import { useActionState, useState } from "react";
import { upsertTransactionAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import type { Category } from "@/lib/types";

type CategoryWithSubs = Category & { subcategories: { id: string; name: string }[] };

const initialState = { ok: false, message: "" };

export function TransactionForm({
  month,
  categories,
  defaultDate,
}: {
  month: string;
  categories: CategoryWithSubs[];
  defaultDate: string;
}) {
  const [state, formAction] = useActionState(upsertTransactionAction, initialState);
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [payee, setPayee] = useState("");
  const [notes, setNotes] = useState("");

  const filteredCategories = categories.filter(
    (category) => category.transaction_type === transactionType,
  );

  const selectedCategory = filteredCategories.find((item) => item.id === categoryId);

  const haystack = `${payee} ${notes}`.trim().toLowerCase();
  let suggestion: { categoryId: string; subcategoryId: string } | null = null;
  if (haystack) {
    for (const category of categories) {
      const match = category.subcategories.find((subcategory) =>
        haystack.includes(subcategory.name.toLowerCase().split(" ")[0] ?? ""),
      );
      if (match) {
        suggestion = { categoryId: category.id, subcategoryId: match.id };
        break;
      }
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="month" value={month} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Monto" name="amount" type="number" min="1" step="0.01" placeholder="1250" />
        <Field label="Fecha" name="occurred_on" type="date" defaultValue={defaultDate} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          as="select"
          label="Tipo"
          name="transaction_type"
          value={transactionType}
          onChange={(event) => {
            setTransactionType(event.target.value as "income" | "expense");
            setCategoryId("");
          }}
        >
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </Field>
        <Field
          as="select"
          label="Categoría"
          name="category_id"
          value={categoryId || suggestion?.categoryId || ""}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Selecciona una categoría</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Field>
      </div>
      <Field
        as="select"
        label="Subcategoría"
        name="subcategory_id"
        defaultValue={suggestion?.subcategoryId || ""}
      >
        <option value="">Opcional</option>
        {(selectedCategory?.subcategories ?? []).map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>
            {subcategory.name}
          </option>
        ))}
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Comercio o fuente"
          name="payee"
          placeholder="Uber, Costco, nómina..."
          value={payee}
          onChange={(event) => setPayee(event.target.value)}
        />
        <Field
          label="Notas"
          name="notes"
          placeholder="Opcional"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>
      {suggestion ? (
        <p className="text-sm text-success">
          Sugerencia detectada por historial: podemos precargar una categoría parecida.
        </p>
      ) : null}
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>{state.message}</p>
      ) : null}
      <SubmitButton label="Guardar movimiento" pendingLabel="Guardando..." />
    </form>
  );
}
