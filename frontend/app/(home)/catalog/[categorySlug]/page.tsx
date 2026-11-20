import { CatalogCategoryPage } from "@/pages/catalog";
import type {
  CatalogBrand,
  CatalogCategory,
} from "@/features/catalog-management/api";
import { catalogPublicRequest } from "@/features/catalog-management/server";
import { getErrorMessage } from "@/shared/lib/errors";

export const instant = false;

export default async function CatalogCategoryRoute({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  let category: CatalogCategory | null = null;
  let brands: CatalogBrand[] = [];
  let categoryError: string | undefined;
  let brandsError: string | undefined;

  try {
    const categories =
      await catalogPublicRequest<CatalogCategory[]>("categories");
    category = categories.find((item) => item.slug === categorySlug) ?? null;

    if (!category) {
      categoryError = "Категория не найдена";
    } else {
      try {
        brands = await catalogPublicRequest<CatalogBrand[]>(
          `categories/${category.id}/brands`,
        );
      } catch (cause) {
        brandsError = getErrorMessage(cause, "Не удалось загрузить бренды");
      }
    }
  } catch (cause) {
    categoryError = getErrorMessage(cause, "Не удалось загрузить категорию");
  }

  return (
    <CatalogCategoryPage
      key={categorySlug}
      slug={categorySlug}
      category={category}
      brands={brands}
      categoryError={categoryError}
      brandsError={brandsError}
    />
  );
}
