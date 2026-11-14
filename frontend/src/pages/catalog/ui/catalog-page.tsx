"use client";

import { useEffect, useState } from "react";

import {
  catalogPublicRequest,
  type CatalogCategory,
} from "@/features/catalog-management/api";
import { getErrorMessage } from "@/shared/lib/errors";
import PageHeader from "@/shared/ui/custom/page-header";
import PageSection from "@/shared/ui/custom/page-section";
import QueryState from "@/shared/ui/custom/query-state";
import CatalogCard from "./catalog-card";

export default function CatalogPage() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    catalogPublicRequest<CatalogCategory[]>("categories")
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(getErrorMessage(cause, "Не удалось загрузить категории"));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <PageSection>
      <PageHeader>Каталог</PageHeader>

      <QueryState
        loading={loading}
        loadingText="Загрузка категорий..."
        error={error}
        empty={categories.length === 0}
        emptyText="Категории пока не добавлены."
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <CatalogCard
                href={`/catalog/${encodeURIComponent(category.slug)}`}
                title={category.name}
                description={category.description}
                image={
                  category.image_path
                    ? { src: category.image_path, alt: category.name }
                    : null
                }
              />
            </li>
          ))}
        </ul>
      </QueryState>
    </PageSection>
  );
}
