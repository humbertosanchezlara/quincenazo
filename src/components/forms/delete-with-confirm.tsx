"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";

type ActionState = { ok: boolean; message: string };
type ServerAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

const initialState: ActionState = { ok: false, message: "" };

export function DeleteWithConfirm({
  id,
  action,
  label = "Eliminar",
}: {
  id: string;
  action: ServerAction;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="ghost"
        className="text-xs text-danger"
        onClick={() => setConfirming(true)}
      >
        {label}
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <Button type="submit" variant="danger" className="px-3 py-1 text-xs" disabled={pending}>
          {pending ? "Eliminando..." : "¿Confirmar?"}
        </Button>
      </form>
      <Button
        type="button"
        variant="ghost"
        className="text-xs"
        onClick={() => setConfirming(false)}
        disabled={pending}
      >
        Cancelar
      </Button>
      {state.message && !state.ok ? (
        <p className="text-xs text-danger">{state.message}</p>
      ) : null}
    </div>
  );
}
