import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "@/app/styles/globals.css";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "ПроСтор - Магазин игровых приставок! PlayStation, Nintendo, Oculus, Steam, Xbox",
  description:
    "Магазин игровых приставок! PlayStation, Nintendo, Oculus, Steam, Xbox",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${robotoSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="relative">
        {/* Background blobs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full blur-[120px] opacity-50 w-125 h-125 bg-[#8b5cf6] -top-37.5 -left-37.5" />
          <div className="absolute rounded-full blur-[120px] opacity-50 w-100 h-100 bg-[#3b82f6] top-80 -right-25" />
          <div className="absolute rounded-full blur-[120px] opacity-30 w-114 h-114 bg-[#ec4899] -bottom-37.5 left-100" />
        </div>

        <Header />
        <main className="relative z-10 mx-auto max-w-7xl">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
