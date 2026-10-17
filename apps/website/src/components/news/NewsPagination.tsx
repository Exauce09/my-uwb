import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

type Props = {
  page: number
  totalPages: number
  onPage: (page: number) => void
}

export function NewsPagination({ page, totalPages, onPage }: Props) {
  const reduced = useReducedMotion()

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <motion.nav
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination des actualités"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-uwb-navy transition enabled:hover:border-uwb-red enabled:hover:text-uwb-red disabled:opacity-35"
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-semibold transition ${
            p === page
              ? 'border-uwb-navy bg-uwb-navy text-white'
              : 'border-black/10 text-uwb-navy hover:border-uwb-red hover:text-uwb-red'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-uwb-navy transition enabled:hover:border-uwb-red enabled:hover:text-uwb-red disabled:opacity-35"
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </motion.nav>
  )
}
