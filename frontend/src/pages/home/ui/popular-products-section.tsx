import type { CatalogProduct } from "@/features/catalog-management/api";
import PageSection from "@/shared/ui/custom/page-section";
import QueryState from "@/shared/ui/custom/query-state";
import SectionTitle from "@/shared/ui/custom/section-title";
import CatalogCard from "@/pages/catalog/ui/catalog-card";

interface PopularProductsSectionProps {
  products: CatalogProduct[];
  error?: string;
}

export default function PopularProductsSection({
  products,
  error,
}: PopularProductsSectionProps) {
  return (
    <PageSection className="pt-8 sm:pt-12">
      <SectionTitle>Популярные товары</SectionTitle>
      <QueryState
        loadingText="Загрузка популярных товаров..."
        error={error}
        empty={products.length === 0}
        emptyText="Популярные товары пока не выбраны."
      >
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((product) => (
            <li key={product.id}>
              <CatalogCard
                href={`/catalog/${encodeURIComponent(product.category.slug)}/${encodeURIComponent(product.brand.slug)}/${encodeURIComponent(product.slug)}`}
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
