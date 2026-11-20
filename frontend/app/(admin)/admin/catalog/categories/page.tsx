import { connection } from "next/server";
import { AdminCatalogPage } from "@/pages/admin-catalog";
import type { AdminCatalogData } from "@/features/catalog-management/api";
import { loadCatalogData } from "@/features/catalog-management/server";
import { getErrorMessage } from "@/shared/lib/errors";

export const instant = false;

export default async function AdminCategoriesRoute() {
  await connection();

  let initialData: AdminCatalogData = {
    products: [],
    categories: [],
    brands: [],
  };
  let initialError: string | undefined;

  try {
    initialData = await loadCatalogData();
  } catch (cause) {
    initialError = getErrorMessage(cause, "Не удалось загрузить каталог");
  }

  return (
    <AdminCatalogPage
      section="categories"
      initialData={initialData}
      initialError={initialError}
    />
  );
}
