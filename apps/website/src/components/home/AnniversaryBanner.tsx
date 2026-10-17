import { anniversary } from '../../data/anniversary'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

/** Jubilé — design sobre (blanc / anthracite), accent rouge discret. */
export function AnniversaryBanner() {
  return (
    <section
      id="anniversaire-30"
      className="border-y border-black/5 bg-uwb-surface"
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-uwb-red" />
              <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
                {anniversary.badge}
              </p>
            </div>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-uwb-blue md:text-5xl lg:text-6xl">
              {anniversary.title}
            </h2>
            <p className="mt-3 text-lg text-uwb-muted">{anniversary.subtitle}</p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-uwb-muted">
              {anniversary.highlight}
            </p>
            <div className="mt-8">
              <Button to={anniversary.cta.to} className="rounded-none">
                {anniversary.cta.label}
              </Button>
            </div>
          </Reveal>

          <div className="grid gap-px bg-black/8 sm:grid-cols-3 lg:grid-cols-1">
            {anniversary.moments.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.05}>
                <article className="bg-white px-5 py-5">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-uwb-red uppercase">
                    {m.when}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-uwb-blue">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-sm text-uwb-muted">{m.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
