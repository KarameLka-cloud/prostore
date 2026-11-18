import { catalogPublicRequest } from "@/features/catalog-management/server";
import type { CatalogProduct } from "@/features/catalog-management/api";
import { getErrorMessage } from "@/shared/lib/errors";
import { HeroSection } from "@/widgets/hero-section/index";
import { WhyChooseUs } from "@/widgets/why-choose-us";
import PopularProductsSection from "./popular-products-section";

export default async function HomePage() {
  let products: CatalogProduct[] = [];
  let error: string | undefined;

  try {
    products = await catalogPublicRequest<CatalogProduct[]>("popular-products");
  } catch (cause) {
    error = getErrorMessage(cause, "Не удалось загрузить популярные товары");
  }

  return (
    <>
      <HeroSection />
      <PopularProductsSection products={products} error={error} />
      <WhyChooseUs />
    </>
  );
}
