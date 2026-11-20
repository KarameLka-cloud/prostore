import type { CatalogCategory } from "@/features/catalog-management/api";
import PageSection from "@/shared/ui/custom/page-section";
import QueryState from "@/shared/ui/custom/query-state";
import CatalogBreadcrumbs from "./catalog-breadcrumbs";
import CatalogCard from "./catalog-card";

interface CatalogPageProps {
  categories: CatalogCategory[];
  error?: string;
}

export default function CatalogPage({ categories, error }: CatalogPageProps) {
  return (
    <PageSection>
      <CatalogBreadcrumbs items={[{ label: "Каталог" }]} />
      <QueryState
        loadingText="Загрузка категорий..."
        error={error}
        empty={categories.length === 0}
        emptyText="Категории пока не добавлены."
      >
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {categories.map((category) => (
            <li key={category.id}>
              <CatalogCard
                href={`/catalog/${encodeURIComponent(category.slug)}`}
                title={category.name}
                image={
                  category.image_path
                    ? { src: category.image_path, alt: category.name }
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
