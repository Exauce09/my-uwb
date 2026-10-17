import { ExternalLink } from 'lucide-react'
import {
  admissionRequirements,
  admissionsCopy,
} from '../../data/admissions'
import { Reveal } from '../motion/Reveal'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'

export function AdmissionRequirements() {
  const { requirements } = admissionsCopy

  return (
    <section
      id="conditions-admission"
      className="scroll-mt-28 border-y border-black/5 bg-uwb-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {requirements.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {requirements.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {requirements.intro}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {admissionRequirements.map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i * 0.05, 0.25)}>
              <article className="h-full border border-black/8 bg-white p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-semibold text-uwb-navy">
                    {item.title}
                  </h3>
                  {!item.verified ? <ProvisionalBadge /> : null}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-uwb-muted">
                  {item.text}
                </p>
                {item.sourceNote ? (
                  <a
                    href={item.sourceNote}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-uwb-red outline-none hover:underline focus-visible:ring-2 focus-visible:ring-uwb-red/40"
                  >
                    Source officielle
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
