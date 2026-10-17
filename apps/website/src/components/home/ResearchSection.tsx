import { ArrowRight, BookOpen, FlaskConical, Library } from 'lucide-react'
import { Link } from 'react-router-dom'
import { researchHighlights } from '../../data/research'
import { Reveal } from '../motion/Reveal'

const icons = {
  publications: FlaskConical,
  'tfc-tfe': BookOpen,
  bibliotheque: Library,
} as const

const tones = {
  navy: 'from-uwb-blue-deep to-uwb-blue',
  red: 'from-uwb-red-dark to-uwb-red',
  gold: 'from-[#8a7018] to-uwb-gold',
} as const

const cardClass =
  'group flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30'

export function ResearchSection() {
  return (
    <section className="bg-uwb-navy py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-uwb-gold-soft uppercase">
              Recherche & innovation
            </p>
            <h2 className="font-display text-4xl font-semibold text-balance md:text-5xl">
              Publications, travaux et ressources académiques
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              Une rubrique éditoriale pour orienter vers les ressources
              documentaires et le canal officiel des publications, sans présenter
              un catalogue scientifique local comme déjà complet.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {researchHighlights.map((item, index) => {
            const Icon = icons[item.id as keyof typeof icons] ?? BookOpen
            const body = (
              <>
                <div>
                  <Icon className="mb-6 h-7 w-7 text-white/85" aria-hidden />
                  <h3 className="font-display text-2xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    {item.summary}
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-uwb-gold-soft transition group-hover:gap-3">
                  {item.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </>
            )

            return (
              <Reveal key={item.id} delay={index * 0.08}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${cardClass} ${tones[item.tone]}`}
                  >
                    {body}
                  </a>
                ) : (
                  <Link
                    to={item.to ?? '/bibliotheque'}
                    className={`${cardClass} ${tones[item.tone]}`}
                  >
                    {body}
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
