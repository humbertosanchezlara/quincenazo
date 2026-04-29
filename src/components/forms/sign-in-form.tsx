"use client";

import { useActionState } from "react";
import { signInAction } from "@/app/actions";
import { Field } from "@/components/ui/field";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = { ok: false, message: "" };

export function SignInForm() {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field
        label="Correo"
        name="email"
        type="email"
        placeholder="tu@correo.com"
        autoComplete="email"
      />
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>
          {state.message}
        </p>
      ) : null}
      <SubmitButton
        label="Entrar con link mágico"
        pendingLabel="Enviando..."
        className="w-full"
      />
    </form>
  );
}
