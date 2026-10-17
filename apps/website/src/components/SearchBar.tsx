type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Rechercher…',
  label = 'Recherche',
}: Props) {
  return (
    <label className="relative block w-full max-w-md">
      <span className="sr-only">{label}</span>
      <svg
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-uwb-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-uwb-blue/15 bg-white py-2.5 pr-3 pl-10 text-sm text-uwb-blue shadow-sm outline-none transition placeholder:text-uwb-muted/70 focus:border-uwb-red focus:ring-2 focus:ring-uwb-red/20"
      />
    </label>
  )
}
