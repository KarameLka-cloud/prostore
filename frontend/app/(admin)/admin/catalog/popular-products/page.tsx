import { connection } from "next/server";
import { AdminPopularProductsPage } from "@/pages/admin-popular-products";
import type { PopularProductsData } from "@/features/catalog-management/api";
import { loadPopularProductsData } from "@/features/catalog-management/server";
import { getErrorMessage } from "@/shared/lib/errors";

export const instant = false;

export default async function PopularProductsRoute() {
  await connection();

  let initialData: PopularProductsData = { products: [], selectedIds: [] };
  let initialError: string | undefined;

  try {
    initialData = await loadPopularProductsData();
  } catch (cause) {
    initialError = getErrorMessage(
      cause,
      "Не удалось загрузить популярные товары",
    );
  }

  return (
    <AdminPopularProductsPage
      initialData={initialData}
      initialError={initialError}
    />
  );
}
