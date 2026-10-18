import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as authApi from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { site } from '../data/site'
import { ApiError } from '../lib/api'
import type { PersonPublic } from '../lib/types'

export function StudentPortalPage() {
  const { user, logout, isTeacher } = useAuth()
  const [person, setPerson] = useState<PersonPublic | null>(null)
  const [personStatus, setPersonStatus] = useState<'loading' | 'ok' | 'missing'>(
    'loading',
  )

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
          setPersonStatus(
            err instanceof ApiError && err.status === 404 ? 'missing' : 'missing',
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const displayName = person
    ? `${person.first_name} ${person.last_name}`
    : user?.full_name || 'Bienvenue'

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Espace étudiant"
        title={displayName}
        description="Votre session SIGU est active. Les dossiers académiques, notes et finances seront branchés ici au fil des modules."
      />

      <dl className="mb-10 grid gap-4 border border-black/8 bg-uwb-surface p-6 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold tracking-[0.2em] text-uwb-muted uppercase">
            E-mail compte
          </dt>
          <dd className="mt-1 text-sm text-uwb-blue">{user?.email}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold tracking-[0.2em] text-uwb-muted uppercase">
            Rôles
          </dt>
          <dd className="mt-1 text-sm text-uwb-blue">
            {user?.roles.join(', ')}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[10px] font-semibold tracking-[0.2em] text-uwb-muted uppercase">
            Fiche Person
          </dt>
          <dd className="mt-1 text-sm text-uwb-blue">
            {personStatus === 'loading'
              ? 'Chargement…'
              : personStatus === 'ok' && person
                ? `${person.first_name} ${person.last_name}${
                    person.email ? ` · ${person.email}` : ''
                  }`
                : 'Aucune fiche liée — contactez l’administration.'}
          </dd>
        </div>
      </dl>

      <ul className="mb-10 space-y-3 text-sm text-uwb-muted">
        <li>
          · Inscriptions et dossier : bientôt via SIGU (aujourd’hui, liens
          officiels ci-dessous).
        </li>
        <li>
          ·{' '}
          <a
            href={site.officialElearningUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-uwb-red hover:underline"
          >
            E-Learning officiel →
          </a>
        </li>
        <li>
          ·{' '}
          <Link
            to="/bibliotheque"
            className="font-semibold text-uwb-red hover:underline"
          >
            Bibliothèque virtuelle du site →
          </Link>
        </li>
        {isTeacher ? (
          <li>
            · Vous avez aussi le rôle enseignant :{' '}
            <Link
              to="/espace-enseignant"
              className="font-semibold text-uwb-red hover:underline"
            >
              ouvrir l’espace enseignant →
            </Link>
          </li>
        ) : null}
      </ul>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          className="rounded-none"
          onClick={() => void logout()}
        >
          Se déconnecter
        </Button>
        <Button to="/" variant="ghost" className="rounded-none">
          Accueil du site
        </Button>
      </div>
    </div>
  )
}
