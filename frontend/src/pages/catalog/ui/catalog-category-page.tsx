"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { type CatalogBrand, type CatalogCategory } from "@/features/catalog-management/api";
import PageHeader from "@/shared/ui/custom/page-header";

async function fetchCatalogData<T>(path: string): Promise<T> {
  const response = await fetch(`/api/catalog/${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Не удалось загрузить каталог (${response.status})`);
  }
  return (await response.json()) as T;
}

export default function CatalogCategoryPage({ slug }: { slug: string }) {
  const [category, setCategory] = useState<CatalogCategory | null>(null);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [categoryError, setCategoryError] = useState("");
  const [brandsError, setBrandsError] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCategory() {
      try {
        const categories = await fetchCatalogData<CatalogCategory[]>("categories");
        const foundCategory = categories.find((item) => item.slug === slug);
        if (!foundCategory) {
          if (active) setCategoryError("Категория не найдена");
          return;
        }
        if (active) setCategory(foundCategory);

        try {
          const categoryBrands = await fetchCatalogData<CatalogBrand[]>(
            `categories/${foundCategory.id}/brands`,
          );
          if (active) setBrands(categoryBrands);
        } catch (cause: unknown) {
          if (active) {
            setBrandsError(
              cause instanceof Error ? cause.message : "Не удалось загрузить бренды",
            );
          }
        }
      } catch (cause: unknown) {
        if (active) {
          setCategoryError(
            cause instanceof Error ? cause.message : "Не удалось загрузить категорию",
          );
        }
      } finally {
        if (active) {
          setCategoryLoading(false);
          setBrandsLoading(false);
        }
      }
    }

    void loadCategory();
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <section className="pb-16">
      <Link
        href="/catalog"
        className="inline-flex rounded-lg text-sm text-muted transition-colors hover:text-white"
      >
        ← Все категории
      </Link>
      <PageHeader>{category?.name ?? "Каталог"}</PageHeader>

      {categoryLoading ? (
        <p className="text-muted">Загрузка категории...</p>
      ) : categoryError ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
          {categoryError}
        </p>
      ) : (
        <>
          <h2 className="mb-5 text-2xl font-semibold text-white">Выберите бренд</h2>
          {brandsLoading ? (
            <p className="text-muted">Загрузка брендов...</p>
          ) : brandsError ? (
            <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
              {brandsError}
            </p>
          ) : brands.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-muted">
              В этой категории пока нет брендов с товарами.
            </p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => (
                <li key={brand.id}>
                  <Link
                    href={`/catalog/${encodeURIComponent(slug)}/${encodeURIComponent(brand.slug)}`}
                    className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                  >
                    <h3 className="mb-1 text-base font-semibold text-white">
                      {brand.name}
                    </h3>
                    {brand.description && (
                      <p className="line-clamp-4 text-[13px] text-muted">
                        {brand.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
