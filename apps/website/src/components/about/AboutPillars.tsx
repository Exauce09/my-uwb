import { Compass, Eye, Scale } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { presentation } from '../../data/presentation'
import { Reveal } from '../motion/Reveal'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'

const icons: Record<string, LucideIcon> = {
  mission: Compass,
  vision: Eye,
  valeurs: Scale,
}

export function AboutPillars() {
  const { pillars } = presentation.about

  return (
    <section className="bg-uwb-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {pillars.kicker}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold text-uwb-navy md:text-5xl">
            {pillars.title}
          </h2>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-uwb-muted">
            <ProvisionalBadge />
            <span>{pillars.provisionalNote}</span>
          </p>
        </Reveal>

        <div className="mt-14 grid gap-0 border-y border-black/8 lg:grid-cols-3">
          {pillars.items.map((item, i) => {
            const Icon = icons[item.id] ?? Compass
            return (
              <Reveal
                key={item.id}
                delay={i * 0.08}
                className={`border-black/8 px-6 py-10 sm:px-8 lg:px-10 ${
                  i < pillars.items.length - 1 ? 'lg:border-r' : ''
                } ${i > 0 ? 'border-t lg:border-t-0' : ''}`}
              >
                <div className="flex h-11 w-11 items-center justify-center border border-uwb-red/30 text-uwb-red">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-2xl font-semibold text-uwb-navy">
                    {item.label}
                  </h3>
                  {item.provisional ? <ProvisionalBadge /> : null}
                </div>
                <p
                  className={`mt-4 leading-relaxed ${
                    item.id === 'valeurs'
                      ? 'font-display text-xl text-uwb-red md:text-2xl'
                      : 'text-sm text-uwb-muted md:text-base'
                  }`}
                >
                  {item.text}
                </p>
                {'note' in item && item.note ? (
                  <p className="mt-4 text-[11px] text-uwb-muted/70">{item.note}</p>
                ) : null}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
