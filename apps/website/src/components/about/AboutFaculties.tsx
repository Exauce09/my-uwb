import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getFeaturedFaculties } from '../../data/faculties'
import { presentation } from '../../data/presentation'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

export function AboutFaculties() {
  const { faculties: copy } = presentation.about
  const list = getFeaturedFaculties()

  return (
    <section id="facultes-apercu" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
              {copy.kicker}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-uwb-navy md:text-5xl">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-uwb-muted md:text-base">
              {copy.intro}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Button to="/facultes" variant="ghost" className="rounded-none">
              {copy.seeAll}
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((faculty, i) => (
            <Reveal key={faculty.id} delay={Math.min(i * 0.05, 0.35)}>
              <Link
                to={`/facultes/${faculty.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-uwb-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uwb-red"
              >
                <img
                  src={faculty.image}
                  alt={`${faculty.kind === 'institut' ? 'Institut' : 'Faculté'} ${faculty.shortName}`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy via-uwb-navy/50 to-transparent opacity-90 transition group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-uwb-gold-soft uppercase">
                    {faculty.kind === 'institut' ? 'Institut' : 'Faculté'}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
                    {faculty.shortName}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm text-white/70">
                    {faculty.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-uwb-red transition group-hover:gap-2">
                    {copy.discover}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
