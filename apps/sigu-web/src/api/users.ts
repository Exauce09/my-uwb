import { apiRequest } from "../lib/api";
import type { UserListResponse, UserPublic } from "../lib/types";

export async function listUsers(params: {
  page?: number;
  pageSize?: number;
  q?: string;
}): Promise<UserListResponse> {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 1));
  search.set("page_size", String(params.pageSize ?? 20));
  if (params.q?.trim()) search.set("q", params.q.trim());
  return apiRequest<UserListResponse>(`/api/v1/users?${search}`);
}

export async function createUser(body: {
  email: string;
  password: string;
  full_name?: string | null;
  roles?: string[];
}): Promise<UserPublic> {
  return apiRequest<UserPublic>("/api/v1/users", {
    method: "POST",
    body,
  });
}

export async function setUserStatus(
  id: string,
  is_active: boolean,
): Promise<UserPublic> {
  return apiRequest<UserPublic>(`/api/v1/users/${id}/status`, {
    method: "PATCH",
    body: { is_active },
  });
}

export async function assignRole(
  id: string,
  role: string,
): Promise<UserPublic> {
  return apiRequest<UserPublic>(`/api/v1/users/${id}/roles`, {
    method: "POST",
    body: { role },
  });
}

export async function removeRole(
  id: string,
  role: string,
): Promise<UserPublic> {
  return apiRequest<UserPublic>(`/api/v1/users/${id}/roles/${role}`, {
    method: "DELETE",
  });
}

export async function linkPerson(
  userId: string,
  personId: string,
): Promise<UserPublic> {
  return apiRequest<UserPublic>(`/api/v1/users/${userId}/person`, {
    method: "PUT",
    body: { person_id: personId },
  });
}

export async function unlinkPerson(userId: string): Promise<UserPublic> {
  return apiRequest<UserPublic>(`/api/v1/users/${userId}/person`, {
    method: "DELETE",
  });
}
