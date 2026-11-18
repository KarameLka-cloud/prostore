import { getSessionToken } from "@/features/auth/lib/cookies";

import type {
  AdminCatalogData,
  CatalogBrand,
  CatalogCategory,
  CatalogProduct,
  CatalogProductPayload,
  PopularProductsData,
} from "./api";

const API_URL = process.env.API_URL;

function buildUrl(path: string): URL {
  if (!API_URL) {
    throw new Error("Не задан API_URL для доступа к backend");
  }

  return new URL(path, API_URL);
}

function resolveUploadUrls<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => resolveUploadUrls(item)) as T;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (
        (key === "image_path" || key === "path") &&
        typeof item === "string" &&
        item.startsWith("/uploads/")
      ) {
        return [key, buildUrl(item).toString()];
      }

      return [key, resolveUploadUrls(item)];
    }),
  ) as T;
}

function getErrorDetail(body: unknown): string | null {
  if (!body || typeof body !== "object" || !("detail" in body)) {
    return null;
  }

  const detail = (body as { detail?: unknown }).detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((entry) => {
        if (
          entry &&
          typeof entry === "object" &&
          "msg" in entry &&
          typeof entry.msg === "string"
        ) {
          return entry.msg;
        }

        return null;
      })
      .filter((message): message is string => Boolean(message));

    if (messages.length > 0) {
      return messages.join("; ");
    }
  }

  return null;
}

async function backendRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { auth?: boolean } = {},
): Promise<T | undefined> {
  const headers = new Headers(init.headers);

  if (options.auth) {
    const token = await getSessionToken();
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as unknown;
    throw new Error(
      getErrorDetail(body) ?? `Ошибка запроса (${response.status})`,
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return resolveUploadUrls((await response.json()) as T);
}

export async function catalogPublicRequest<T>(path: string): Promise<T> {
  return (await backendRequest<T>(`/api/catalog/${path}`)) as T;
}

function adminCatalogRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T | undefined> {
  return backendRequest<T>(`/api/admin/catalog/${path}`, init, { auth: true });
}

export async function loadCatalogData(): Promise<AdminCatalogData> {
  const [products, categories, brands] = await Promise.all([
    adminCatalogRequest<CatalogProduct[]>("products"),
    adminCatalogRequest<CatalogCategory[]>("categories"),
    adminCatalogRequest<CatalogBrand[]>("brands"),
  ]);

  return {
    products: products ?? [],
    categories: categories ?? [],
    brands: brands ?? [],
  };
}

export async function loadPopularProductsData(): Promise<PopularProductsData> {
  const [products, selectedIds] = await Promise.all([
    adminCatalogRequest<CatalogProduct[]>("products"),
    adminCatalogRequest<number[]>("popular-products"),
  ]);

  return {
    products: products ?? [],
    selectedIds: selectedIds ?? [],
  };
}

export async function saveProduct(
  id: number | null,
  payload: CatalogProductPayload,
): Promise<CatalogProduct> {
  const product = await adminCatalogRequest<CatalogProduct>(
    id ? `products/${id}` : "products",
    {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!product) {
    throw new Error("Сервер не вернул данные товара");
  }

  return product;
}

export async function uploadProductImages(
  productId: number,
  formData: FormData,
): Promise<CatalogProduct> {
  const product = await adminCatalogRequest<CatalogProduct>(
    `products/${productId}/images`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!product) {
    throw new Error("Сервер не вернул данные товара");
  }

  return product;
}

export async function saveCatalogItem(
  kind: "categories" | "brands",
  id: number | null,
  name: string,
): Promise<CatalogCategory | CatalogBrand> {
  const item = await adminCatalogRequest<CatalogCategory | CatalogBrand>(
    id ? `${kind}/${id}` : kind,
    {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    },
  );

  if (!item) {
    throw new Error("Сервер не вернул данные записи");
  }

  return item;
}

export async function uploadCatalogImage(
  kind: "categories" | "brands",
  id: number,
  formData: FormData,
): Promise<CatalogCategory | CatalogBrand> {
  const item = await adminCatalogRequest<CatalogCategory | CatalogBrand>(
    `${kind}/${id}/image`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!item) {
    throw new Error("Сервер не вернул данные записи");
  }

  return item;
}

export async function deleteCatalogItem(
  kind: "products" | "categories" | "brands",
  id: number,
): Promise<void> {
  await adminCatalogRequest<void>(`${kind}/${id}`, { method: "DELETE" });
}

export async function saveCatalogOrder(
  kind: "categories" | "brands",
  itemIds: number[],
): Promise<number[]> {
  const order = await adminCatalogRequest<number[]>(`${kind}/order`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_ids: itemIds }),
  });

  return order ?? itemIds;
}

export async function deleteProductImage(
  productId: number,
  imageId: number,
): Promise<void> {
  await adminCatalogRequest<void>(`products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });
}

export async function savePopularProducts(
  productIds: number[],
): Promise<number[]> {
  const savedIds = await adminCatalogRequest<number[]>("popular-products", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_ids: productIds }),
  });

  return savedIds ?? productIds;
}
