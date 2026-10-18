import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { site } from '../data/site'

export function TeacherPortalPage() {
  const { user, logout, isStudent } = useAuth()

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Espace enseignant"
        title={user?.full_name || 'Bienvenue'}
        description="Votre session SIGU est active. Saisie des notes, listes de cours et outils pédagogiques seront branchés ici au fil des modules."
      />

      <dl className="mb-10 grid gap-4 border border-black/8 bg-uwb-surface p-6 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold tracking-[0.2em] text-uwb-muted uppercase">
            E-mail
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
      </dl>

      <ul className="mb-10 space-y-3 text-sm text-uwb-muted">
        <li>
          · Outils pédagogiques SIGU : en cours d’intégration (pas encore de
          saisie métier sur ce portail).
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
          <Link to="/bibliotheque" className="font-semibold text-uwb-red hover:underline">
            Bibliothèque virtuelle du site →
          </Link>
        </li>
        {isStudent ? (
          <li>
            · Vous avez aussi le rôle étudiant :{' '}
            <Link
              to="/espace-etudiant"
              className="font-semibold text-uwb-red hover:underline"
            >
              ouvrir l’espace étudiant →
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
