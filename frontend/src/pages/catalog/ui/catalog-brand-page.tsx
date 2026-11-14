"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import {
  type CatalogBrand,
  type CatalogCategory,
  type CatalogProduct,
} from "@/features/catalog-management/api";
import PageHeader from "@/shared/ui/custom/page-header";

async function fetchCatalogData<T>(path: string): Promise<T> {
  const response = await fetch(`/api/catalog/${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Не удалось загрузить каталог (${response.status})`);
  }
  return (await response.json()) as T;
}

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
        const categories = await fetchCatalogData<CatalogCategory[]>("categories");
        const foundCategory = categories.find((item) => item.slug === categorySlug);
        if (!foundCategory) {
          throw new Error("Категория не найдена");
        }
        if (active) setCategory(foundCategory);

        const brands = await fetchCatalogData<CatalogBrand[]>(
          `categories/${foundCategory.id}/brands`,
        );
        const foundBrand = brands.find((item) => item.slug === brandSlug);
        if (!foundBrand) {
          throw new Error("Бренд не найден в этой категории");
        }
        if (active) setBrand(foundBrand);

        const categoryProducts = await fetchCatalogData<CatalogProduct[]>(
          `categories/${foundCategory.id}/products?brand_id=${foundBrand.id}`,
        );
        if (active) setProducts(categoryProducts);
      } catch (cause: unknown) {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Не удалось загрузить товары");
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
    <section className="pb-16">
      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href="/catalog"
          className="text-muted transition-colors hover:text-white"
        >
          Все категории
        </Link>
        {category && (
          <Link
            href={`/catalog/${encodeURIComponent(categorySlug)}`}
            className="text-muted transition-colors hover:text-white"
          >
            {category.name}
          </Link>
        )}
      </div>
      <PageHeader>{brand?.name ?? "Каталог"}</PageHeader>

      {loading ? (
        <p className="text-muted">Загрузка товаров...</p>
      ) : error ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
          {error}
        </p>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-muted">
          У этого бренда пока нет товаров в выбранной категории.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/catalog/${encodeURIComponent(categorySlug)}/${encodeURIComponent(brandSlug)}/${product.id}`}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-4.5 flex aspect-square items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-black/20 p-5">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].path}
                      alt={product.name}
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
                <h2 className="mb-1 text-base font-semibold text-white">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="line-clamp-3 text-[13px] text-muted">
                    {product.description}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-4">
                  <p className="text-xl font-bold tracking-tight text-white">
                    {Number(product.price).toLocaleString("ru-RU")} ₽
                  </p>
                  <span
                    aria-hidden="true"
                    className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-200 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-linear-to-br group-hover:from-brand-violet group-hover:to-brand-pink"
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
