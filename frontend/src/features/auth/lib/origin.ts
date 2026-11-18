import type { NextRequest } from "next/server";

export function getPublicOrigin(request: NextRequest): string {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  if (
    forwardedHost &&
    (forwardedProto === "http" || forwardedProto === "https")
  ) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}
