import { API_BASE_URL } from './config'
import type { ApiErrorBody } from './types'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function formatDetail(body: ApiErrorBody | null, fallback: string): string {
  if (!body?.detail) return fallback
  if (typeof body.detail === 'string') return body.detail
  if (Array.isArray(body.detail)) {
    return body.detail.map((item) => item.msg || 'Donnée invalide').join(' · ')
  }
  return fallback
}

let accessTokenMemory: string | null = null

export function setAccessToken(token: string | null): void {
  accessTokenMemory = token
}

export function getAccessToken(): string | null {
  return accessTokenMemory
}

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  signal?: AbortSignal
}

/**
 * Client HTTP : cookie httpOnly (credentials) + Bearer en mémoire.
 * Jamais de localStorage pour le jeton.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  const token = options.token ?? accessTokenMemory
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      credentials: 'include',
      signal: options.signal,
    })
  } catch {
    throw new ApiError(
      0,
      'Réseau indisponible. Vérifiez que l’API SIGU est démarrée.',
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  let parsed: unknown = null
  if (text) {
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = null
    }
  }

  if (!response.ok) {
    const message = formatDetail(
      parsed as ApiErrorBody | null,
      response.status === 401
        ? 'Authentification requise.'
        : response.status === 403
          ? 'Droits insuffisants.'
          : response.status === 404
            ? 'Ressource introuvable.'
            : 'La requête a échoué.',
    )
    throw new ApiError(response.status, message)
  }

  return parsed as T
}
