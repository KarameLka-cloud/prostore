import { BackgroundBlob } from "@/widgets/background-blobs";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate min-h-screen bg-black">
      <BackgroundBlob />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6">
        <main className="flex flex-1 items-center justify-center py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
