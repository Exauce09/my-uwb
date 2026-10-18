import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: ReactNode;
};

export function Field({ label, error, hint, id, className = "", ...props }: Props) {
  const fieldId = id || props.name || label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="block space-y-1.5 text-sm" htmlFor={fieldId}>
      <span className="font-medium text-[var(--sigu-ink)]">{label}</span>
      <input
        id={fieldId}
        className={`w-full rounded-sm border border-[var(--sigu-line)] bg-white px-3 py-2.5 text-[var(--sigu-ink)] placeholder:text-[var(--sigu-muted)] focus:border-[var(--sigu-accent)] disabled:bg-[var(--sigu-sand)] ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
      {hint && !error ? (
        <span className="block text-xs text-[var(--sigu-muted)]">{hint}</span>
      ) : null}
      {error ? (
        <span id={`${fieldId}-error`} className="block text-xs text-[var(--sigu-danger)]">
          {error}
        </span>
      ) : null}
    </label>
  );
}
