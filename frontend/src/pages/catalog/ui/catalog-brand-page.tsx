import type {
  CatalogBrand,
  CatalogCategory,
  CatalogProduct,
} from "@/features/catalog-management/api";
import PageSection from "@/shared/ui/custom/page-section";
import QueryState from "@/shared/ui/custom/query-state";
import CatalogBreadcrumbs from "./catalog-breadcrumbs";
import CatalogCard from "./catalog-card";

interface CatalogBrandPageProps {
  categorySlug: string;
  brandSlug: string;
  category: CatalogCategory | null;
  brand: CatalogBrand | null;
  products: CatalogProduct[];
  error?: string;
}

export default function CatalogBrandPage({
  categorySlug,
  brandSlug,
  category,
  brand,
  products,
  error,
}: CatalogBrandPageProps) {
  const sortedProducts = [...products].sort(
    (left, right) => Number(left.price) - Number(right.price),
  );

  return (
    <PageSection>
      <CatalogBreadcrumbs
        items={[
          { label: "Каталог", href: "/catalog" },
          {
            label: category?.name ?? categorySlug,
            href: category
              ? `/catalog/${encodeURIComponent(categorySlug)}`
              : undefined,
          },
          { label: brand?.name ?? brandSlug },
        ]}
      />
      <QueryState
        loadingText="Загрузка товаров..."
        error={error}
        empty={sortedProducts.length === 0}
        emptyText="У этого бренда пока нет товаров в выбранной категории."
      >
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {sortedProducts.map((product) => (
            <li key={product.id}>
              <CatalogCard
                href={`/catalog/${encodeURIComponent(categorySlug)}/${encodeURIComponent(brandSlug)}/${encodeURIComponent(product.slug)}`}
                title={product.name}
                price={product.price}
                oldPrice={product.old_price}
                image={
                  product.images[0]
                    ? { src: product.images[0].path, alt: product.name }
                    : null
                }
              />
            </li>
          ))}
        </ul>
      </QueryState>
    </PageSection>
  );
}
