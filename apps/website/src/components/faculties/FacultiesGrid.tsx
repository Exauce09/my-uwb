import { Link } from 'react-router-dom'
import type { Faculty } from '../../types/faculty'
import { facultyCopy } from '../../data/facultyCopy'
import { Reveal } from '../motion/Reveal'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'
import { FacultyCard } from './FacultyCard'

type Props = {
  official: Faculty[]
  pending: Faculty[]
}

export function FacultiesGrid({ official, pending }: Props) {
  const [lead, ...rest] = official

  return (
    <section id="facultes-liste" className="scroll-mt-28 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {facultyCopy.faculties.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {facultyCopy.faculties.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {facultyCopy.faculties.intro}
          </p>
        </Reveal>

        {lead ? (
          <Reveal delay={0.08} className="mt-12">
            <FacultyCard faculty={lead} variant="editorial" />
          </Reveal>
        ) : null}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((faculty, i) => (
            <Reveal key={faculty.id} delay={Math.min(i * 0.05, 0.3)}>
              <FacultyCard faculty={faculty} />
            </Reveal>
          ))}
        </div>

        {pending.length > 0 ? (
          <div className="mt-16">
            <h3 className="text-[11px] font-semibold tracking-[0.25em] text-uwb-muted uppercase">
              {facultyCopy.faculties.pendingTitle}
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {pending.map((f) => (
                <Link
                  key={f.id}
                  to={`/facultes/${f.slug}`}
                  className="border border-dashed border-black/15 p-5 transition hover:border-uwb-red"
                >
                  <ProvisionalBadge />
                  <h4 className="mt-3 font-display text-xl font-semibold text-uwb-navy">
                    {f.name}
                  </h4>
                  {f.note ? (
                    <p className="mt-2 text-xs text-uwb-muted">{f.note}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
