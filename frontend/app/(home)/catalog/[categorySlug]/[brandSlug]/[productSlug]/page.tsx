import { CatalogProductPage } from "@/pages/catalog";
import type { CatalogProduct } from "@/features/catalog-management/api";
import { catalogPublicRequest } from "@/features/catalog-management/server";
import { getErrorMessage } from "@/shared/lib/errors";

export const instant = false;

export default async function CatalogProductRoute({
  params,
}: {
  params: Promise<{
    categorySlug: string;
    brandSlug: string;
    productSlug: string;
  }>;
}) {
  const { categorySlug, brandSlug, productSlug } = await params;

  let product: CatalogProduct | null = null;
  let error: string | undefined;

  try {
    const data = await catalogPublicRequest<CatalogProduct>(
      `products/${encodeURIComponent(productSlug)}`,
    );

    if (data.category.slug !== categorySlug || data.brand.slug !== brandSlug) {
      throw new Error("Товар не найден в выбранной категории и бренде");
    }

    product = data;
  } catch (cause) {
    error = getErrorMessage(cause, "Не удалось загрузить товар");
  }

  return (
    <CatalogProductPage
      key={`${categorySlug}/${brandSlug}/${productSlug}`}
      categorySlug={categorySlug}
      brandSlug={brandSlug}
      product={product}
      error={error}
    />
  );
}
