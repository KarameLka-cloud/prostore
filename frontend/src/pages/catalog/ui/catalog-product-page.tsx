"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { type CatalogProduct } from "@/features/catalog-management/api";
import PageHeader from "@/shared/ui/custom/page-header";

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
        const response = await fetch(`/api/catalog/products/${encodeURIComponent(productId)}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as
            | { detail?: string }
            | null;
          throw new Error(body?.detail ?? `Не удалось загрузить товар (${response.status})`);
        }

        const data = (await response.json()) as CatalogProduct;
        if (data.category.slug !== categorySlug || data.brand.slug !== brandSlug) {
          throw new Error("Товар не найден в выбранной категории и бренде");
        }
        if (active) setProduct(data);
      } catch (cause: unknown) {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Не удалось загрузить товар");
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
    <section className="pb-16">
      <nav aria-label="Навигация каталога" className="flex flex-wrap gap-4 text-sm">
        <Link href="/catalog" className="text-muted transition-colors hover:text-white">
          Все категории
        </Link>
        <Link
          href={`/catalog/${encodeURIComponent(categorySlug)}`}
          className="text-muted transition-colors hover:text-white"
        >
          {product?.category.name ?? "Категория"}
        </Link>
        <Link
          href={`/catalog/${encodeURIComponent(categorySlug)}/${encodeURIComponent(brandSlug)}`}
          className="text-muted transition-colors hover:text-white"
        >
          {product?.brand.name ?? "Бренд"}
        </Link>
      </nav>
      <PageHeader>{product?.name ?? "Товар"}</PageHeader>

      {loading ? (
        <p className="text-muted">Загрузка товара...</p>
      ) : error ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
          {error}
        </p>
      ) : product ? (
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

          <div className="self-start rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="text-sm text-muted">
              {product.category.name} <span aria-hidden="true">·</span> {product.brand.name}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white">{product.name}</h1>
            <p className="mt-5 text-3xl font-bold text-white">
              {Number(product.price).toLocaleString("ru-RU")} ₽
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h2 className="text-xl font-semibold text-white">Описание</h2>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-muted">
                {product.description?.trim() || "Описание товара пока не добавлено."}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
