import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PortalAlert } from '../components/portal/PortalAlert'
import { portalUi } from '../components/portal/portalTheme'
import { site } from '../data/site'
import { useAuth } from './AuthContext'

type Props = {
  /** Rôle E1 requis (student | teacher). */
  role: 'student' | 'teacher'
}

export function RequireAuth({ role }: Props) {
  const { user, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-white text-sm text-[#6B7280]"
        role="status"
        aria-live="polite"
      >
        Vérification de la session…
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to={`/connexion?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  if (!user.roles.includes(role)) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-1 ring-[#E5E7EB]">
            <img
              src={site.logoSrc}
              alt=""
              className="h-[82%] w-[82%] object-contain"
            />
          </span>
          <p className="text-sm font-semibold text-[#1F2937]">{site.shortName}</p>
        </div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#B91C2B] uppercase">
          Accès refusé
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[#1F2937]">
          Espace réservé
        </h1>
        <div className="mt-4">
          <PortalAlert tone="error">
            Ce portail exige le rôle «{' '}
            {role === 'student' ? 'étudiant' : 'enseignant'} ». Votre compte (
            {user.email}) n’y a pas accès.
          </PortalAlert>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className={portalUi.btnPrimary}
            onClick={() => {
              void logout().then(() => {
                window.location.assign('/connexion')
              })
            }}
          >
            Changer de compte
          </button>
          <a href="/" className={portalUi.btnSecondary}>
            Accueil du site
          </a>
        </div>
      </div>
    )
  }

  return <Outlet />
}
