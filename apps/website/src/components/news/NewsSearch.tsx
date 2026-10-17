import { Search, X } from 'lucide-react'
import { newsCopy } from '../../data/newsCategories'

type Props = {
  value: string
  onChange: (v: string) => void
  onClear: () => void
}

export function NewsSearch({ value, onChange, onClear }: Props) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Rechercher dans les actualités</span>
      <Search
        className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-uwb-muted"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={newsCopy.search.placeholder}
        className="w-full border border-black/10 bg-white py-3.5 pr-11 pl-11 text-sm text-uwb-navy outline-none transition placeholder:text-uwb-muted/60 focus:border-uwb-red focus:ring-2 focus:ring-uwb-red/15"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-uwb-muted transition hover:text-uwb-navy"
          aria-label="Effacer la recherche"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </label>
  )
}
