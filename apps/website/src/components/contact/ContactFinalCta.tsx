import { contactCopy } from '../../data/contact'
import { uwbMedia } from '../../data/media'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

export function ContactFinalCta() {
  const { finalCta } = contactCopy

  return (
    <section className="relative isolate overflow-hidden bg-uwb-navy py-16 text-white lg:py-20">
      <img
        src={uwbMedia.carousel[1]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-uwb-navy via-uwb-navy/90 to-uwb-navy/65" />
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
              to="/admissions"
              variant="outline"
              size="lg"
              className="rounded-none"
            >
              {finalCta.ctaAdmissions}
            </Button>
            <Button
              to="/actualites"
              variant="outline"
              size="lg"
              className="rounded-none"
            >
              {finalCta.ctaNews}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
