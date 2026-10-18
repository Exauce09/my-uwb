import type { ReactNode } from "react";

type Tone = "error" | "success" | "info";

const tones: Record<Tone, string> = {
  error:
    "border-[var(--sigu-accent)]/30 bg-[var(--sigu-accent-soft)] text-[var(--sigu-accent-dark)]",
  success: "border-emerald-700/25 bg-emerald-50 text-emerald-900",
  info: "border-black/10 bg-[var(--sigu-sand)] text-[var(--sigu-ink)]",
};

export function Alert({
  tone = "info",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <div className={`border px-3.5 py-2.5 text-sm ${tones[tone]}`} role="alert">
      {children}
    </div>
  );
}
