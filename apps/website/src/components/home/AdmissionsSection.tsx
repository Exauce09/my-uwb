import { homeCopy } from '../../data/homeCopy'
import { uwbMedia } from '../../data/media'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

export function AdmissionsSection() {
  const copy = homeCopy.admissions

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={uwbMedia.carousel[2]}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-uwb-navy/80" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-24 text-white sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-32">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-white/70 uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold md:text-5xl lg:text-6xl">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-lg text-base text-white/80">{copy.intro}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              to="/admissions"
              size="lg"
              className="rounded-none bg-uwb-red hover:bg-uwb-red-dark"
            >
              {copy.cta}
            </Button>
            <Button
              to="/facultes"
              size="lg"
              variant="ghost"
              className="rounded-none border border-white text-white hover:bg-white hover:text-uwb-blue"
            >
              Voir les formations
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
