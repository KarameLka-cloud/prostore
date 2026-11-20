import { cookies } from "next/headers";

import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  verifySessionToken,
  type SessionPayload,
} from "./session";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();

  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  return verifySessionToken(token) ? (token ?? null) : null;
}

export async function createSession(
  user: { id: number; login: string; name: string },
): Promise<void> {
  const token = createSessionToken({
    userId: user.id,
    login: user.login,
    name: user.name,
  });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}
