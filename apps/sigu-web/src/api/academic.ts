import { apiRequest } from "../lib/api";
import type {
  AcademicCatalog,
  EnrollmentAdminPublic,
  StudentProfileListResponse,
  StudentProfilePublic,
} from "../lib/types";

export async function fetchAcademicCatalog(): Promise<AcademicCatalog> {
  return apiRequest<AcademicCatalog>("/api/v1/academic/catalog");
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
