"use server";

import { runAction } from "@/shared/lib/action-result";

import type { CatalogProductPayload } from "./api";
import {
  deleteCatalogItem as deleteCatalogItemRequest,
  deleteProductImage as deleteProductImageRequest,
  loadCatalogData,
  saveCatalogItem as saveCatalogItemRequest,
  saveCatalogOrder as saveCatalogOrderRequest,
  savePopularProducts as savePopularProductsRequest,
  saveProduct as saveProductRequest,
  uploadCatalogImage as uploadCatalogImageRequest,
  uploadProductImages as uploadProductImagesRequest,
} from "./server";

export async function loadCatalogAction() {
  return runAction("Не удалось загрузить каталог", loadCatalogData);
}

export async function saveProductAction(
  id: number | null,
  payload: CatalogProductPayload,
) {
  return runAction("Не удалось сохранить товар", () =>
    saveProductRequest(id, payload),
  );
}

export async function uploadProductImagesAction(
  productId: number,
  formData: FormData,
) {
  return runAction("Не удалось загрузить изображения", () =>
    uploadProductImagesRequest(productId, formData),
  );
}

export async function saveCatalogItemAction(
  kind: "categories" | "brands",
  id: number | null,
  name: string,
) {
  return runAction("Не удалось сохранить запись", () =>
    saveCatalogItemRequest(kind, id, name),
  );
}

export async function uploadCatalogImageAction(
  kind: "categories" | "brands",
  id: number,
  formData: FormData,
) {
  return runAction("Не удалось загрузить изображение", () =>
    uploadCatalogImageRequest(kind, id, formData),
  );
}

export async function deleteCatalogItemAction(
  kind: "products" | "categories" | "brands",
  id: number,
) {
  return runAction("Не удалось удалить запись", () =>
    deleteCatalogItemRequest(kind, id),
  );
}

export async function saveCatalogOrderAction(
  kind: "categories" | "brands",
  itemIds: number[],
) {
  return runAction("Не удалось изменить порядок", () =>
    saveCatalogOrderRequest(kind, itemIds),
  );
}

export async function deleteProductImageAction(
  productId: number,
  imageId: number,
) {
  return runAction("Не удалось удалить изображение", () =>
    deleteProductImageRequest(productId, imageId),
  );
}

export async function savePopularProductsAction(productIds: number[]) {
  return runAction("Не удалось сохранить список популярных товаров", () =>
    savePopularProductsRequest(productIds),
  );
}
