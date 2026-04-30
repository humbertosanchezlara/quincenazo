"use client";

import { useActionState, useState } from "react";
import { signInAction, signInWithGoogleAction, signUpAction } from "@/app/actions";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = { ok: false, message: "" };

export function SignInForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInFormAction] = useActionState(signInAction, initialState);
  const [signUpState, signUpFormAction] = useActionState(signUpAction, initialState);
  const state = mode === "signin" ? signInState : signUpState;

  return (
    <div className="space-y-5">
      <form action={signInWithGoogleAction}>
        <Button type="submit" variant="secondary" className="w-full">
          Continuar con Google
        </Button>
      </form>

      <div className="flex rounded-full border border-border bg-surface-muted p-1">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "signin" ? "bg-white text-foreground shadow-sm" : "text-foreground/60"
          }`}
        >
          Entrar con correo
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "signup" ? "bg-white text-foreground shadow-sm" : "text-foreground/60"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      <form
        action={mode === "signin" ? signInFormAction : signUpFormAction}
        className="space-y-4"
      >
        {mode === "signup" ? (
          <Field
            label="Nombre"
            name="full_name"
            type="text"
            placeholder="Tu nombre"
            autoComplete="name"
          />
        ) : null}
        <Field
          label="Correo"
          name="email"
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
        />
        <Field
          label="Contraseña"
          name="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />
        {state.message ? (
          <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>
            {state.message}
          </p>
        ) : null}
        <SubmitButton
          label={mode === "signin" ? "Entrar con correo" : "Crear cuenta"}
          pendingLabel={mode === "signin" ? "Entrando..." : "Creando..."}
          className="w-full"
        />
      </form>
    </div>
  );
}
