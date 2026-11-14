export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

const API_URL = process.env.API_URL ?? "http://localhost:8000";

export async function authenticate(
  login: string,
  password: string,
): Promise<AuthUser | null> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login, password }),
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 422) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Auth request failed with status ${response.status}`);
  }

  return (await response.json()) as AuthUser;
}
