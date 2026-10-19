import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as authApi from '../../api/auth'
import { useAuth } from '../../auth/AuthContext'
import { site } from '../../data/site'
import { ApiError } from '../../lib/api'
import type { PersonPublic } from '../../lib/types'
import { PortalAlert } from './PortalAlert'
import { PortalCard } from './PortalCard'
import type { PortalRole } from './PortalShell'
import { portalUi } from './portalTheme'

export function PortalHomeContent({ role }: { role: PortalRole }) {
  const { user, isStudent, isTeacher } = useAuth()
  const [person, setPerson] = useState<PersonPublic | null>(null)
  const [personStatus, setPersonStatus] = useState<
    'loading' | 'ok' | 'missing' | 'error'
  >('loading')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mePerson = await authApi.fetchMePerson()
        if (!cancelled) {
          setPerson(mePerson)
          setPersonStatus('ok')
        }
      } catch (err) {
        if (!cancelled) {
          setPerson(null)
          if (err instanceof ApiError && err.status === 404) {
            setPersonStatus('missing')
          } else {
            setPersonStatus('error')
          }
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const spaceTitle =
    role === 'student' ? 'Espace étudiant' : 'Espace enseignant'
  const displayName = person
    ? `${person.first_name} ${person.last_name}`
    : user?.full_name || 'Bienvenue'

  const alsoOther =
    (role === 'student' && isTeacher) || (role === 'teacher' && isStudent)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#B91C2B] uppercase">
          {spaceTitle}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#1F2937]">
          {displayName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">
          Session SIGU active.{" "}
          {role === 'student'
            ? 'Consultez votre dossier universitaire (inscriptions annuelles). Les notes et l’e-learning SIGU ne sont pas disponibles ici.'
            : 'Espace réservé à l’identité et aux liens institutionnels. Aucun outil pédagogique (notes, cours, délibérations) n’est proposé dans SIGU pour l’instant.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PortalCard title="Compte">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                E-mail
              </dt>
              <dd className="mt-0.5 text-[#1F2937]">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                Rôles
              </dt>
              <dd className="mt-0.5 text-[#1F2937]">
                {user?.roles.join(', ')}
              </dd>
            </div>
          </dl>
        </PortalCard>

        <PortalCard title="Fiche Person">
          {personStatus === 'loading' ? (
            <p className="text-sm text-[#6B7280]" role="status">
              Chargement de votre fiche…
            </p>
          ) : null}
          {personStatus === 'ok' && person ? (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                  Identité
                </dt>
                <dd className="mt-0.5 text-[#1F2937]">
                  {person.first_name} {person.last_name}
                </dd>
              </div>
              {person.email ? (
                <div>
                  <dt className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                    Contact
                  </dt>
                  <dd className="mt-0.5 text-[#1F2937]">{person.email}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          {personStatus === 'missing' ? (
            <PortalAlert tone="info">
              Aucune fiche liée. Contactez l’administration pour associer votre
              identité.
            </PortalAlert>
          ) : null}
          {personStatus === 'error' ? (
            <PortalAlert tone="error">
              Impossible de charger la fiche Person. Réessayez plus tard.
            </PortalAlert>
          ) : null}
        </PortalCard>
      </div>

      <PortalCard
        title="Services disponibles"
        description="Liens vers des ressources déjà en place. Aucune fonctionnalité non implémentée n’est proposée ici."
      >
        <ul className="space-y-3 text-sm">
          {role === 'student' ? (
            <li>
              <Link to="/espace-etudiant/dossier" className={portalUi.link}>
                Consulter mon dossier universitaire →
              </Link>
            </li>
          ) : null}
          <li>
            <Link to="/bibliotheque" className={portalUi.link}>
              Bibliothèque virtuelle du site →
            </Link>
          </li>
          {site.officialElearningUrl ? (
            <li>
              <a
                href={site.officialElearningUrl}
                target="_blank"
                rel="noreferrer"
                className={portalUi.link}
              >
                E-Learning officiel →
              </a>
            </li>
          ) : null}
          {alsoOther ? (
            <li>
              <Link
                to={
                  role === 'student'
                    ? '/espace-enseignant'
                    : '/espace-etudiant'
                }
                className={portalUi.link}
              >
                {role === 'student'
                  ? 'Ouvrir l’espace enseignant →'
                  : 'Ouvrir l’espace étudiant →'}
              </Link>
            </li>
          ) : null}
        </ul>
      </PortalCard>
    </div>
  )
}
