import { apiRequest } from "../lib/api";
import type {
  AcademicCatalog,
  AcademicUnitRef,
  AcademicYearListResponse,
  AcademicYearPublic,
  EnrollmentAdminPublic,
  ProgramLevelListResponse,
  ProgramLevelPublic,
  ProgramListResponse,
  ProgramPublic,
  StudentProfileListResponse,
  StudentProfilePublic,
} from "../lib/types";

export async function fetchAcademicCatalog(): Promise<AcademicCatalog> {
  return apiRequest<AcademicCatalog>("/api/v1/academic/catalog");
}

export async function listAcademicUnits(): Promise<AcademicUnitRef[]> {
  return apiRequest<AcademicUnitRef[]>("/api/v1/academic/units");
}

export async function listPrograms(params: {
  page?: number;
  pageSize?: number;
  q?: string;
}): Promise<ProgramListResponse> {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 1));
  search.set("page_size", String(params.pageSize ?? 20));
  if (params.q?.trim()) search.set("q", params.q.trim());
  return apiRequest<ProgramListResponse>(`/api/v1/academic/programs?${search}`);
}

export async function getProgram(id: string): Promise<ProgramPublic> {
  return apiRequest<ProgramPublic>(`/api/v1/academic/programs/${id}`);
}

export async function createProgram(body: {
  academic_unit_id: string;
  code: string;
  title: string;
  cycle?: string | null;
}): Promise<ProgramPublic> {
  return apiRequest<ProgramPublic>("/api/v1/academic/programs", {
    method: "POST",
    body,
  });
}

export async function updateProgram(
  id: string,
  body: {
    academic_unit_id?: string;
    code?: string;
    title?: string;
    cycle?: string | null;
  },
): Promise<ProgramPublic> {
  return apiRequest<ProgramPublic>(`/api/v1/academic/programs/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteProgram(id: string): Promise<ProgramPublic> {
  return apiRequest<ProgramPublic>(`/api/v1/academic/programs/${id}`, {
    method: "DELETE",
  });
}

export async function listAcademicYears(params?: {
  page?: number;
  pageSize?: number;
}): Promise<AcademicYearListResponse> {
  const search = new URLSearchParams();
  search.set("page", String(params?.page ?? 1));
  search.set("page_size", String(params?.pageSize ?? 50));
  return apiRequest<AcademicYearListResponse>(
    `/api/v1/academic/years?${search}`,
  );
}

export async function createAcademicYear(body: {
  label: string;
  starts_on?: string | null;
  ends_on?: string | null;
  is_current?: boolean;
}): Promise<AcademicYearPublic> {
  return apiRequest<AcademicYearPublic>("/api/v1/academic/years", {
    method: "POST",
    body,
  });
}

export async function updateAcademicYear(
  id: string,
  body: {
    label?: string;
    starts_on?: string | null;
    ends_on?: string | null;
    is_current?: boolean;
  },
): Promise<AcademicYearPublic> {
  return apiRequest<AcademicYearPublic>(`/api/v1/academic/years/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function listProgramLevels(): Promise<ProgramLevelListResponse> {
  return apiRequest<ProgramLevelListResponse>("/api/v1/academic/levels");
}

export async function createProgramLevel(body: {
  code: string;
  label: string;
  sort_order?: number;
}): Promise<ProgramLevelPublic> {
  return apiRequest<ProgramLevelPublic>("/api/v1/academic/levels", {
    method: "POST",
    body,
  });
}

export async function updateProgramLevel(
  id: string,
  body: {
    code?: string;
    label?: string;
    sort_order?: number;
  },
): Promise<ProgramLevelPublic> {
  return apiRequest<ProgramLevelPublic>(`/api/v1/academic/levels/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function listStudentProfiles(params: {
  page?: number;
  pageSize?: number;
  q?: string;
}): Promise<StudentProfileListResponse> {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 1));
  search.set("page_size", String(params.pageSize ?? 20));
  if (params.q?.trim()) search.set("q", params.q.trim());
  return apiRequest<StudentProfileListResponse>(
    `/api/v1/student-profiles?${search}`,
  );
}

export async function getStudentProfile(
  id: string,
): Promise<StudentProfilePublic> {
  return apiRequest<StudentProfilePublic>(`/api/v1/student-profiles/${id}`);
}

export async function createStudentProfile(body: {
  person_id: string;
  student_number: string;
  status?: string;
  entry_date?: string | null;
}): Promise<StudentProfilePublic> {
  return apiRequest<StudentProfilePublic>("/api/v1/student-profiles", {
    method: "POST",
    body,
  });
}

export async function updateStudentProfile(
  id: string,
  body: {
    student_number?: string;
    status?: string;
    entry_date?: string | null;
  },
): Promise<StudentProfilePublic> {
  return apiRequest<StudentProfilePublic>(`/api/v1/student-profiles/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteStudentProfile(
  id: string,
): Promise<StudentProfilePublic> {
  return apiRequest<StudentProfilePublic>(`/api/v1/student-profiles/${id}`, {
    method: "DELETE",
  });
}

export async function createEnrollment(body: {
  student_profile_id: string;
  program_id: string;
  academic_year_id: string;
  program_level_id?: string | null;
  status?: string;
  kind?: string | null;
  enrolled_on?: string | null;
}): Promise<EnrollmentAdminPublic> {
  return apiRequest<EnrollmentAdminPublic>("/api/v1/enrollments", {
    method: "POST",
    body,
  });
}

export async function updateEnrollment(
  id: string,
  body: {
    status?: string;
    kind?: string | null;
    program_id?: string;
    academic_year_id?: string;
    program_level_id?: string | null;
    enrolled_on?: string | null;
    closed_on?: string | null;
  },
): Promise<EnrollmentAdminPublic> {
  return apiRequest<EnrollmentAdminPublic>(`/api/v1/enrollments/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteEnrollment(
  id: string,
): Promise<EnrollmentAdminPublic> {
  return apiRequest<EnrollmentAdminPublic>(`/api/v1/enrollments/${id}`, {
    method: "DELETE",
  });
}
