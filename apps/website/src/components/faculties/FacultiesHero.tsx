import { motion, useReducedMotion } from 'motion/react'
import { Search } from 'lucide-react'
import { facultyCopy } from '../../data/facultyCopy'
import { uwbMedia } from '../../data/media'
import { Button } from '../ui/Button'

type Props = {
  query: string
  onQuery: (v: string) => void
}

export function FacultiesHero({ query, onQuery }: Props) {
  const reduced = useReducedMotion()
  const { hero } = facultyCopy

  return (
    <section className="relative isolate overflow-hidden bg-uwb-navy text-white">
      <img
        src={uwbMedia.carousel[0]}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${
          reduced ? '' : 'ken-burns'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-uwb-navy/80 via-uwb-navy/55 to-uwb-navy/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-uwb-navy/60 via-transparent to-uwb-navy/25" />

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
          className="mt-4 max-w-2xl text-base text-white/80"
        >
          {hero.intro}
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button
            type="button"
            size="lg"
            className="rounded-none"
            onClick={() =>
              document
                .getElementById('facultes-liste')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {hero.ctaFaculties}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-none"
            onClick={() =>
              document
                .getElementById('catalogue-formations')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {hero.ctaFormations}
          </Button>
        </motion.div>

        <motion.label
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          className="relative mt-10 block max-w-2xl"
        >
          <span className="sr-only">Rechercher une formation</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-uwb-navy/50"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={hero.searchPlaceholder}
            className="w-full border border-white/20 bg-white py-3.5 pr-4 pl-11 text-sm text-uwb-navy outline-none placeholder:text-uwb-muted/60 focus:ring-2 focus:ring-uwb-red/30"
          />
        </motion.label>
        <p className="mt-4 text-[10px] tracking-wide text-white/45">
          {hero.imageCredit}
        </p>
      </div>
    </section>
  )
}
