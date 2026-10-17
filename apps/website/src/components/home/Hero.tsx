import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Play } from 'lucide-react'
import { homeCopy } from '../../data/homeCopy'
import { site } from '../../data/site'
import { Button } from '../ui/Button'
import { CinematicBackground } from './CinematicBackground'

export function Hero() {
  const copy = homeCopy.hero
  const reduced = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-uwb-navy text-white">
      <CinematicBackground />
      <div className="hero-veil absolute inset-0" />
      <div className="film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-40 sm:px-8 lg:pb-24">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-6 text-[11px] font-medium tracking-[0.35em] text-white/70 uppercase"
        >
          {site.shortName} · {site.city} · {site.motto}
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl font-display text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          {copy.headline}
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.48 }}
          className="mt-7 max-w-xl text-base font-light leading-relaxed text-white/85 sm:text-lg"
        >
          {copy.supporting}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.62 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button
            to={copy.primaryCta.to}
            size="lg"
            className="rounded-none bg-uwb-red px-8 text-white hover:bg-uwb-red-dark"
          >
            {copy.primaryCta.label}
          </Button>
          <a
            href={copy.secondaryCta.href}
            className="inline-flex items-center gap-3 text-sm font-medium tracking-wide text-white transition hover:text-white/70"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40">
              <Play className="ml-0.5 h-4 w-4" />
            </span>
            {copy.secondaryCta.label}
          </a>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 flex items-center justify-between gap-6 border-t border-white/15 pt-6"
        >
          <p className="max-w-md text-[11px] leading-relaxed text-white/45">
            Photographies et immersion vidéo du campus — archives officielles
            Université William Booth.
          </p>
          <a
            href="#anniversaire-30"
            className="hidden items-center gap-2 text-[11px] tracking-[0.25em] text-white/70 uppercase sm:inline-flex"
          >
            Défiler
            <ChevronDown className={reduced ? 'h-4 w-4' : 'h-4 w-4 animate-bounce'} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
