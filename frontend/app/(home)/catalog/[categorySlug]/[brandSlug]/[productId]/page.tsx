import { CatalogProductPage } from "@/pages/catalog";

export const instant = false;

export default async function CatalogProductRoute({
  params,
}: {
  params: Promise<{
    categorySlug: string;
    brandSlug: string;
    productId: string;
  }>;
}) {
  const { categorySlug, brandSlug, productId } = await params;
  return (
    <CatalogProductPage
      key={`${categorySlug}/${brandSlug}/${productId}`}
      categorySlug={categorySlug}
      brandSlug={brandSlug}
      productId={productId}
    />
  );
}
