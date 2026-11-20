import { getSessionToken } from "@/features/auth/lib/cookies";

import type { AdminUser, UpdateAdminUser } from "./api";

const API_URL = process.env.API_URL;

function buildUrl(path: string): URL {
  if (!API_URL) {
    throw new Error("Не задан API_URL для доступа к backend");
  }

  return new URL(path, API_URL);
}

function getErrorDetail(body: unknown): string | null {
  if (!body || typeof body !== "object" || !("detail" in body)) {
    return null;
  }

  const detail = (body as { detail?: unknown }).detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((entry) => {
        if (
          entry &&
          typeof entry === "object" &&
          "msg" in entry &&
          typeof entry.msg === "string"
        ) {
          return entry.msg;
        }

        return null;
      })
      .filter((message): message is string => Boolean(message));

    if (messages.length > 0) {
      return messages.join("; ");
    }
  }

  return null;
}

async function adminUsersRequest<T>(
  path = "",
  init?: RequestInit,
): Promise<T | undefined> {
  const token = await getSessionToken();
  if (!token) {
    throw new Error("Требуется авторизация");
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(buildUrl(`/api/admin/users${path}`), {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as unknown;
    throw new Error(
      getErrorDetail(body) ?? `Ошибка запроса (${response.status})`,
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return (await response.json()) as T;
}

export async function loadAdminUsers(): Promise<AdminUser[]> {
  return (await adminUsersRequest<AdminUser[]>("/")) ?? [];
}

export async function saveAdminUser(
  id: number | null,
  payload: UpdateAdminUser,
): Promise<AdminUser> {
  const user = await adminUsersRequest<AdminUser>(id ? `/${id}` : "/", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!user) {
    throw new Error("Сервер не вернул данные пользователя");
  }

  return user;
}

export async function deleteAdminUser(id: number): Promise<void> {
  await adminUsersRequest<void>(`/${id}`, { method: "DELETE" });
}
