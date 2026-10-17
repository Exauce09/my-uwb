import { CircleAlert } from 'lucide-react'
import { admissionsCopy, tuitionInformation } from '../../data/admissions'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'

export function TuitionInformation() {
  const { tuition } = admissionsCopy
  const info = tuitionInformation

  return (
    <section
      id="frais-admission"
      className="scroll-mt-28 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {tuition.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {tuition.title}
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <div className="flex flex-col gap-6 border border-black/8 bg-uwb-surface p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-10">
            <CircleAlert
              className="h-8 w-8 shrink-0 text-uwb-red"
              aria-hidden
              strokeWidth={1.5}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-relaxed text-uwb-muted md:text-base">
                {info.message}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-uwb-navy">
                {info.contactHint}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/contact" className="rounded-none">
                  Contacter l’université
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-none"
                  onClick={() =>
                    document
                      .getElementById('contact-admissions')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Demander des informations
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
