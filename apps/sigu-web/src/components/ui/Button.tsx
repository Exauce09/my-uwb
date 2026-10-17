import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary:
    "bg-[var(--sigu-navy)] text-white hover:bg-[var(--sigu-ink)] disabled:opacity-60",
  secondary:
    "border border-[var(--sigu-line)] bg-white text-[var(--sigu-ink)] hover:bg-[#f8fafc] disabled:opacity-60",
  danger:
    "bg-[var(--sigu-danger)] text-white hover:bg-[#7f1515] disabled:opacity-60",
  ghost: "text-[var(--sigu-navy)] hover:bg-white/70 disabled:opacity-60",
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
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
