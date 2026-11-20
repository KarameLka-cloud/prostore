export interface CatalogCategory {
  id: number;
  name: string;
  slug: string;
  image_path: string | null;
  position: number;
}

export interface CatalogBrand {
  id: number;
  name: string;
  slug: string;
  image_path: string | null;
  position: number;
}

export interface CatalogImage {
  id: number;
  path: string;
}

export interface CatalogProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  old_price: string | null;
  category_id: number;
  brand_id: number;
  category: CatalogCategory;
  brand: CatalogBrand;
  images: CatalogImage[];
}

export interface CatalogProductPayload {
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  category_id: number;
  brand_id: number;
}

export interface AdminCatalogData {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  brands: CatalogBrand[];
}

export interface PopularProductsData {
  products: CatalogProduct[];
  selectedIds: number[];
}
