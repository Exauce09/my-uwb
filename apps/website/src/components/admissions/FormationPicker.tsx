import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { admissionsCopy } from '../../data/admissions'
import {
  filterFaculties,
  getVerifiedFaculties,
} from '../../data/faculties'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'
import { FacultyCard } from '../faculties/FacultyCard'

export function FormationPicker() {
  const { formations } = admissionsCopy
  const [query, setQuery] = useState('')

  const verified = useMemo(() => getVerifiedFaculties(), [])
  const list = useMemo(() => {
    if (query.trim()) {
      return filterFaculties(query).filter((f) => f.verified)
    }
    return verified.filter((f) => f.featured)
  }, [query, verified])

  return (
    <section
      id="choisir-formation"
      className="scroll-mt-28 border-y border-black/5 bg-uwb-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
                {formations.kicker}
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
                {formations.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
                {formations.intro}
              </p>
            </div>
            <Button to="/facultes" className="rounded-none shrink-0">
              {formations.ctaAll}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <label className="sr-only" htmlFor="admissions-formation-search">
            Rechercher une formation
          </label>
          <div className="relative max-w-xl">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-uwb-muted"
              aria-hidden
            />
            <input
              id="admissions-formation-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={formations.searchPlaceholder}
              className="w-full border border-black/10 bg-white py-3.5 pr-4 pl-11 text-sm text-uwb-navy outline-none transition focus:border-uwb-red focus:ring-2 focus:ring-uwb-red/25"
            />
          </div>
          <p className="mt-3 text-sm text-uwb-muted" aria-live="polite">
            {list.length} faculté{list.length > 1 ? 's' : ''} / institut
            {list.length > 1 ? 's' : ''}
          </p>
        </Reveal>

        {list.length === 0 ? (
          <p className="mt-10 text-sm text-uwb-muted">
            Aucune faculté confirmée ne correspond à votre recherche. Essayez un
            autre mot-clé ou consultez le catalogue complet.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((faculty, i) => (
              <Reveal key={faculty.id} delay={Math.min(i * 0.05, 0.25)}>
                <FacultyCard faculty={faculty} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
