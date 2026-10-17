import { apiRequest } from "../lib/api";
import type {
  PersonCreateInput,
  PersonListResponse,
  PersonPublic,
} from "../lib/types";

export async function listPersons(params: {
  page?: number;
  pageSize?: number;
  q?: string;
}): Promise<PersonListResponse> {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 1));
  search.set("page_size", String(params.pageSize ?? 20));
  if (params.q?.trim()) search.set("q", params.q.trim());
  return apiRequest<PersonListResponse>(`/api/v1/persons?${search}`);
}

export async function getPerson(id: string): Promise<PersonPublic> {
  return apiRequest<PersonPublic>(`/api/v1/persons/${id}`);
}

export async function createPerson(
  body: PersonCreateInput,
): Promise<PersonPublic> {
  return apiRequest<PersonPublic>("/api/v1/persons", {
    method: "POST",
    body,
  });
}

export async function updatePerson(
  id: string,
  body: Partial<PersonCreateInput>,
): Promise<PersonPublic> {
  return apiRequest<PersonPublic>(`/api/v1/persons/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function softDeletePerson(id: string): Promise<PersonPublic> {
  return apiRequest<PersonPublic>(`/api/v1/persons/${id}`, {
    method: "DELETE",
  });
}
