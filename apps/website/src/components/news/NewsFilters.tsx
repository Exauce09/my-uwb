import {
  newsCategoryLabels,
  newsCategoryOrder,
  newsCopy,
} from '../../data/newsCategories'
import type { NewsCategoryId } from '../../types/news'
import type { NewsSort } from '../../hooks/useNewsSearch'

type Props = {
  category: NewsCategoryId | 'all'
  sort: NewsSort
  total: number
  hasActiveFilters: boolean
  onCategory: (v: NewsCategoryId | 'all') => void
  onSort: (v: NewsSort) => void
  onReset: () => void
}

function chipClass(active: boolean) {
  return `shrink-0 border px-3.5 py-2 text-xs font-medium tracking-wide transition ${
    active
      ? 'border-uwb-navy bg-uwb-navy text-white'
      : 'border-black/10 bg-white text-uwb-muted hover:border-uwb-red hover:text-uwb-red'
  }`
}

export function NewsFilters({
  category,
  sort,
  total,
  hasActiveFilters,
  onCategory,
  onSort,
  onReset,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-uwb-muted" aria-live="polite">
          {newsCopy.search.results(total)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-uwb-muted">
            <span className="sr-only">Trier</span>
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value as NewsSort)}
              className="border border-black/10 bg-white px-3 py-2 text-xs text-uwb-navy outline-none focus:border-uwb-red"
            >
              <option value="newest">{newsCopy.search.sortNewest}</option>
              <option value="oldest">{newsCopy.search.sortOldest}</option>
            </select>
          </label>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold tracking-wide text-uwb-red underline-offset-2 hover:underline"
            >
              {newsCopy.search.reset}
            </button>
          ) : null}
        </div>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        role="listbox"
        aria-label="Catégories"
      >
        <button
          type="button"
          role="option"
          aria-selected={category === 'all'}
          className={chipClass(category === 'all')}
          onClick={() => onCategory('all')}
        >
          {newsCopy.search.all}
        </button>
        {newsCategoryOrder.map((id) => (
          <button
            key={id}
            type="button"
            role="option"
            aria-selected={category === id}
            className={chipClass(category === id)}
            onClick={() => onCategory(id)}
          >
            {newsCategoryLabels[id]}
          </button>
        ))}
      </div>
    </div>
  )
}
