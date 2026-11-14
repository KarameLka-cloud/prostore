"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { type CatalogCategory } from "@/features/catalog-management/api";
import PageHeader from "@/shared/ui/custom/page-header";

async function fetchCatalogData<T>(path: string): Promise<T> {
  const response = await fetch(`/api/catalog/${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Не удалось загрузить каталог (${response.status})`);
  }
  return (await response.json()) as T;
}

export default function CatalogPage() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchCatalogData<CatalogCategory[]>("categories")
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((cause: unknown) => {
        if (active) {
          setCategoriesError(
            cause instanceof Error ? cause.message : "Не удалось загрузить категории",
          );
        }
      })
      .finally(() => {
        if (active) setCategoriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="pb-16">
      <PageHeader>Каталог</PageHeader>
      {categoriesLoading ? (
        <p className="text-muted">Загрузка категорий...</p>
      ) : categoriesError ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
          {categoriesError}
        </p>
      ) : categories.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-muted">
          Категории пока не добавлены.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/catalog/${encodeURIComponent(category.slug)}`}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-4.5 flex aspect-square items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-black/20 p-5">
                  {category.image_path ? (
                    <Image
                      src={category.image_path}
                      alt={category.name}
                      width={400}
                      height={400}
                      unoptimized
                      className="size-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-transform duration-400 group-hover:scale-108 group-hover:-rotate-2"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="size-full rounded-xl bg-linear-to-br from-brand-violet/30 via-brand-blue/20 to-brand-pink/30"
                    />
                  )}
                </div>
                <h3 className="mb-1 text-base font-semibold text-white">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="line-clamp-3 text-[13px] text-muted">
                    {category.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
