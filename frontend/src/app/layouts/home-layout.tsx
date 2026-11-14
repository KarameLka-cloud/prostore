import { Suspense } from "react";
import { connection } from "next/server";
import { BackgroundBlob } from "@/widgets/background-blobs";
import { HeaderSection } from "@/widgets/header-section";
import { FooterSection } from "@/widgets/footer-section";
import { getSession } from "@/features/auth/lib/cookies";

async function SessionHeader() {
  await connection();
  const session = await getSession();

  return <HeaderSection userName={session?.login} />;
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black min-h-screen z-0">
      <div className="mx-auto max-w-7xl px-4">
        <BackgroundBlob />
        <Suspense fallback={<HeaderSection />}>
          <SessionHeader />
        </Suspense>
        <main className="mx-4">{children}</main>
        <FooterSection />
      </div>
    </div>
  );
}
