import {
  BookOpenCheck,
  ClipboardList,
  FileStack,
  FormInput,
  ListChecks,
  BadgeCheck,
} from 'lucide-react'
import {
  admissionProcessSteps,
  admissionsCopy,
} from '../../data/admissions'
import { Reveal } from '../motion/Reveal'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'

const stepIcons = [
  BookOpenCheck,
  ClipboardList,
  FileStack,
  FormInput,
  ListChecks,
  BadgeCheck,
]

export function AdmissionSteps() {
  const { steps } = admissionsCopy

  return (
    <section
      id="etapes-admission"
      className="scroll-mt-28 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
              {steps.kicker}
            </p>
            <ProvisionalBadge />
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {steps.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {steps.intro}
          </p>
          <p className="mt-2 text-xs text-uwb-muted/80">{steps.provisionalNote}</p>
        </Reveal>

        <ol className="relative mt-12 space-y-0 lg:space-y-0">
          <div
            className="pointer-events-none absolute top-6 bottom-6 left-[1.35rem] hidden w-px bg-gradient-to-b from-uwb-red/40 via-uwb-red/15 to-transparent md:left-[1.6rem] lg:block"
            aria-hidden
          />
          {admissionProcessSteps.map((step, i) => {
            const Icon = stepIcons[i] ?? ListChecks
            return (
              <Reveal key={step.id} delay={Math.min(i * 0.05, 0.3)}>
                <li className="relative grid gap-4 border-b border-black/5 py-8 last:border-0 md:grid-cols-[auto_1fr] md:gap-8">
                  <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                    <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center border border-uwb-red/25 bg-uwb-red/[0.06] text-uwb-red">
                      <Icon className="h-5 w-5" aria-hidden strokeWidth={1.5} />
                    </span>
                    <span className="font-display text-3xl font-semibold text-uwb-red/20 md:text-4xl">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-uwb-navy md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-uwb-muted">
                      {step.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
