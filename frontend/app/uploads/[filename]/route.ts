import { NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8000";
const IMAGE_FILENAME = /^[a-f0-9]{32}\.(?:jpg|png|webp)$/;

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  if (!IMAGE_FILENAME.test(filename)) {
    return NextResponse.json({ detail: "Изображение не найдено" }, { status: 404 });
  }

  const response = await fetch(
    new URL(`/uploads/${filename}`, API_URL),
    { cache: "no-store" },
  );
  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
