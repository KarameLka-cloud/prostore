import { HeroSection } from "@/widgets/hero-section/index";
import { WhyChooseUs } from "@/widgets/why-choose-us";
import PopularProductsSection from "./popular-products-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularProductsSection />
      <WhyChooseUs />
    </>
  );
}
