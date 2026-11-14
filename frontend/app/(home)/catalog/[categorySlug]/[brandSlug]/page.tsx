import { CatalogBrandPage } from "@/pages/catalog";

export const instant = false;

export default async function CatalogBrandRoute({
  params,
}: {
  params: Promise<{ categorySlug: string; brandSlug: string }>;
}) {
  const { categorySlug, brandSlug } = await params;
  return (
    <CatalogBrandPage
      key={`${categorySlug}/${brandSlug}`}
      categorySlug={categorySlug}
      brandSlug={brandSlug}
    />
  );
}
