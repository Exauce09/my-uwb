import { motion, useReducedMotion } from 'motion/react'
import { libraryCopy, libraryQuickCategories } from '../../data/libraryCategories'
import { uwbMedia } from '../../data/media'
import type { LibraryDomain, LibraryResourceType } from '../../types/library'
import { LibrarySearch } from './LibrarySearch'

type Props = {
  query: string
  onQuery: (v: string) => void
  onClear: () => void
  onQuick: (opts: { type?: LibraryResourceType; domain?: LibraryDomain }) => void
}

export function LibraryHero({ query, onQuery, onClear, onQuick }: Props) {
  const reduced = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden bg-uwb-navy text-white">
      <img
        src={uwbMedia.libraryHero}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover object-[72%_center] ${
          reduced ? '' : 'ken-burns'
        }`}
      />
      <div className="library-hero-veil absolute inset-0" />
      <div className="film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase"
        >
          Université William Booth · Kinshasa
        </motion.p>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] md:text-6xl lg:text-7xl"
        >
          {libraryCopy.brand}
        </motion.h1>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-5 max-w-xl font-display text-2xl text-uwb-red/95 md:text-3xl"
        >
          {libraryCopy.tagline}
        </motion.p>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-white/75"
        >
          {libraryCopy.intro}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.38 }}
          className="mt-10 max-w-3xl"
        >
          <LibrarySearch
            variant="hero"
            value={query}
            onChange={onQuery}
            onClear={onClear}
            placeholder={libraryCopy.searchPlaceholder}
          />
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {libraryQuickCategories.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                onQuick({ type: c.type, domain: c.domain })
                document
                  .getElementById('catalogue')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="border border-white/25 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-white/85 transition hover:border-uwb-red hover:text-uwb-red"
            >
              {c.label}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
