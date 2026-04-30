"use client";

import { useActionState } from "react";
import { deleteTransactionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

const initialState = { ok: false, message: "" };

export function DeleteTransactionForm({ id }: { id: string }) {
  const [state, formAction] = useActionState(deleteTransactionAction, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" className="text-danger">
        Eliminar
      </Button>
      {state.message && !state.ok ? (
        <p className="mt-1 text-xs text-danger">{state.message}</p>
      ) : null}
    </form>
  );
}
