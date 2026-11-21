import { Suspense } from "react";
import { connection } from "next/server";
import { BackgroundBlob } from "@/widgets/background-blobs";
import { HeaderSection } from "@/widgets/header-section";
import { FooterSection } from "@/widgets/footer-section";
import { HomeBenefits } from "@/widgets/home-benefits";
import { getSession } from "@/features/auth/lib/cookies";
import { catalogPublicRequest } from "@/features/catalog-management/server";
import type { CatalogProduct } from "@/features/catalog-management/api";

async function SessionHeader() {
  await connection();
  const [session, products] = await Promise.all([
    getSession(),
    catalogPublicRequest<CatalogProduct[]>("products").catch(() => []),
  ]);

  return (
    <HeaderSection
      userName={session?.name ?? session?.login}
      products={products}
    />
  );
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate min-h-screen bg-black">
      <BackgroundBlob />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Suspense fallback={<HeaderSection />}>
          <SessionHeader />
        </Suspense>
        <main className="mx-2 mt-18">{children}</main>
        <HomeBenefits />
        <FooterSection />
      </div>
    </div>
  );
}
