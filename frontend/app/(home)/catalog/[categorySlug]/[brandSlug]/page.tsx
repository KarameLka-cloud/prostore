import { CatalogBrandPage } from "@/pages/catalog";
import type {
  CatalogBrand,
  CatalogCategory,
  CatalogProduct,
} from "@/features/catalog-management/api";
import { catalogPublicRequest } from "@/features/catalog-management/server";
import { getErrorMessage } from "@/shared/lib/errors";

export const instant = false;

export default async function CatalogBrandRoute({
  params,
}: {
  params: Promise<{ categorySlug: string; brandSlug: string }>;
}) {
  const { categorySlug, brandSlug } = await params;

  let category: CatalogCategory | null = null;
  let brand: CatalogBrand | null = null;
  let products: CatalogProduct[] = [];
  let error: string | undefined;

  try {
    const categories =
      await catalogPublicRequest<CatalogCategory[]>("categories");
    category = categories.find((item) => item.slug === categorySlug) ?? null;

    if (!category) {
      throw new Error("Категория не найдена");
    }

    const brands = await catalogPublicRequest<CatalogBrand[]>(
      `categories/${category.id}/brands`,
    );
    brand = brands.find((item) => item.slug === brandSlug) ?? null;

    if (!brand) {
      throw new Error("Бренд не найден в этой категории");
    }

    products = await catalogPublicRequest<CatalogProduct[]>(
      `categories/${category.id}/products?brand_id=${brand.id}`,
    );
  } catch (cause) {
    error = getErrorMessage(cause, "Не удалось загрузить товары");
  }

  return (
    <CatalogBrandPage
      key={`${categorySlug}/${brandSlug}`}
      categorySlug={categorySlug}
      brandSlug={brandSlug}
      category={category}
      brand={brand}
      products={products}
      error={error}
    />
  );
}
