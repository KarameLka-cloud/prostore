import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import {
  SESSION_COOKIE,
  verifySessionToken,
} from "@/features/auth/lib/session";
import { getPublicOrigin } from "@/features/auth/lib/origin";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

async function forward(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ detail: "Требуется авторизация" }, { status: 401 });
  }

  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (origin !== getPublicOrigin(request)) {
      return NextResponse.json(
        { detail: "Недопустимый источник запроса" },
        { status: 403 },
      );
    }
  }

  const { path = [] } = await context.params;
  const pathSuffix = path.map(encodeURIComponent).join("/");
  const target = new URL(
    `/api/admin/users/${pathSuffix}${request.nextUrl.search}`,
    API_URL,
  );
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const response = await fetch(target, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
    cache: "no-store",
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
