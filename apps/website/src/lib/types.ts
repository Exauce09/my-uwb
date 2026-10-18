/** Types alignés sur les schémas Pydantic du backend SIGU. */

export type UserPublic = {
  id: string
  email: string
  full_name: string | null
  is_active: boolean
  roles: string[]
  person_id: string | null
  created_at: string
  updated_at: string
}

export type TokenResponse = {
  token_type: string
  access_token: string
  message?: string
}

export type ApiErrorBody = {
  detail?: string | { msg?: string; loc?: unknown[] }[]
}
