import { useEffect, useState } from 'react'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import { AdmissionForm } from '../components/admissions/AdmissionForm'
import { AdmissionRequirements } from '../components/admissions/AdmissionRequirements'
import { AdmissionSteps } from '../components/admissions/AdmissionSteps'
import { AdmissionsContactForm } from '../components/admissions/AdmissionsContactForm'
import { AdmissionsFAQ } from '../components/admissions/AdmissionsFAQ'
import { AdmissionsFinalCta } from '../components/admissions/AdmissionsFinalCta'
import { AdmissionsHero } from '../components/admissions/AdmissionsHero'
import { ApplicantPathways } from '../components/admissions/ApplicantPathways'
import { DocumentsChecklist } from '../components/admissions/DocumentsChecklist'
import { FormationPicker } from '../components/admissions/FormationPicker'
import { TuitionInformation } from '../components/admissions/TuitionInformation'
import { Reveal } from '../components/motion/Reveal'
import { Button } from '../components/ui/Button'
import { ProvisionalBadge } from '../components/ui/ProvisionalBadge'
import { admissionsCopy } from '../data/admissions'
import { site } from '../data/site'

export function AdmissionsPage() {
  const [reference, setReference] = useState<string | null>(null)
  const { form } = admissionsCopy

  useEffect(() => {
    const previous = document.title
    document.title = 'Admissions et inscriptions · Université William Booth'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div>
      <AdmissionsHero />
      <ApplicantPathways />
      <AdmissionSteps />
      <AdmissionRequirements />
      <DocumentsChecklist />
      <FormationPicker />
      <TuitionInformation />
      <AdmissionsFAQ />
      <AdmissionsContactForm />

      <section
        id="formulaire-inscription"
        className="scroll-mt-28 border-t border-black/5 bg-uwb-surface py-16 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_18rem] lg:gap-16">
            <div>
              {reference ? (
                <Reveal>
                  <div className="border border-uwb-red/20 bg-white p-8 sm:p-12">
                    <CheckCircle2 className="h-10 w-10 text-uwb-red" />
                    <h2 className="mt-6 font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
                      {form.successTitle}
                    </h2>
                    <p className="mt-4 text-uwb-muted">{form.successText}</p>
                    <p className="mt-6 font-display text-3xl font-semibold tracking-wide text-uwb-red">
                      {reference}
                    </p>
                    <p className="mt-6 text-sm leading-relaxed text-uwb-muted">
                      {form.note}
                    </p>
                    <p className="mt-3 text-sm text-uwb-muted">
                      {form.defaultPasswordNote}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button
                        href={site.officialInscriptionUrl}
                        className="rounded-none"
                      >
                        {form.officialCta}
                      </Button>
                      <Button to="/facultes" variant="ghost" className="rounded-none">
                        Explorer les facultés
                      </Button>
                      <button
                        type="button"
                        className="text-sm font-semibold text-uwb-red underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-uwb-red/40"
                        onClick={() => setReference(null)}
                      >
                        Nouveau brouillon
                      </button>
                    </div>
                  </div>
                </Reveal>
              ) : (
                <>
                  <Reveal>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
                        {form.kicker} · {form.year}
                      </p>
                      <ProvisionalBadge />
                    </div>
                    <h2 className="mt-3 font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
                      {form.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-uwb-muted">
                      {form.intro}
                    </p>
                    <p className="mt-3 text-xs text-uwb-muted">{form.demoNote}</p>
                    <a
                      href={site.officialInscriptionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-uwb-red outline-none hover:underline focus-visible:ring-2 focus-visible:ring-uwb-red/40"
                    >
                      {form.officialCta}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </Reveal>
                  <div className="mt-10 rounded-none border border-black/8 bg-white p-5 sm:p-8">
                    <AdmissionForm onSuccess={setReference} />
                  </div>
                </>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="border border-black/8 bg-white p-6">
                <h3 className="font-display text-xl font-semibold text-uwb-navy">
                  Canaux officiels
                </h3>
                <p className="mt-2 text-sm text-uwb-muted">{form.contactIntro}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>
                    <a
                      href={site.officialInscriptionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-uwb-red hover:underline"
                    >
                      Formulaire uwbcongo.org
                    </a>
                  </li>
                  <li>
                    <a
                      href={site.officialInscriptionFormUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-uwb-red hover:underline"
                    >
                      Canal inscriptions en ligne
                    </a>
                  </li>
                </ul>
              </div>
              <img
                src="/media/uwb/life/formation.jpg"
                alt="Amphithéâtre — étudiants Université William Booth"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </aside>
          </div>
        </div>
      </section>

      <AdmissionsFinalCta />
    </div>
  )
}
