export interface AdminUser {
  id: number;
  login: string;
  name: string;
  email: string;
}

export interface UpdateAdminUser {
  login: string;
  name: string;
  email: string;
  password?: string;
}

export async function adminUsersRequest<T>(
  path = "",
  init?: RequestInit,
): Promise<T | undefined> {
  const response = await fetch(`/api/admin/users${path}`, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { detail?: string }
      | null;
    throw new Error(body?.detail ?? `Ошибка запроса (${response.status})`);
  }
  if (response.status === 204) {
    return undefined;
  }
  return (await response.json()) as T;
}
