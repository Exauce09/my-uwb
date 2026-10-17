import { aboutValuesImages } from '../../data/aboutMedia'
import { presentation } from '../../data/presentation'
import { Reveal } from '../motion/Reveal'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'
import { ImageCrossfade } from './ImageCrossfade'

export function AboutValues() {
  const { values } = presentation.about

  return (
    <section className="relative overflow-hidden bg-uwb-navy py-20 text-white lg:py-28">
      <ImageCrossfade
        images={aboutValuesImages}
        className="absolute inset-0 opacity-40"
        intervalMs={6000}
        kenBurns
        imageClassName="object-cover object-[center_30%]"
      />
      <div className="about-section-veil absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 85% 20%, rgba(176,16,48,0.28), transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-gold-soft uppercase">
            {values.kicker}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold md:text-5xl lg:text-6xl">
            {values.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-white/75">{values.subtitle}</p>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <ProvisionalBadge className="bg-white/10 text-uwb-gold-soft" />
            <span>{values.provisionalNote}</span>
          </p>
        </Reveal>

        <div className="mt-16 space-y-0">
          {values.items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <article
                className={`grid gap-6 border-t border-white/15 py-10 md:grid-cols-12 md:items-baseline md:gap-10 ${
                  i === values.items.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="md:col-span-1">
                  <span className="font-display text-3xl text-uwb-red/90 md:text-4xl">
                    0{i + 1}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-3xl font-semibold text-uwb-gold-soft md:text-4xl">
                      {item.label}
                    </h3>
                    {item.provisional ? (
                      <ProvisionalBadge className="bg-white/10 text-uwb-gold-soft" />
                    ) : null}
                  </div>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-white/80 md:col-span-8 md:text-lg">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
