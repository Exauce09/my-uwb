import { motion, useReducedMotion } from 'motion/react'
import { admissionsCopy } from '../../data/admissions'
import { uwbMedia } from '../../data/media'
import { Button } from '../ui/Button'

export function AdmissionsHero() {
  const reduced = useReducedMotion()
  const { hero } = admissionsCopy

  return (
    <section className="relative isolate overflow-hidden bg-uwb-navy text-white">
      <img
        src={uwbMedia.news.affiche}
        alt={hero.imageAlt}
        className={`absolute inset-0 h-full w-full object-cover object-[center_20%] ${
          reduced ? '' : 'ken-burns'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-uwb-navy via-uwb-navy/88 to-uwb-navy/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy/70 via-transparent to-uwb-navy/30" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-semibold tracking-[0.3em] text-uwb-gold-soft uppercase"
        >
          {hero.kicker}
        </motion.p>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
        >
          {hero.title}
        </motion.h1>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="mt-4 max-w-2xl text-base text-white/80 md:text-lg"
        >
          {hero.intro}
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button to="/facultes" size="lg" className="rounded-none">
            {hero.ctaFormations}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-none"
            onClick={() =>
              document
                .getElementById('etapes-admission')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {hero.ctaSteps}
          </Button>
        </motion.div>
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 text-xs text-white/45"
        >
          {hero.imageCredit}
        </motion.p>
      </div>
    </section>
  )
}
