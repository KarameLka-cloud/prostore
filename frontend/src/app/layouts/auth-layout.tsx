import { BackgroundBlob } from "@/widgets/background-blobs";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black min-h-screen z-0">
      <div className="mx-auto max-w-7xl px-3">
        <BackgroundBlob />
        <main>{children}</main>
      </div>
    </div>
  );
}
