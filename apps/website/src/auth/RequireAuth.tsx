import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from './AuthContext'

type Props = {
  /** Rôle E1 requis (student | teacher). */
  role: 'student' | 'teacher'
}

export function RequireAuth({ role }: Props) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div
        className="mx-auto max-w-7xl px-5 py-20 text-sm text-uwb-muted sm:px-8"
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
      <div className="mx-auto max-w-xl px-5 py-20 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-uwb-red uppercase">
          Accès refusé
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-uwb-blue">
          Espace réservé
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-uwb-muted">
          Ce portail exige le rôle « {role === 'student' ? 'étudiant' : 'enseignant'} ».
          Votre compte ({user.email}) n’y a pas accès.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/connexion" className="rounded-none">
            Changer de compte
          </Button>
          <Button to="/" variant="ghost" className="rounded-none">
            Accueil
          </Button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
