import type { Metadata } from "next";
import { Roboto, Roboto_Mono, Inter } from "next/font/google";
import "@/app/styles/globals.css";
import { cn } from "@/shared/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
      className={cn(
        "h-full",
        "antialiased",
        robotoSans.variable,
        robotoMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="relative">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full blur-[120px] opacity-50 w-125 h-125 bg-[#8b5cf6] -top-37.5 -left-37.5" />
          <div className="absolute rounded-full blur-[120px] opacity-50 w-100 h-100 bg-[#3b82f6] top-80 -right-25" />
          <div className="absolute rounded-full blur-[120px] opacity-30 w-114 h-114 bg-[#ec4899] -bottom-37.5 left-100" />
        </div>

        <main className="relative z-10 mx-auto max-w-7xl">{children}</main>
      </body>
    </html>
  );
}
