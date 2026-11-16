"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import {
  catalogPublicRequest,
  type CatalogProduct,
} from "@/features/catalog-management/api";
import { getErrorMessage } from "@/shared/lib/errors";
import GlassCard from "@/shared/ui/custom/glass-card";
import PageSection from "@/shared/ui/custom/page-section";
import QueryState from "@/shared/ui/custom/query-state";
import CatalogBreadcrumbs from "./catalog-breadcrumbs";

interface CatalogProductPageProps {
  categorySlug: string;
  brandSlug: string;
  productSlug: string;
}

export default function CatalogProductPage({
  categorySlug,
  brandSlug,
  productSlug,
}: CatalogProductPageProps) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        const data = await catalogPublicRequest<CatalogProduct>(
          `products/${encodeURIComponent(productSlug)}`,
        );
        if (
          data.category.slug !== categorySlug ||
          data.brand.slug !== brandSlug
        ) {
          throw new Error("Товар не найден в выбранной категории и бренде");
        }
        if (active) {
          setProduct(data);
          setActiveImageIndex(0);
        }
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
  }, [productSlug, categorySlug, brandSlug]);

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

      <QueryState
        loading={loading}
        loadingText="Загрузка товара..."
        error={error}
      >
        {product && (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
              <div className="rounded-3xl border border-white/10 bg-white[0.03 p-3 backdrop-blur-xl sm:p-5">
                <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  {product.images.length > 0 ? (
                    <Image
                      src={product.images[activeImageIndex].path}
                      alt={`${product.name} — изображение ${activeImageIndex + 1}`}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      unoptimized
                      className="object-contain p-4 sm:p-8"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-violet/20 via-brand-blue/10 to-brand-pink/20">
                      <span className="text-sm text-white/60">
                        Изображение товара отсутствует
                      </span>
                    </div>
                  )}

                  {product.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Предыдущее изображение"
                        onClick={() =>
                          setActiveImageIndex(
                            (index) =>
                              (index - 1 + product.images.length) %
                              product.images.length,
                          )
                        }
                        className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
                      >
                        <ChevronLeft aria-hidden="true" className="size-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Следующее изображение"
                        onClick={() =>
                          setActiveImageIndex(
                            (index) => (index + 1) % product.images.length,
                          )
                        }
                        className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
                      >
                        <ChevronRight aria-hidden="true" className="size-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/80 backdrop-blur">
                        {activeImageIndex + 1} / {product.images.length}
                      </span>
                    </>
                  )}
                </div>

                {product.images.length > 1 && (
                  <div
                    role="group"
                    aria-label="Выбрать изображение товара"
                    className="mt-4 flex gap-3 overflow-x-auto pb-1"
                  >
                    {product.images.map((image, index) => (
                      <button
                        key={image.id}
                        type="button"
                        aria-label={`Показать изображение ${index + 1}`}
                        aria-pressed={activeImageIndex === index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative size-16 shrink-0 overflow-hidden rounded-xl border bg-black/20 transition sm:size-20 ${
                          activeImageIndex === index
                            ? "border-brand-violet ring-2 ring-brand-violet/40"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <Image
                          src={image.path}
                          alt=""
                          fill
                          sizes="80px"
                          unoptimized
                          className="object-contain p-2"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <GlassCard
                padding="none"
                overlay="glow"
                className="self-start"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                      {product.category.name}
                    </span>
                    <span className="rounded-full border border-brand-violet/20 bg-brand-violet/10 px-3 py-1 text-xs text-white/80">
                      {product.brand.name}
                    </span>
                  </div>

                  <h1 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {product.name}
                  </h1>

                  <div className="mt-7">
                    <p className="text-sm text-white/55">Цена</p>
                    <p className="mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                      {Number(product.price).toLocaleString("ru-RU")} ₽
                    </p>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-6">
                    <h2 className="text-lg font-semibold text-white">
                      Описание
                    </h2>
                    <p className="mt-3 whitespace-pre-wrap leading-7 text-white/75">
                      {product.description?.trim() ||
                        "Описание товара пока не добавлено."}
                    </p>
                  </div>
                </div>
              </GlassCard>
          </div>
        )}
      </QueryState>
    </PageSection>
  );
}
