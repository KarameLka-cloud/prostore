import { CatalogProductPage } from "@/pages/catalog";

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
  return (
    <CatalogProductPage
      key={`${categorySlug}/${brandSlug}/${productSlug}`}
      categorySlug={categorySlug}
      brandSlug={brandSlug}
      productSlug={productSlug}
    />
  );
}
