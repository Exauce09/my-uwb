import {
  aboutCampusPrimary,
  aboutCampusSecondary,
} from '../../data/aboutMedia'
import { presentation } from '../../data/presentation'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'
import { ImageCrossfade } from './ImageCrossfade'

export function AboutCampusLife() {
  const { campus } = presentation.about

  return (
    <section className="bg-uwb-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
              {campus.kicker}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-uwb-navy md:text-5xl">
              {campus.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-uwb-muted md:text-lg">
              {campus.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/facultes" className="rounded-none">
                {campus.linkFormations}
              </Button>
              <Button to="/actualites" variant="ghost" className="rounded-none">
                {campus.linkNews}
              </Button>
            </div>
            <p className="mt-6 text-[11px] text-uwb-muted/70">{campus.imageNote}</p>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            <Reveal className="sm:col-span-2">
              <figure className="relative overflow-hidden">
                <ImageCrossfade
                  images={aboutCampusPrimary}
                  className="aspect-[16/10] w-full"
                  intervalMs={4800}
                  kenBurns
                />
                <figcaption className="absolute right-0 bottom-0 left-0 z-10 bg-gradient-to-t from-black/65 to-transparent px-4 py-3 text-[11px] text-white/90">
                  Formation & vie universitaire — photos officielles UWB
                </figcaption>
              </figure>
            </Reveal>
            {aboutCampusSecondary.map((shot, i) => (
              <Reveal key={shot.src} delay={0.08 + i * 0.06}>
                <figure className="group relative overflow-hidden">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <figcaption className="mt-2 text-[11px] text-uwb-muted">
                    {shot.credit}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
