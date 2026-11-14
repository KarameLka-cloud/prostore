export interface CatalogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
}

export interface CatalogBrand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface CatalogImage {
  id: number;
  path: string;
}

export interface CatalogProduct {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category_id: number;
  brand_id: number;
  category: CatalogCategory;
  brand: CatalogBrand;
  images: CatalogImage[];
}

export async function catalogRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T | undefined> {
  const response = await fetch(`/api/admin/catalog/${path}`, {
    ...init,
    cache: "no-store",
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { detail?: string }
      | null;
    throw new Error(body?.detail ?? `Ошибка запроса (${response.status})`);
  }
  if (response.status === 204) {
    return undefined;
  }
  return (await response.json()) as T;
}
