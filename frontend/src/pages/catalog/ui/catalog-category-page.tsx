import type {
  CatalogBrand,
  CatalogCategory,
} from "@/features/catalog-management/api";
import PageSection from "@/shared/ui/custom/page-section";
import QueryState from "@/shared/ui/custom/query-state";
import CatalogBreadcrumbs from "./catalog-breadcrumbs";
import CatalogCard from "./catalog-card";

interface CatalogCategoryPageProps {
  slug: string;
  category: CatalogCategory | null;
  brands: CatalogBrand[];
  categoryError?: string;
  brandsError?: string;
}

export default function CatalogCategoryPage({
  slug,
  category,
  brands,
  categoryError,
  brandsError,
}: CatalogCategoryPageProps) {
  return (
    <PageSection>
      <CatalogBreadcrumbs
        items={[
          { label: "Каталог", href: "/catalog" },
          { label: category?.name ?? "Категория" },
        ]}
      />
      <QueryState
        loadingText="Загрузка категории..."
        error={categoryError}
      >
        <QueryState
          loadingText="Загрузка брендов..."
          error={brandsError}
          empty={brands.length === 0}
          emptyText="В этой категории пока нет брендов с товарами."
        >
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {brands.map((brand) => (
              <li key={brand.id}>
                <CatalogCard
                  href={`/catalog/${encodeURIComponent(slug)}/${encodeURIComponent(brand.slug)}`}
                  title={brand.name}
                  image={
                    brand.image_path
                      ? { src: brand.image_path, alt: brand.name }
                      : null
                  }
                />
              </li>
            ))}
          </ul>
        </QueryState>
      </QueryState>
    </PageSection>
  );
}
