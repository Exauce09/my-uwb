import { Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  hasPortalAccess,
  isAdminOnly,
  resolveSafePortalDestination,
} from '../auth/portalHome'
import { PortalAlert } from '../components/portal/PortalAlert'
import { portalUi } from '../components/portal/portalTheme'
import { ApiError } from '../lib/api'
import { SIGU_ADMIN_URL } from '../lib/config'
import { site } from '../data/site'

export function LoginPage() {
  const { user, loading, login, logout } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className={`${portalUi.page} flex flex-col`}>
      <div className="mx-auto grid w-full max-w-6xl flex-1 lg:grid-cols-2">
        {/* Formulaire en premier sur mobile */}
        <section className="order-1 flex flex-col justify-center px-5 py-10 sm:px-8 lg:order-2 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="mb-8 inline-flex items-center gap-3 lg:hidden">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-1 ring-[#E5E7EB]">
                <img
                  src={site.logoSrc}
                  alt=""
                  className="h-[82%] w-[82%] object-contain"
                />
              </span>
              <span className="text-sm font-semibold text-[#1F2937]">
                {site.shortName} · Portail
              </span>
            </Link>

            <p className="text-xs font-semibold tracking-[0.18em] text-[#B91C2B] uppercase">
              Connexion
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#1F2937]">
              Accéder à votre espace
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Étudiants et enseignants : utilisez l’e-mail et le mot de passe
              fournis par l’administration.
            </p>

            <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
              <div>
                <label htmlFor="portal-email" className={portalUi.label}>
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
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={
                    fieldErrors.email ? 'portal-email-error' : undefined
                  }
                  className={portalUi.input}
                />
                {fieldErrors.email ? (
                  <p id="portal-email-error" className={portalUi.errorText}>
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="portal-password" className={portalUi.label}>
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="portal-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                    required
                    minLength={8}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password ? 'portal-password-error' : undefined
                    }
                    className={`${portalUi.input} pr-12`}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-2 text-[#6B7280] transition hover:bg-[#FFF1F2] hover:text-[#B91C2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C2B]"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? 'Masquer le mot de passe'
                        : 'Afficher le mot de passe'
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p id="portal-password-error" className={portalUi.errorText}>
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

              {error ? (
                <PortalAlert tone="error">
                  {error}
                  {adminHint ? (
                    <p className="mt-2">
                      <a href={SIGU_ADMIN_URL} className={portalUi.link}>
                        Ouvrir SIGU admin →
                      </a>
                    </p>
                  ) : null}
                </PortalAlert>
              ) : null}

              <button
                type="submit"
                className={`${portalUi.btnPrimary} w-full`}
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-[#6B7280]">
              <Link to="/" className={portalUi.link}>
                Retour au site
              </Link>
            </p>
          </div>
        </section>

        {/* Panneau institutionnel — masqué sur mobile pour prioriser le formulaire */}
        <aside className="order-2 relative hidden overflow-hidden bg-[#861D27] text-white lg:order-1 lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-14 xl:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(255,255,255,0.25), transparent 55%)',
            }}
            aria-hidden
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/40">
                <img
                  src={site.logoSrc}
                  alt="Logo Université William Booth"
                  className="h-[82%] w-[82%] object-contain"
                />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
                  {site.shortName} · Kinshasa
                </p>
                <p className="font-display text-2xl font-semibold">
                  {site.name}
                </p>
              </div>
            </div>
            <h2 className="mt-12 font-display text-4xl leading-tight font-semibold">
              Portail numérique
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              Un accès sécurisé pour les étudiants et les enseignants —
              dossier, services et ressources de l’université, au fil des
              modules SIGU.
            </p>
          </div>
          <p className="relative text-xs tracking-[0.16em] text-white/55 uppercase">
            {site.motto}
          </p>
        </aside>
      </div>

      <footer className="border-t border-[#E5E7EB] bg-white px-5 py-4 text-center text-xs text-[#6B7280]">
        © {site.name} — portail étudiants &amp; enseignants
      </footer>
    </div>
  )
}
