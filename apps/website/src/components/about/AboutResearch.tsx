import { BookOpen, FileText, Library, Share2, GraduationCap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { aboutResearchImages } from '../../data/aboutMedia'
import { presentation } from '../../data/presentation'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'
import { ImageCrossfade } from './ImageCrossfade'

const pointIcons: LucideIcon[] = [
  BookOpen,
  GraduationCap,
  FileText,
  Share2,
  Library,
]

export function AboutResearch() {
  const { research } = presentation.about

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <figure>
            <div className="relative overflow-hidden">
              <ImageCrossfade
                images={aboutResearchImages}
                className="aspect-[4/5] w-full"
                intervalMs={5400}
                kenBurns
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-uwb-navy/20 to-transparent"
                aria-hidden
              />
            </div>
            <figcaption className="mt-3 text-[11px] text-uwb-muted">
              Sciences, documentation et savoir — médias UWB
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {research.kicker}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-uwb-navy md:text-5xl">
            {research.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-uwb-muted md:text-lg">
            {research.intro}
          </p>

          <ul className="mt-10 space-y-4">
            {research.points.map((point, i) => {
              const Icon = pointIcons[i] ?? BookOpen
              return (
                <li key={point} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-uwb-red/25 text-uwb-red">
                    <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="pt-1.5 text-sm font-medium text-uwb-navy md:text-base">
                    {point}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button to="/bibliotheque" className="rounded-none">
              {research.ctaLibrary}
            </Button>
            <Button
              to="/publications"
              variant="ghost"
              className="rounded-none"
            >
              {research.ctaPublications}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
