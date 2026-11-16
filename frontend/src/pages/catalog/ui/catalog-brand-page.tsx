"use client";

import { useEffect, useState } from "react";

import {
  catalogPublicRequest,
  type CatalogBrand,
  type CatalogCategory,
  type CatalogProduct,
} from "@/features/catalog-management/api";
import { getErrorMessage } from "@/shared/lib/errors";
import PageSection from "@/shared/ui/custom/page-section";
import QueryState from "@/shared/ui/custom/query-state";
import CatalogBreadcrumbs from "./catalog-breadcrumbs";
import CatalogCard from "./catalog-card";

interface CatalogBrandPageProps {
  categorySlug: string;
  brandSlug: string;
}

export default function CatalogBrandPage({
  categorySlug,
  brandSlug,
}: CatalogBrandPageProps) {
  const [category, setCategory] = useState<CatalogCategory | null>(null);
  const [brand, setBrand] = useState<CatalogBrand | null>(null);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadBrandProducts() {
      try {
        const categories =
          await catalogPublicRequest<CatalogCategory[]>("categories");
        const foundCategory = categories.find(
          (item) => item.slug === categorySlug,
        );
        if (!foundCategory) {
          throw new Error("Категория не найдена");
        }
        if (active) setCategory(foundCategory);

        const brands = await catalogPublicRequest<CatalogBrand[]>(
          `categories/${foundCategory.id}/brands`,
        );
        const foundBrand = brands.find((item) => item.slug === brandSlug);
        if (!foundBrand) {
          throw new Error("Бренд не найден в этой категории");
        }
        if (active) setBrand(foundBrand);

        const categoryProducts = await catalogPublicRequest<CatalogProduct[]>(
          `categories/${foundCategory.id}/products?brand_id=${foundBrand.id}`,
        );
        if (active) setProducts(categoryProducts);
      } catch (cause: unknown) {
        if (active) {
          setError(getErrorMessage(cause, "Не удалось загрузить товары"));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadBrandProducts();

    return () => {
      active = false;
    };
  }, [categorySlug, brandSlug]);

  return (
    <PageSection>
      <CatalogBreadcrumbs
        items={[
          { label: "Каталог", href: "/catalog" },
          {
            label: category?.name ?? categorySlug,
            href: category
              ? `/catalog/${encodeURIComponent(categorySlug)}`
              : undefined,
          },
          { label: brand?.name ?? brandSlug },
        ]}
      />
      <QueryState
        loading={loading}
        loadingText="Загрузка товаров..."
        error={error}
        empty={products.length === 0}
        emptyText="У этого бренда пока нет товаров в выбранной категории."
      >
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((product) => (
            <li key={product.id}>
              <CatalogCard
                href={`/catalog/${encodeURIComponent(categorySlug)}/${encodeURIComponent(brandSlug)}/${encodeURIComponent(product.slug)}`}
                variant="product"
                title={product.name}
                description={product.description}
                price={product.price}
                image={
                  product.images[0]
                    ? { src: product.images[0].path, alt: product.name }
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
