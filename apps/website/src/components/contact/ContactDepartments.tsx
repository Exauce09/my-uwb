import { ArrowRight } from 'lucide-react'
import { contactCopy, contactDepartments } from '../../data/contact'
import { Reveal } from '../motion/Reveal'

type Props = {
  onSelect: (subject: string, serviceId: string) => void
}

export function ContactDepartments({ onSelect }: Props) {
  const { departments } = contactCopy

  return (
    <section
      id="services-contact"
      className="scroll-mt-28 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {departments.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {departments.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {departments.intro}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contactDepartments.map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i * 0.05, 0.25)}>
              <article className="flex h-full flex-col border border-black/8 bg-uwb-surface/40 p-6">
                <h3 className="font-display text-xl font-semibold text-uwb-navy">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-uwb-muted">
                  {item.description}
                </p>
                {item.email || item.phone ? (
                  <ul className="mt-4 space-y-1 text-xs text-uwb-navy">
                    {item.email ? (
                      <li>
                        <a
                          href={`mailto:${item.email}`}
                          className="font-semibold text-uwb-red outline-none hover:underline focus-visible:ring-2 focus-visible:ring-uwb-red/40"
                        >
                          {item.email}
                        </a>
                      </li>
                    ) : null}
                    {item.phone ? (
                      <li>
                        <a
                          href={`tel:${item.phone.replace(/\s/g, '')}`}
                          className="outline-none hover:text-uwb-red focus-visible:ring-2 focus-visible:ring-uwb-red/40"
                        >
                          {item.phone}
                        </a>
                      </li>
                    ) : null}
                  </ul>
                ) : (
                  <p className="mt-4 text-xs text-uwb-muted">
                    Aucune adresse dédiée publiée — utilisez le formulaire
                    général.
                  </p>
                )}
                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-uwb-red outline-none transition hover:underline focus-visible:ring-2 focus-visible:ring-uwb-red/40"
                  onClick={() => {
                    onSelect(item.subjectHint, item.id)
                    document
                      .getElementById('formulaire-contact')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {item.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
