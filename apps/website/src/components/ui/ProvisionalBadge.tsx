export function ProvisionalBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm bg-uwb-gold/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-uwb-blue ${className}`}
    >
      À vérifier UWB
    </span>
  )
}
