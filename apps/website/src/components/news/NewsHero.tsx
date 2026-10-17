import { motion, useReducedMotion } from 'motion/react'
import { newsCopy } from '../../data/newsCategories'
import { uwbMedia } from '../../data/media'
import { Button } from '../ui/Button'

export function NewsHero() {
  const reduced = useReducedMotion()
  const { hero } = newsCopy

  return (
    <section className="relative isolate overflow-hidden bg-uwb-navy text-white">
      <img
        src={uwbMedia.carousel[0]}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover object-center ${
          reduced ? '' : 'ken-burns'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-uwb-navy/75 via-uwb-navy/50 to-uwb-navy/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy/55 via-transparent to-uwb-navy/20" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-semibold tracking-[0.3em] text-uwb-gold-soft uppercase"
        >
          {hero.kicker}
        </motion.p>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
        >
          {hero.title}
        </motion.h1>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="mt-4 max-w-xl text-base text-white/80"
        >
          {hero.intro}
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="mt-8"
        >
          <Button
            type="button"
            size="lg"
            className="rounded-none"
            onClick={() =>
              document
                .getElementById('actualites-liste')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {hero.cta}
          </Button>
        </motion.div>
        <p className="mt-6 text-[10px] tracking-wide text-white/45">
          {hero.imageCredit}
        </p>
      </div>
    </section>
  )
}
