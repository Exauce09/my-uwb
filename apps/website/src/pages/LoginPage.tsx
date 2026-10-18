import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  hasPortalAccess,
  isAdminOnly,
  resolveSafePortalDestination,
} from '../auth/portalHome'
import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ApiError } from '../lib/api'
import { API_BASE_URL, SIGU_ADMIN_URL } from '../lib/config'

export function LoginPage() {
  const { user, loading, login, logout } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [error, setError] = useState<string | null>(null)
  const [adminHint, setAdminHint] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user && hasPortalAccess(user)) {
    return (
      <Navigate to={resolveSafePortalDestination(user.roles, next)} replace />
    )
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return

    const nextErrors: typeof fieldErrors = {}
    if (!email.trim()) nextErrors.email = 'L’e-mail est obligatoire.'
    if (password.length < 8) {
      nextErrors.password =
        'Le mot de passe doit contenir au moins 8 caractères.'
    }
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    setError(null)
    setAdminHint(false)
    try {
      const me = await login(email.trim(), password)
      if (isAdminOnly(me) || !hasPortalAccess(me)) {
        await logout()
        if (isAdminOnly(me)) {
          setAdminHint(true)
          setError(
            'Ce compte est administrateur. Utilisez l’application SIGU admin, pas le portail public.',
          )
        } else {
          setError(
            'Ce compte n’a pas le rôle étudiant ou enseignant. Contactez l’administration.',
          )
        }
        return
      }
      navigate(resolveSafePortalDestination(me.roles, next), { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Connexion impossible.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Portail UWB"
        title="Connexion"
        description="Étudiants et enseignants : connectez-vous avec l’e-mail et le mot de passe fournis par l’administration (SIGU)."
      />

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <div>
          <label
            htmlFor="portal-email"
            className="mb-1.5 block text-xs font-semibold tracking-[0.12em] text-uwb-muted uppercase"
          >
            E-mail
          </label>
          <input
            id="portal-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            required
            className="w-full border border-black/15 bg-white px-4 py-3 text-sm text-uwb-blue outline-none transition focus:border-uwb-red"
          />
          {fieldErrors.email ? (
            <p className="mt-1.5 text-xs text-uwb-red">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="portal-password"
            className="mb-1.5 block text-xs font-semibold tracking-[0.12em] text-uwb-muted uppercase"
          >
            Mot de passe
          </label>
          <input
            id="portal-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            required
            minLength={8}
            className="w-full border border-black/15 bg-white px-4 py-3 text-sm text-uwb-blue outline-none transition focus:border-uwb-red"
          />
          {fieldErrors.password ? (
            <p className="mt-1.5 text-xs text-uwb-red">{fieldErrors.password}</p>
          ) : null}
        </div>

        {error ? (
          <div
            className="border border-uwb-red/25 bg-uwb-gold-soft/40 px-4 py-3 text-sm text-uwb-red"
            role="alert"
          >
            {error}
            {adminHint ? (
              <p className="mt-2">
                <a
                  href={SIGU_ADMIN_URL}
                  className="font-semibold underline underline-offset-2"
                >
                  Ouvrir SIGU admin →
                </a>
              </p>
            ) : null}
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full rounded-none"
          disabled={submitting}
        >
          {submitting ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>

      <p className="mt-8 text-xs text-uwb-muted">
        Après connexion :{' '}
        <Link to="/espace-etudiant" className="text-uwb-red hover:underline">
          espace étudiant
        </Link>
        {' · '}
        <Link to="/espace-enseignant" className="text-uwb-red hover:underline">
          espace enseignant
        </Link>
        . Les comptes admin restent sur{' '}
        <a href={SIGU_ADMIN_URL} className="text-uwb-red hover:underline">
          sigu-web
        </a>
        .
      </p>
      <p className="mt-3 text-[11px] text-uwb-muted/80">
        API : <code>{API_BASE_URL}</code>
      </p>
    </div>
  )
}
