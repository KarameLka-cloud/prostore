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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${robotoSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
