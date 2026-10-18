import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as authApi from '../api/auth'
import { PortalAlert } from '../components/portal/PortalAlert'
import { PortalCard } from '../components/portal/PortalCard'
import { PortalShell } from '../components/portal/PortalShell'
import { portalUi } from '../components/portal/portalTheme'
import { ApiError } from '../lib/api'
import type { DossierPublic } from '../lib/types'

export function StudentDossierPage() {
  const [dossier, setDossier] = useState<DossierPublic | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await authApi.fetchMeDossier()
        if (!cancelled) {
          setDossier(data)
          setStatus('ok')
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage(
            err instanceof ApiError ? err.message : 'Chargement impossible.',
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const person = dossier?.person
  const title = person
    ? `${person.first_name} ${person.last_name}`
    : 'Dossier universitaire'

  return (
    <PortalShell role="student" title="Espace étudiant">
      <div className="space-y-6">
        <div>
          <nav className="text-xs text-[#6B7280]" aria-label="Fil d’Ariane">
            <Link to="/espace-etudiant" className={portalUi.link}>
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#1F2937]">Dossier</span>
          </nav>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#1F2937]">
            Dossier universitaire
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">
            Consultation en lecture seule de votre identité SIGU. Les
            inscriptions et résultats seront ajoutés lorsque le modèle
            académique UWB sera validé — aucune donnée fictive.
          </p>
        </div>

        {status === 'loading' ? (
          <PortalAlert tone="info">Chargement du dossier…</PortalAlert>
        ) : null}

        {status === 'error' ? (
          <PortalAlert tone="error">{errorMessage}</PortalAlert>
        ) : null}

        {status === 'ok' && dossier ? (
          <>
            <PortalCard title="Identité">
              {person ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                      Nom complet
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-[#1F2937]">
                      {title}
                    </dd>
                  </div>
                  {person.email ? (
                    <div>
                      <dt className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                        E-mail (fiche)
                      </dt>
                      <dd className="mt-1 text-sm text-[#1F2937]">
                        {person.email}
                      </dd>
                    </div>
                  ) : null}
                  {person.phone ? (
                    <div>
                      <dt className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                        Téléphone
                      </dt>
                      <dd className="mt-1 text-sm text-[#1F2937]">
                        {person.phone}
                      </dd>
                    </div>
                  ) : null}
                  {person.birth_date ? (
                    <div>
                      <dt className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                        Date de naissance
                      </dt>
                      <dd className="mt-1 text-sm text-[#1F2937]">
                        {person.birth_date}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : (
                <PortalAlert tone="info">
                  Aucune fiche Person liée à votre compte. Contactez
                  l’administration.
                </PortalAlert>
              )}
            </PortalCard>

            <PortalCard title="Parcours académique">
              <PortalAlert tone="info">
                {dossier.academic.message}
              </PortalAlert>
              {dossier.academic.enrollments.length === 0 ? (
                <p className="mt-4 text-sm text-[#6B7280]">
                  Aucune inscription enregistrée pour le moment.
                </p>
              ) : null}
            </PortalCard>
          </>
        ) : null}
      </div>
    </PortalShell>
  )
}
