import { facultyCopy } from '../../data/facultyCopy'
import type { Faculty } from '../../types/faculty'
import type { FacultyKind } from '../../types/faculty'
import type { FormationSort } from '../../hooks/useFormationSearch'

type Props = {
  facultyId: string | 'all'
  kind: FacultyKind | 'all'
  sort: FormationSort
  total: number
  facultyOptions: Faculty[]
  hasActiveFilters: boolean
  onFaculty: (v: string | 'all') => void
  onKind: (v: FacultyKind | 'all') => void
  onSort: (v: FormationSort) => void
  onReset: () => void
}

function chip(active: boolean) {
  return `shrink-0 border px-3.5 py-2 text-xs font-medium tracking-wide transition ${
    active
      ? 'border-uwb-navy bg-uwb-navy text-white'
      : 'border-black/10 bg-white text-uwb-muted hover:border-uwb-red hover:text-uwb-red'
  }`
}

export function FormationFilters({
  facultyId,
  kind,
  sort,
  total,
  facultyOptions,
  hasActiveFilters,
  onFaculty,
  onKind,
  onSort,
  onReset,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-uwb-muted" aria-live="polite">
          {facultyCopy.search.results(total)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-uwb-muted">
            <span className="sr-only">Trier</span>
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value as FormationSort)}
              className="border border-black/10 bg-white px-3 py-2 text-xs text-uwb-navy outline-none focus:border-uwb-red"
            >
              <option value="name-asc">{facultyCopy.search.sortName}</option>
              <option value="name-desc">{facultyCopy.search.sortNameDesc}</option>
            </select>
          </label>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-uwb-red underline-offset-2 hover:underline"
            >
              {facultyCopy.search.reset}
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Type d’entité">
        <button type="button" className={chip(kind === 'all')} onClick={() => onKind('all')}>
          {facultyCopy.search.allKinds}
        </button>
        <button type="button" className={chip(kind === 'faculte')} onClick={() => onKind('faculte')}>
          {facultyCopy.search.kindFaculte}
        </button>
        <button type="button" className={chip(kind === 'institut')} onClick={() => onKind('institut')}>
          {facultyCopy.search.kindInstitut}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="listbox" aria-label="Facultés">
        <button
          type="button"
          role="option"
          aria-selected={facultyId === 'all'}
          className={chip(facultyId === 'all')}
          onClick={() => onFaculty('all')}
        >
          {facultyCopy.search.allFaculties}
        </button>
        {facultyOptions.map((f) => (
          <button
            key={f.id}
            type="button"
            role="option"
            aria-selected={facultyId === f.id}
            className={chip(facultyId === f.id)}
            onClick={() => onFaculty(f.id)}
          >
            {f.shortName}
          </button>
        ))}
      </div>
    </div>
  )
}
