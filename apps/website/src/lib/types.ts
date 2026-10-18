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

export type PersonPublic = {
  id: string
  last_name: string
  first_name: string
  other_names: string | null
  email: string | null
  phone: string | null
  birth_date: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type AcademicDossierSection = {
  status: 'not_provisioned'
  message: string
  enrollments: unknown[]
}

export type DossierPublic = {
  person: PersonPublic | null
  academic: AcademicDossierSection
}

export type TokenResponse = {
  token_type: string
  access_token: string
  message?: string
}

export type ApiErrorBody = {
  detail?: string | { msg?: string; loc?: unknown[] }[]
}
