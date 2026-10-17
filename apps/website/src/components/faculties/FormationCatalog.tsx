import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Formation } from '../../types/formation'
import type { Faculty } from '../../types/faculty'
import type { FacultyKind } from '../../types/faculty'
import type { FormationSort } from '../../hooks/useFormationSearch'
import { facultyCopy } from '../../data/facultyCopy'
import { Reveal } from '../motion/Reveal'
import { FormationCard } from './FormationCard'
import { FormationFilters } from './FormationFilters'

type Props = {
  formations: Formation[]
  total: number
  facultyId: string | 'all'
  kind: FacultyKind | 'all'
  sort: FormationSort
  facultyOptions: Faculty[]
  hasActiveFilters: boolean
  onFaculty: (v: string | 'all') => void
  onKind: (v: FacultyKind | 'all') => void
  onSort: (v: FormationSort) => void
  onReset: () => void
}

export function FormationCatalog({
  formations,
  total,
  facultyId,
  kind,
  sort,
  facultyOptions,
  hasActiveFilters,
  onFaculty,
  onKind,
  onSort,
  onReset,
}: Props) {
  const reduced = useReducedMotion()

  return (
    <section
      id="catalogue-formations"
      className="scroll-mt-28 bg-uwb-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {facultyCopy.catalog.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {facultyCopy.catalog.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {facultyCopy.catalog.intro}
          </p>
        </Reveal>

        <div className="mt-10">
          <FormationFilters
            facultyId={facultyId}
            kind={kind}
            sort={sort}
            total={total}
            facultyOptions={facultyOptions}
            hasActiveFilters={hasActiveFilters}
            onFaculty={onFaculty}
            onKind={onKind}
            onSort={onSort}
            onReset={onReset}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={formations.map((f) => f.id).join('-') || 'empty'}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10"
          >
            {formations.length === 0 ? (
              <div className="border border-dashed border-black/15 bg-white px-6 py-16 text-center">
                <p className="font-display text-2xl font-semibold text-uwb-navy">
                  Aucun résultat
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm text-uwb-muted">
                  {facultyCopy.search.empty}
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {formations.map((formation, i) => (
                  <Reveal key={formation.id} delay={Math.min(i * 0.04, 0.28)}>
                    <FormationCard formation={formation} />
                  </Reveal>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
