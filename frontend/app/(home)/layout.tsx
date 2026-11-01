import { BackgroundBlob } from "@/widgets/background-blobs";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black min-h-screen z-0">
      <BackgroundBlob />
      <header className="max-w-5xl border-8 bg-amber-400">Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
