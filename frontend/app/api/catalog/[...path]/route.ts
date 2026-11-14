import { connection, NextResponse, type NextRequest } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  await connection();

  const { path } = await context.params;
  const target = new URL(
    `/api/catalog/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`,
    API_URL,
  );

  try {
    const response = await fetch(target, { cache: "no-store" });
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to load public catalog data", error);
    return NextResponse.json(
      { detail: "Не удалось загрузить данные каталога" },
      { status: 502 },
    );
  }
}
