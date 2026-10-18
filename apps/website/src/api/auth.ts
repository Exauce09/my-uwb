import { apiRequest, setAccessToken } from '../lib/api'
import type {
  DossierPublic,
  PersonPublic,
  TokenResponse,
  UserPublic,
} from '../lib/types'

export async function login(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const result = await apiRequest<TokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
    token: null,
  })
  setAccessToken(result.access_token)
  return result
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>('/api/v1/auth/logout', { method: 'POST' })
  } finally {
    setAccessToken(null)
  }
}

export async function fetchMe(): Promise<UserPublic> {
  return apiRequest<UserPublic>('/api/v1/auth/me')
}

/** Fiche Person liée au compte — 404 si absente. */
export async function fetchMePerson(): Promise<PersonPublic> {
  return apiRequest<PersonPublic>('/api/v1/auth/me/person')
}

/** Dossier étudiant (identité réelle + section académique non provisionnée). */
export async function fetchMeDossier(): Promise<DossierPublic> {
  return apiRequest<DossierPublic>('/api/v1/auth/me/dossier')
}
