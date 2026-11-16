"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, Search } from "lucide-react";

import {
  catalogRequest,
  type CatalogProduct,
} from "@/features/catalog-management/api";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";

const MAX_POPULAR_PRODUCTS = 8;

export default function AdminPopularProductsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const [nextProducts, nextSelectedIds] = await Promise.all([
      catalogRequest<CatalogProduct[]>("products"),
      catalogRequest<number[]>("popular-products"),
    ]);
    setProducts(nextProducts ?? []);
    setSelectedIds(nextSelectedIds ?? []);
    setSavedIds(nextSelectedIds ?? []);
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      refresh()
        .catch((cause: unknown) => {
          if (active) {
            setError(
              cause instanceof Error
                ? cause.message
                : "Не удалось загрузить товары",
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [refresh]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru-RU");
    if (!query) return products;
    return products.filter((product) =>
      [product.name, product.category.name, product.brand.name].some((value) =>
        value.toLocaleLowerCase("ru-RU").includes(query),
      ),
    );
  }, [products, search]);

  const hasChanges =
    selectedIds.length !== savedIds.length ||
    selectedIds.some((id, index) => id !== savedIds[index]);

  function toggleProduct(productId: number, checked: boolean) {
    setError("");
    setNotice("");
    if (!checked) {
      setSelectedIds((ids) => ids.filter((id) => id !== productId));
      return;
    }
    if (selectedIds.length >= MAX_POPULAR_PRODUCTS) {
      setError(`Можно выбрать не более ${MAX_POPULAR_PRODUCTS} товаров.`);
      return;
    }
    setSelectedIds((ids) =>
      ids.includes(productId) ? ids : [...ids, productId],
    );
  }

  function moveProduct(productId: number, offset: -1 | 1) {
    setSelectedIds((ids) => {
      const currentIndex = ids.indexOf(productId);
      const nextIndex = currentIndex + offset;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= ids.length) {
        return ids;
      }
      const nextIds = [...ids];
      [nextIds[currentIndex], nextIds[nextIndex]] = [
        nextIds[nextIndex],
        nextIds[currentIndex],
      ];
      return nextIds;
    });
    setNotice("");
  }

  async function saveSelection() {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const nextIds = await catalogRequest<number[]>("popular-products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_ids: selectedIds }),
      });
      const savedSelection = nextIds ?? selectedIds;
      setSelectedIds(savedSelection);
      setSavedIds(savedSelection);
      setNotice("Список популярных товаров сохранён.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось сохранить список популярных товаров",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 p-2 text-foreground sm:p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Популярные товары
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Выберите до {MAX_POPULAR_PRODUCTS} товаров для главной страницы.
            Порядок можно изменить стрелками.
          </p>
        </div>
        <Button
          onClick={() => void saveSelection()}
          disabled={loading || saving || !hasChanges}
          className="w-full sm:w-auto"
        >
          {saving ? "Сохранение..." : "Сохранить выбор"}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Выбрано: {selectedIds.length} из {MAX_POPULAR_PRODUCTS}
        </p>
        <label className="relative block w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Найти товар"
            aria-label="Поиск товаров"
            className="h-9 pl-9"
          />
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Загрузка товаров...
          </p>
        ) : products.length === 0 ? (
          <div className="space-y-3 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Сначала добавьте товары в каталог.
            </p>
            <Button render={<Link href="/admin/catalog" />}>
              Перейти к товарам
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            По вашему запросу ничего не найдено.
          </p>
        ) : (
          <ul className="divide-y">
            {filteredProducts.map((product) => {
              const selectedIndex = selectedIds.indexOf(product.id);
              const firstImage = [...product.images].sort(
                (left, right) => left.id - right.id,
              )[0];
              return (
                <li
                  key={product.id}
                  className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4"
                >
                  <input
                    type="checkbox"
                    checked={selectedIndex >= 0}
                    onChange={(event) =>
                      toggleProduct(product.id, event.target.checked)
                    }
                    aria-label={`Добавить ${product.name} в популярные товары`}
                    className="size-4 shrink-0 accent-violet-600"
                  />
                  {firstImage ? (
                    <Image
                      src={firstImage.path}
                      alt=""
                      width={48}
                      height={48}
                      unoptimized
                      className="size-12 shrink-0 rounded-md border object-cover"
                    />
                  ) : (
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                      <ImageIcon className="size-4" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.category.name} · {product.brand.name}
                    </p>
                  </div>
                  <p className="hidden text-sm font-medium sm:block">
                    {Number(product.price).toLocaleString("ru-RU")} ₽
                  </p>
                  {selectedIndex >= 0 && (
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="mr-1 text-xs text-muted-foreground">
                        {selectedIndex + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={selectedIndex === 0}
                        aria-label={`Переместить ${product.name} выше`}
                        onClick={() => moveProduct(product.id, -1)}
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={selectedIndex === selectedIds.length - 1}
                        aria-label={`Переместить ${product.name} ниже`}
                        onClick={() => moveProduct(product.id, 1)}
                      >
                        <ArrowDown />
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
