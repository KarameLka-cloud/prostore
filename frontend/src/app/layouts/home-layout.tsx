import { BackgroundBlob } from "@/widgets/background-blobs";
import { HeaderSection } from "@/widgets/header-section";
import { FooterSection } from "@/widgets/footer-section";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black min-h-screen z-0">
      <div className="mx-auto max-w-7xl px-3">
        <BackgroundBlob />
        <HeaderSection />
        <main>{children}</main>
        <FooterSection />
      </div>
    </div>
  );
}
