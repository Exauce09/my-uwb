import { aboutStudentsImages } from '../../data/aboutMedia'
import { presentation } from '../../data/presentation'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'
import { ImageCrossfade } from './ImageCrossfade'

export function AboutStudents() {
  const { students } = presentation.about
  const { appointments } = presentation

  return (
    <section className="bg-uwb-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
              {students.kicker}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-uwb-navy md:text-5xl">
              {students.title}
            </h2>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-uwb-muted">
              <ProvisionalBadge />
              <span>{students.provisionalNote}</span>
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-uwb-muted md:text-lg">
              {students.text}
            </p>
            <div className="mt-8">
              <Button to="/facultes" size="lg" className="rounded-none">
                {students.cta}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-5 sm:grid-rows-2">
              <figure className="relative overflow-hidden sm:col-span-3 sm:row-span-2">
                <ImageCrossfade
                  images={aboutStudentsImages}
                  className="aspect-[4/5] h-full min-h-[18rem] w-full sm:aspect-auto"
                  intervalMs={5000}
                  kenBurns
                />
              </figure>
              <div className="border border-black/8 bg-white p-6 sm:col-span-2 sm:row-span-2 sm:flex sm:flex-col sm:justify-center lg:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-semibold tracking-[0.25em] text-uwb-red uppercase">
                    {students.appointmentsTitle}
                  </p>
                  <ProvisionalBadge />
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold text-uwb-navy">
                  {appointments.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-uwb-muted">
                  {appointments.intro}
                </p>
                <ul className="mt-6 space-y-3">
                  {appointments.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-uwb-navy">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-uwb-red"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  to="/contact"
                  variant="ghost"
                  className="mt-8 rounded-none self-start"
                >
                  Prendre contact
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
