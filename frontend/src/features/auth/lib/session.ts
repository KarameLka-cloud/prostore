import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "prostore_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const SESSION_SECRET =
  process.env.AUTH_SECRET ?? "prostore-development-secret-change-me";

if (!process.env.AUTH_SECRET) {
  console.warn(
    "[auth] AUTH_SECRET не задан. Используется секрет для разработки — задайте AUTH_SECRET перед публикацией.",
  );
}

export interface SessionPayload {
  userId: number;
  login: string;
  name?: string;
  exp: number;
}

function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

export function createSessionToken(
  payload: Omit<SessionPayload, "exp">,
): string {
  const data = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
    }),
  ).toString("base64url");

  return `${data}.${sign(data)}`;
}

export function verifySessionToken(
  token: string | undefined | null,
): SessionPayload | null {
  if (!token) {
    return null;
  }

  const [data, signature] = token.split(".");

  if (!data || !signature) {
    return null;
  }

  const expectedSignature = sign(data);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8"),
    ) as SessionPayload;

    if (
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= Date.now() ||
      typeof payload.userId !== "number" ||
      typeof payload.login !== "string" ||
      (payload.name !== undefined && typeof payload.name !== "string")
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
