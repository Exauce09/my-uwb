import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { presentation } from '../../data/presentation'
import { site } from '../../data/site'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

export function UniversitySection() {
  return (
    <section id="universite" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="editorial-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <Reveal className="lg:col-span-5 lg:col-start-1">
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-uwb-red uppercase">
            L’université
          </p>
          <h2 className="font-display text-4xl leading-tight font-semibold text-uwb-blue text-balance md:text-5xl">
            Une institution à Gombe, au service de la formation
          </h2>
          <p className="mt-6 text-base leading-relaxed text-uwb-muted md:text-lg">
            {presentation.intro[0]}
          </p>
          <p className="mt-4 text-base leading-relaxed text-uwb-muted md:text-lg">
            {presentation.intro[1]} Sa devise est « {site.motto} ».
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/presentation" variant="secondary">
              Lire la présentation
            </Button>
            <Link
              to="/presentation"
              className="inline-flex items-center gap-1 text-sm font-semibold text-uwb-red transition hover:gap-2"
            >
              Qui sommes-nous ?
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.12}>
          <figure className="relative">
            <div className="absolute -top-4 -right-4 hidden h-full w-full border border-uwb-gold/40 md:block" />
            <img
              src="/media/carousel/carousel-2.jpg"
              alt="Université William Booth — image issue du site officiel"
              className="relative aspect-[4/5] w-full object-cover shadow-2xl shadow-uwb-blue/15"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[11px] tracking-wide text-uwb-muted">
              Photo issue du site officiel uwbcongo.org — ne remplace pas une
              capturing officielle du campus si une autre ressource est fournie.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
