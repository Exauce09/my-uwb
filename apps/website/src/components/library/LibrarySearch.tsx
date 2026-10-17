import { Search, X } from 'lucide-react'

type Props = {
  value: string
  onChange: (v: string) => void
  onClear: () => void
  placeholder?: string
  variant?: 'hero' | 'bar'
}

export function LibrarySearch({
  value,
  onChange,
  onClear,
  placeholder = 'Rechercher…',
  variant = 'bar',
}: Props) {
  const hero = variant === 'hero'

  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={
        hero
          ? 'flex w-full flex-col gap-3 sm:flex-row sm:items-stretch'
          : 'flex w-full items-center gap-2 border-b border-uwb-navy/15'
      }
    >
      <div
        className={
          hero
            ? 'flex flex-1 items-center gap-3 border border-white/25 bg-white/95 px-4 py-3 shadow-lg shadow-uwb-navy/10'
            : 'flex flex-1 items-center gap-2'
        }
      >
        <Search
          className={`h-5 w-5 shrink-0 ${hero ? 'text-uwb-blue' : 'text-uwb-muted'}`}
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Recherche documentaire"
          className={`w-full bg-transparent text-base outline-none ${
            hero
              ? 'text-uwb-navy placeholder:text-uwb-muted/60'
              : 'py-2 text-sm text-uwb-navy placeholder:text-uwb-muted/50'
          }`}
        />
        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="text-uwb-muted transition hover:text-uwb-navy"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      {hero ? (
        <button
          type="submit"
          className="bg-uwb-red px-8 py-3.5 text-sm font-semibold tracking-wide text-uwb-navy transition hover:brightness-105"
        >
          Rechercher
        </button>
      ) : null}
    </form>
  )
}
