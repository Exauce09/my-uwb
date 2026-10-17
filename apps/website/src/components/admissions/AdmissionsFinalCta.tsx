import { admissionsCopy } from '../../data/admissions'
import { uwbMedia } from '../../data/media'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

export function AdmissionsFinalCta() {
  const { finalCta } = admissionsCopy

  return (
    <section className="relative isolate overflow-hidden bg-uwb-navy py-16 text-white lg:py-20">
      <img
        src={uwbMedia.news.conference}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-uwb-navy via-uwb-navy/90 to-uwb-navy/70" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="max-w-2xl font-display text-3xl font-semibold md:text-4xl lg:text-5xl">
            {finalCta.title}
          </h2>
          <p className="mt-4 max-w-xl text-sm text-white/75 md:text-base">
            {finalCta.text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/facultes" size="lg" className="rounded-none">
              {finalCta.ctaFormations}
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="rounded-none"
            >
              {finalCta.ctaContact}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
