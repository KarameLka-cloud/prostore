"use client";

import { useEffect, useState } from "react";

import {
  catalogPublicRequest,
  type CatalogBrand,
  type CatalogCategory,
} from "@/features/catalog-management/api";
import { getErrorMessage } from "@/shared/lib/errors";
import PageHeader from "@/shared/ui/custom/page-header";
import PageSection from "@/shared/ui/custom/page-section";
import QueryState from "@/shared/ui/custom/query-state";
import SectionTitle from "@/shared/ui/custom/section-title";
import CatalogBreadcrumbs from "./catalog-breadcrumbs";
import CatalogCard from "./catalog-card";

export default function CatalogCategoryPage({ slug }: { slug: string }) {
  const [category, setCategory] = useState<CatalogCategory | null>(null);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [categoryError, setCategoryError] = useState("");
  const [brandsError, setBrandsError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCategory() {
      try {
        const categories =
          await catalogPublicRequest<CatalogCategory[]>("categories");
        const foundCategory = categories.find((item) => item.slug === slug);
        if (!foundCategory) {
          if (active) setCategoryError("Категория не найдена");
          return;
        }
        if (active) setCategory(foundCategory);

        try {
          const categoryBrands = await catalogPublicRequest<CatalogBrand[]>(
            `categories/${foundCategory.id}/brands`,
          );
          if (active) setBrands(categoryBrands);
        } catch (cause: unknown) {
          if (active) {
            setBrandsError(
              getErrorMessage(cause, "Не удалось загрузить бренды"),
            );
          }
        }
      } catch (cause: unknown) {
        if (active) {
          setCategoryError(
            getErrorMessage(cause, "Не удалось загрузить категорию"),
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCategory();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <PageSection>
      <CatalogBreadcrumbs
        items={[
          { label: "Каталог", href: "/catalog" },
          { label: category?.name ?? "Категория" },
        ]}
      />
      <PageHeader className="mt-6">{category?.name ?? "Категория"}</PageHeader>

      <QueryState
        loading={loading}
        loadingText="Загрузка категории..."
        error={categoryError}
      >
        <SectionTitle className="mb-5 text-left">Выберите бренд</SectionTitle>

        <QueryState
          loading={loading}
          loadingText="Загрузка брендов..."
          error={brandsError}
          empty={brands.length === 0}
          emptyText="В этой категории пока нет брендов с товарами."
        >
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <li key={brand.id}>
                <CatalogCard
                  href={`/catalog/${encodeURIComponent(slug)}/${encodeURIComponent(brand.slug)}`}
                  title={brand.name}
                  description={brand.description}
                  descriptionLines={4}
                />
              </li>
            ))}
          </ul>
        </QueryState>
      </QueryState>
    </PageSection>
  );
}
