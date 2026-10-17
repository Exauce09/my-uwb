import { aboutIdentityImages } from '../../data/aboutMedia'
import { presentation } from '../../data/presentation'
import { Reveal } from '../motion/Reveal'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'
import { ImageCrossfade } from './ImageCrossfade'

export function AboutIdentity() {
  const { identity } = presentation.about

  return (
    <section id="identite" className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {identity.kicker}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] text-uwb-navy md:text-5xl lg:text-[3.25rem]">
            {identity.title}
          </h2>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-uwb-muted">
            <ProvisionalBadge />
            <span>{identity.provisionalNote}</span>
          </p>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-uwb-muted md:text-lg">
            {identity.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 border-l-2 border-uwb-red/40 pl-4 text-sm leading-relaxed text-uwb-muted">
            {identity.officialNote}
          </p>
          <p className="mt-6 text-[11px] text-uwb-muted/70">
            Source :{' '}
            <a
              href={presentation.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-uwb-red/40 underline-offset-2 hover:text-uwb-red"
            >
              {presentation.sourceLabel}
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.12} className="relative lg:col-span-7">
          <div
            className="absolute -top-4 -left-4 hidden h-24 w-24 border border-uwb-red/25 lg:block"
            aria-hidden
          />
          <div
            className="absolute -right-3 -bottom-3 hidden h-32 w-32 border border-uwb-navy/10 lg:block"
            aria-hidden
          />
          <figure className="relative">
            <ImageCrossfade
              images={aboutIdentityImages}
              className="aspect-[5/4] w-full"
              intervalMs={5000}
              kenBurns
              showCredit
              creditClassName="mt-3 text-[11px] text-uwb-muted"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
