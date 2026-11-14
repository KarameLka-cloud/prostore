"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  catalogPublicRequest,
  type CatalogProduct,
} from "@/features/catalog-management/api";
import { getErrorMessage } from "@/shared/lib/errors";
import GlassCard from "@/shared/ui/custom/glass-card";
import PageHeader from "@/shared/ui/custom/page-header";
import PageSection from "@/shared/ui/custom/page-section";
import QueryState from "@/shared/ui/custom/query-state";
import CatalogBreadcrumbs from "./catalog-breadcrumbs";

interface CatalogProductPageProps {
  categorySlug: string;
  brandSlug: string;
  productId: string;
}

export default function CatalogProductPage({
  categorySlug,
  brandSlug,
  productId,
}: CatalogProductPageProps) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        const data = await catalogPublicRequest<CatalogProduct>(
          `products/${encodeURIComponent(productId)}`,
        );
        if (
          data.category.slug !== categorySlug ||
          data.brand.slug !== brandSlug
        ) {
          throw new Error("Товар не найден в выбранной категории и бренде");
        }
        if (active) setProduct(data);
      } catch (cause: unknown) {
        if (active) {
          setError(getErrorMessage(cause, "Не удалось загрузить товар"));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProduct();

    return () => {
      active = false;
    };
  }, [productId, categorySlug, brandSlug]);

  return (
    <PageSection>
      <CatalogBreadcrumbs
        items={[
          { label: "Каталог", href: "/catalog" },
          {
            label: product?.category.name ?? categorySlug,
            href: `/catalog/${encodeURIComponent(categorySlug)}`,
          },
          {
            label: product?.brand.name ?? brandSlug,
            href: `/catalog/${encodeURIComponent(categorySlug)}/${encodeURIComponent(brandSlug)}`,
          },
          { label: product?.name ?? "Товар" },
        ]}
      />
      <PageHeader className="mt-6">
        {product?.name ?? "Товар"}
      </PageHeader>

      <QueryState
        loading={loading}
        loadingText="Загрузка товара..."
        error={error}
      >
        {product && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="grid content-start gap-4 sm:grid-cols-2">
              {product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <Image
                    key={image.id}
                    src={image.path}
                    alt={`${product.name} — изображение ${index + 1}`}
                    width={800}
                    height={600}
                    unoptimized
                    className={`w-full rounded-2xl border border-white/10 object-cover ${
                      index === 0 ? "sm:col-span-2" : ""
                    }`}
                  />
                ))
              ) : (
                <div
                  aria-hidden="true"
                  className="h-72 rounded-2xl bg-linear-to-br from-brand-violet/30 via-brand-blue/20 to-brand-pink/30 sm:col-span-2"
                />
              )}
            </div>

            <GlassCard padding="sm" className="self-start sm:p-8">
              <p className="text-sm text-muted-foreground">
                {product.category.name} <span aria-hidden="true">·</span>{" "}
                {product.brand.name}
              </p>
              <p className="mt-5 text-3xl font-bold text-white">
                {Number(product.price).toLocaleString("ru-RU")} ₽
              </p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h2 className="text-xl font-semibold text-white">Описание</h2>
                <p className="mt-3 whitespace-pre-wrap leading-7 text-muted-foreground">
                  {product.description?.trim() ||
                    "Описание товара пока не добавлено."}
                </p>
              </div>
            </GlassCard>
          </div>
        )}
      </QueryState>
    </PageSection>
  );
}
