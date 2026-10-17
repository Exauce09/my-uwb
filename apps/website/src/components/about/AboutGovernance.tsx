import { presentation } from '../../data/presentation'
import { uwbMedia } from '../../data/media'
import { Reveal } from '../motion/Reveal'

const activeMembers = presentation.management.filter(
  (m) => m.status === 'active',
)
const historicalMembers = presentation.management.filter(
  (m) => m.status === 'historical',
)
const rector = activeMembers.find((m) => m.role === 'Recteur')

/** Bloc gouvernance — membres actifs vs mentions historiques. */
export function AboutGovernance() {
  return (
    <section className="border-t border-black/5 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            Gouvernance
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            Comité de gestion
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted">
            {presentation.managementSourceNote} Source de référence :{' '}
            <a
              href={presentation.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-uwb-red/30 underline-offset-2 hover:text-uwb-red"
            >
              {presentation.sourceLabel}
            </a>
            .
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {rector ? (
            <Reveal className="lg:col-span-4">
              <figure>
                <img
                  src={uwbMedia.rector}
                  alt={rector.name}
                  className="aspect-[4/5] w-full object-cover object-[center_15%]"
                  loading="lazy"
                />
                <figcaption className="mt-3 text-[11px] text-uwb-muted">
                  {rector.role} — {uwbMedia.credit}
                </figcaption>
              </figure>
            </Reveal>
          ) : null}

          <div className="grid gap-px bg-black/5 sm:grid-cols-2 lg:col-span-8 lg:content-start">
            {activeMembers.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.05}>
                <article className="h-full bg-uwb-surface p-6 sm:p-7">
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-uwb-red uppercase">
                    {member.role}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-uwb-navy md:text-2xl">
                    {member.name}
                  </h3>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {historicalMembers.length > 0 ? (
          <div className="mt-12 border-t border-black/5 pt-10">
            <Reveal>
              <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-muted uppercase">
                Mention historique
              </p>
              <p className="mt-2 max-w-2xl text-sm text-uwb-muted">
                Informations conservées à titre historique — ces personnes ne
                sont pas présentées comme titulaires actuels.
              </p>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {historicalMembers.map((member, i) => (
                <Reveal key={member.name} delay={i * 0.05}>
                  <article className="border border-black/5 bg-uwb-surface/60 p-6 sm:p-7">
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-uwb-muted uppercase">
                      {member.role}
                    </p>
                    <h3 className="mt-3 font-display text-lg font-semibold text-uwb-navy md:text-xl">
                      {member.name}
                    </h3>
                    {'note' in member && member.note ? (
                      <p className="mt-4 text-sm leading-relaxed text-uwb-muted">
                        {member.note}
                      </p>
                    ) : null}
                    {'homageUrl' in member && member.homageUrl ? (
                      <p className="mt-4">
                        <a
                          href={member.homageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-uwb-red underline decoration-uwb-red/30 underline-offset-2 hover:decoration-uwb-red"
                        >
                          Hommage officiel (11 juin 2026)
                        </a>
                      </p>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
