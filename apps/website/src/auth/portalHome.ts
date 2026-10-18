import type { UserPublic } from '../lib/types'

/** Destinations internes autorisées après connexion (liste blanche stricte). */
export const PORTAL_ALLOWED_NEXT = {
  '/espace-etudiant': 'student',
  '/espace-etudiant/dossier': 'student',
  '/espace-enseignant': 'teacher',
} as const

export type PortalAllowedPath = keyof typeof PORTAL_ALLOWED_NEXT

/** Accueil portail selon les rôles E1 (student / teacher). */
export function portalHomeForRoles(roles: string[]): PortalAllowedPath | '/connexion' {
  const set = new Set(roles)
  if (set.has('student')) return '/espace-etudiant'
  if (set.has('teacher')) return '/espace-enseignant'
  return '/connexion'
}

export function hasPortalAccess(user: UserPublic | null): boolean {
  if (!user) return false
  return user.roles.includes('student') || user.roles.includes('teacher')
}

export function isAdminOnly(user: UserPublic): boolean {
  return user.roles.includes('admin') && !hasPortalAccess(user)
}

/**
 * Accepte uniquement les chemins exacts de la liste blanche.
 * Rejette protocol-relative (//…), URL absolues, antislashs, encodages ambigus.
 * Retourne le chemin normalisé (sans query/hash) ou null.
 */
export function parseSafePortalNext(
  raw: string | null | undefined,
): PortalAllowedPath | null {
  if (raw == null || typeof raw !== 'string') return null

  const trimmed = raw.trim()
  if (!trimmed) return null

  if (trimmed.includes('\\') || trimmed.includes('\0')) return null
  for (let i = 0; i < trimmed.length; i += 1) {
    const code = trimmed.charCodeAt(i)
    if (code < 32 || code === 127) return null
  }
  const lower = trimmed.toLowerCase()
  if (
    lower.includes('%2f') ||
    lower.includes('%5c') ||
    lower.includes('%00')
  ) {
    return null
  }
  if (trimmed.includes('://')) return null
  if (!trimmed.startsWith('/')) return null
  if (trimmed.startsWith('//')) return null
  if (trimmed.length > 1 && trimmed.includes('//')) return null

  const pathOnly = trimmed.split(/[?#]/, 1)[0] ?? ''
  if (pathOnly in PORTAL_ALLOWED_NEXT) {
    return pathOnly as PortalAllowedPath
  }
  return null
}

/**
 * Résout la destination post-login.
 * Si `next` est invalide ou non autorisé pour les rôles → accueil sûr du rôle.
 */
export function resolveSafePortalDestination(
  roles: string[],
  next: string | null | undefined,
): string {
  const fallback = portalHomeForRoles(roles)
  if (fallback === '/connexion') return fallback

  const safe = parseSafePortalNext(next)
  if (!safe) return fallback

  const requiredRole = PORTAL_ALLOWED_NEXT[safe]
  if (!roles.includes(requiredRole)) return fallback

  return safe
}
