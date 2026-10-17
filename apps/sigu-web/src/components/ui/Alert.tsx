type Props = {
  tone?: "error" | "success" | "info";
  children: React.ReactNode;
};

const tones = {
  error: "border-[var(--sigu-danger)] bg-[#fdf2f2] text-[var(--sigu-danger)]",
  success: "border-[var(--sigu-accent)] bg-[#eef8f2] text-[var(--sigu-accent)]",
  info: "border-[var(--sigu-navy)] bg-[#eef3f9] text-[var(--sigu-navy)]",
};

export function Alert({ tone = "info", children }: Props) {
  return (
    <div
      role="alert"
      className={`rounded-md border px-3 py-2 text-sm ${tones[tone]}`}
    >
      {children}
    </div>
  );
}
