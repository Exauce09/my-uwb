import { ChevronDown } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { aboutHeroImages } from '../../data/aboutMedia'
import { presentation } from '../../data/presentation'
import { Button } from '../ui/Button'
import { ImageCrossfade } from './ImageCrossfade'

export function AboutHero() {
  const reduced = useReducedMotion()
  const { hero } = presentation.about

  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-uwb-navy text-white lg:min-h-[85svh]">
      <ImageCrossfade
        images={aboutHeroImages}
        className="absolute inset-0"
        intervalMs={5600}
        kenBurns
      />
      <div className="about-hero-veil absolute inset-0" />
      <div className="film-grain absolute inset-0 opacity-60" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-36 sm:px-8 lg:pb-24 lg:pt-44">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-[11px] font-semibold tracking-[0.32em] text-uwb-gold-soft uppercase"
        >
          {hero.kicker}
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-4xl font-display text-5xl leading-[1.02] font-semibold text-balance drop-shadow-sm sm:text-6xl lg:text-7xl"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg"
        >
          {hero.intro}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.48 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Button to="/facultes" size="lg" className="rounded-none">
            {hero.ctaFaculties}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-none"
            onClick={() =>
              document
                .getElementById('identite')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {hero.ctaExplore}
          </Button>
        </motion.div>

        <p className="mt-8 text-[10px] tracking-wide text-white/55">
          {hero.imageCredit}
        </p>
      </div>

      <motion.a
        href="#identite"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] tracking-[0.25em] text-white/60 uppercase transition hover:text-white"
        onClick={(e) => {
          e.preventDefault()
          document
            .getElementById('identite')
            ?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        {hero.scrollHint}
        <ChevronDown
          className={`h-4 w-4 ${reduced ? '' : 'animate-bounce'}`}
          aria-hidden
        />
      </motion.a>
    </section>
  )
}
