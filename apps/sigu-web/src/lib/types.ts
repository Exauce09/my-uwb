/** Types alignés sur les schémas Pydantic du backend SIGU. */

export type UserPublic = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  roles: string[];
  person_id: string | null;
  created_at: string;
  updated_at: string;
};

export type TokenResponse = {
  token_type: string;
  access_token: string;
  message: string;
};

export type PersonPublic = {
  id: string;
  last_name: string;
  first_name: string;
  other_names: string | null;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PersonListResponse = {
  items: PersonPublic[];
  total: number;
  page: number;
  page_size: number;
};

export type UserListResponse = {
  items: UserPublic[];
  total: number;
  page: number;
  page_size: number;
};

export type PersonCreateInput = {
  last_name: string;
  first_name: string;
  other_names?: string | null;
  email?: string | null;
  phone?: string | null;
  birth_date?: string | null;
};

export type ApiErrorBody = {
  detail?: string | { msg?: string; loc?: unknown[] }[];
};
