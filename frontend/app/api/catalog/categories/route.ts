import { connection, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

export async function GET() {
  await connection();

  try {
    const response = await fetch(new URL("/api/catalog/categories", API_URL), {
      cache: "no-store",
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to load public catalog categories", error);
    return NextResponse.json(
      { detail: "Не удалось загрузить категории каталога" },
      { status: 502 },
    );
  }
}
