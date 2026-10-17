import {
  libraryDomainLabels,
  libraryDomains,
  libraryResourceTypes,
  libraryTypeLabels,
} from '../../data/libraryCategories'
import type {
  LibraryDomain,
  LibraryFiltersState,
  LibraryResourceType,
  LibrarySort,
} from '../../types/library'

type Props = {
  filters: LibraryFiltersState
  years: number[]
  resultCount: number
  onToggleType: (t: LibraryResourceType) => void
  onToggleDomain: (d: LibraryDomain) => void
  onSetYear: (y: number | 'all') => void
  onSetSort: (s: LibrarySort) => void
  onReset: () => void
}

const chip = (active: boolean) =>
  `rounded-sm border px-3 py-1.5 text-xs font-medium transition ${
    active
      ? 'border-uwb-blue bg-uwb-blue text-white'
      : 'border-uwb-navy/12 bg-white text-uwb-muted hover:border-uwb-red'
  }`

export function LibraryFilters({
  filters,
  years,
  resultCount,
  onToggleType,
  onToggleDomain,
  onSetYear,
  onSetSort,
  onReset,
}: Props) {
  return (
    <aside className="space-y-8 border border-uwb-navy/8 bg-white p-5 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-uwb-blue uppercase">
          Filtres · {resultCount}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-uwb-red underline-offset-4 hover:underline"
        >
          Réinitialiser
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-uwb-navy">
          Type de ressource
        </h3>
        <div className="flex flex-wrap gap-2">
          {libraryResourceTypes.map((t) => (
            <button
              key={t}
              type="button"
              className={chip(filters.types.includes(t))}
              onClick={() => onToggleType(t)}
            >
              {libraryTypeLabels[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-uwb-navy">
          Domaine académique
        </h3>
        <div className="flex flex-wrap gap-2">
          {libraryDomains.map((d) => (
            <button
              key={d}
              type="button"
              className={chip(filters.domains.includes(d))}
              onClick={() => onToggleDomain(d)}
            >
              {libraryDomainLabels[d]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="lib-year"
          className="mb-2 block text-sm font-semibold text-uwb-navy"
        >
          Année
        </label>
        <select
          id="lib-year"
          className="w-full border border-uwb-navy/12 bg-uwb-surface px-3 py-2.5 text-sm outline-none focus:border-uwb-red"
          value={filters.year}
          onChange={(e) =>
            onSetYear(
              e.target.value === 'all' ? 'all' : Number(e.target.value),
            )
          }
        >
          <option value="all">Toutes les années</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="lib-sort"
          className="mb-2 block text-sm font-semibold text-uwb-navy"
        >
          Tri
        </label>
        <select
          id="lib-sort"
          className="w-full border border-uwb-navy/12 bg-uwb-surface px-3 py-2.5 text-sm outline-none focus:border-uwb-red"
          value={filters.sort}
          onChange={(e) => onSetSort(e.target.value as LibrarySort)}
        >
          <option value="pertinence">Pertinence</option>
          <option value="titre">Titre (A–Z)</option>
          <option value="date-desc">Date (récent → ancien)</option>
          <option value="date-asc">Date (ancien → récent)</option>
        </select>
      </div>
    </aside>
  )
}
