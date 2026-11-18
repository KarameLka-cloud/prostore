import { CatalogPage } from "@/pages/catalog";
import type { CatalogCategory } from "@/features/catalog-management/api";
import { catalogPublicRequest } from "@/features/catalog-management/server";
import { getErrorMessage } from "@/shared/lib/errors";

export const instant = false;

export default async function Catalog() {
  let categories: CatalogCategory[] = [];
  let error: string | undefined;

  try {
    categories = await catalogPublicRequest<CatalogCategory[]>("categories");
  } catch (cause) {
    error = getErrorMessage(cause, "Не удалось загрузить категории");
  }

  return <CatalogPage categories={categories} error={error} />;
}
