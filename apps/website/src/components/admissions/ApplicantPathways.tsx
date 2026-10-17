import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  RefreshCw,
  GitBranch,
  GraduationCap,
} from 'lucide-react'
import { admissionsCopy, applicantPathways } from '../../data/admissions'
import { Reveal } from '../motion/Reveal'

const icons = {
  nouveau: GraduationCap,
  reinscription: RefreshCw,
  'changement-filiere': GitBranch,
  formations: BookOpen,
} as const

export function ApplicantPathways() {
  const { pathways } = admissionsCopy

  return (
    <section
      id="parcours-candidat"
      className="scroll-mt-28 border-b border-black/5 bg-uwb-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {pathways.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {pathways.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {pathways.intro}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {applicantPathways.map((item, i) => {
            const Icon = icons[item.id as keyof typeof icons] ?? BookOpen
            const isHash = item.href.startsWith('#')
            const className =
              'group flex h-full flex-col border border-black/8 bg-white p-6 transition hover:border-uwb-red/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uwb-red/40'

            const content = (
              <>
                <Icon
                  className="h-6 w-6 text-uwb-red"
                  aria-hidden
                  strokeWidth={1.5}
                />
                <h3 className="mt-4 font-display text-xl font-semibold text-uwb-navy">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-uwb-muted">
                  {item.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-uwb-red">
                  {item.cta}
                  <ArrowRight
                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </>
            )

            return (
              <Reveal key={item.id} delay={Math.min(i * 0.06, 0.24)}>
                {isHash ? (
                  <a href={item.href} className={className}>
                    {content}
                  </a>
                ) : (
                  <Link to={item.href} className={className}>
                    {content}
                  </Link>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
