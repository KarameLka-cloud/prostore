import { CatalogCategoryPage } from "@/pages/catalog";

export const instant = false;

export default async function CatalogCategoryRoute({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  return <CatalogCategoryPage key={categorySlug} slug={categorySlug} />;
}
