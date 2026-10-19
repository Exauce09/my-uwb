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

export type ProgramRef = {
  id: string;
  code: string;
  title: string;
  academic_unit_name: string;
};

export type AcademicYearRef = {
  id: string;
  label: string;
  starts_on: string | null;
  ends_on: string | null;
  is_current: boolean;
};

export type ProgramLevelRef = {
  id: string;
  code: string;
  label: string;
  sort_order: number;
};

export type EnrollmentAdminPublic = {
  id: string;
  student_profile_id: string;
  status: string;
  kind: string | null;
  enrolled_on: string | null;
  closed_on: string | null;
  program: ProgramRef;
  academic_year: AcademicYearRef;
  program_level: ProgramLevelRef | null;
  created_at: string;
  updated_at: string;
};

export type StudentProfileListItem = {
  id: string;
  person_id: string;
  student_number: string;
  status: string;
  entry_date: string | null;
  person_last_name: string;
  person_first_name: string;
  person_email: string | null;
  enrollment_count: number;
};

export type StudentProfileListResponse = {
  items: StudentProfileListItem[];
  total: number;
  page: number;
  page_size: number;
};

export type StudentProfilePublic = {
  id: string;
  person_id: string;
  student_number: string;
  status: string;
  entry_date: string | null;
  person: PersonPublic;
  enrollments: EnrollmentAdminPublic[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AcademicCatalog = {
  programs: ProgramRef[];
  academic_years: AcademicYearRef[];
  program_levels: ProgramLevelRef[];
};

export type AcademicUnitRef = {
  id: string;
  code: string;
  name: string;
  kind: string;
};

export type ProgramPublic = {
  id: string;
  code: string;
  title: string;
  cycle: string | null;
  academic_unit_id: string;
  academic_unit_code: string;
  academic_unit_name: string;
  deleted_at: string | null;
};

export type ProgramListResponse = {
  items: ProgramPublic[];
  total: number;
  page: number;
  page_size: number;
};

export type AcademicYearPublic = {
  id: string;
  label: string;
  starts_on: string | null;
  ends_on: string | null;
  is_current: boolean;
};

export type AcademicYearListResponse = {
  items: AcademicYearPublic[];
  total: number;
  page: number;
  page_size: number;
};

export type ProgramLevelPublic = {
  id: string;
  code: string;
  label: string;
  sort_order: number;
};

export type ProgramLevelListResponse = {
  items: ProgramLevelPublic[];
  total: number;
};
