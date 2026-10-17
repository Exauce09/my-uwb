import { facultyCopy } from '../../data/facultyCopy'
import { uwbMedia } from '../../data/media'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

export function AdmissionsCallToAction() {
  const { admissions } = facultyCopy

  return (
    <section className="relative overflow-hidden bg-uwb-navy py-20 text-white lg:py-24">
      <img
        src={uwbMedia.news.affiche}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-25"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-uwb-navy/85 via-uwb-navy/70 to-uwb-navy/55" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-gold-soft uppercase">
            {admissions.kicker}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold md:text-4xl lg:text-5xl">
            {admissions.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/80">
            {admissions.text}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button to="/admissions" size="lg" className="rounded-none">
              {admissions.ctaAdmissions}
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="rounded-none"
            >
              {admissions.ctaContact}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
