import { cn } from "@/lib/utils";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.SelectHTMLAttributes<HTMLSelectElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as?: "input" | "select" | "textarea";
    label: string;
    hint?: string;
    children?: React.ReactNode;
  };

export function Field({
  as = "input",
  label,
  hint,
  className,
  children,
  ...props
}: FieldProps) {
  const baseClassName = cn(
    "mt-2 w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand focus:ring-2 focus:ring-brand/15",
    as === "textarea" && "min-h-24 resize-y",
    className,
  );

  return (
    <label className="block text-sm font-medium text-foreground/88">
      <span>{label}</span>
      {as === "input" ? (
        <input className={baseClassName} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      ) : null}
      {as === "select" ? (
        <select className={baseClassName} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          {children}
        </select>
      ) : null}
      {as === "textarea" ? (
        <textarea
          className={baseClassName}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : null}
      {hint ? <span className="mt-1 block text-xs text-foreground/55">{hint}</span> : null}
    </label>
  );
}
