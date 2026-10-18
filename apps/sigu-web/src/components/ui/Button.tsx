import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary:
    "bg-[var(--sigu-accent)] text-white shadow-sm shadow-[var(--sigu-accent)]/25 hover:bg-[var(--sigu-accent-dark)] disabled:opacity-60",
  secondary:
    "border border-[var(--sigu-line)] bg-white text-[var(--sigu-ink)] hover:bg-[var(--sigu-sand)] disabled:opacity-60",
  danger:
    "bg-[var(--sigu-danger)] text-white hover:bg-[#6e0a1e] disabled:opacity-60",
  ghost:
    "text-[var(--sigu-ink)] hover:bg-[var(--sigu-accent-soft)] disabled:opacity-60",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-3.5 py-2 text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
