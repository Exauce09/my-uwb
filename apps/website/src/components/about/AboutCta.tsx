import { motion, useReducedMotion } from 'motion/react'
import { aboutCtaImages } from '../../data/aboutMedia'
import { presentation } from '../../data/presentation'
import { Button } from '../ui/Button'
import { ImageCrossfade } from './ImageCrossfade'

export function AboutCta() {
  const reduced = useReducedMotion()
  const { cta } = presentation.about

  return (
    <section className="relative overflow-hidden bg-uwb-navy py-24 text-white lg:py-32">
      <ImageCrossfade
        images={aboutCtaImages}
        className="absolute inset-0"
        intervalMs={5500}
        kenBurns
      />
      <div className="absolute inset-0 bg-gradient-to-br from-uwb-navy/70 via-uwb-navy/55 to-uwb-navy/45" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(176,16,48,0.22), transparent 65%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-uwb-gold-soft to-transparent"
            aria-hidden
          />
          <h2 className="font-display text-4xl font-semibold leading-tight drop-shadow-sm md:text-5xl lg:text-6xl">
            {cta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            {cta.text}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button to="/facultes" size="lg" className="rounded-none">
              {cta.faculties}
            </Button>
            <Button
              to="/formations"
              variant="outline"
              size="lg"
              className="rounded-none"
            >
              {cta.formations}
            </Button>
            <Button
              to="/admissions"
              variant="outline"
              size="lg"
              className="rounded-none border-uwb-gold-soft/50 text-uwb-gold-soft hover:bg-uwb-gold-soft/10"
            >
              {cta.admissions}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
