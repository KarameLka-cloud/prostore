import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import GradientText from "@/shared/ui/custom/gradient-text";

export default function HeroSection() {
  return (
    <section className="my-18">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div className="text-center md:text-left">
          <h1 className="mb-6 text-[40px] font-extrabold leading-[1.05] tracking-[-1px] sm:text-5xl lg:text-[60px] lg:tracking-[-2px]">
            <GradientText>При покупке консоли у Нас</GradientText>
          </h1>

          <p className="mx-auto mb-9 max-w-115 text-[17px] leading-relaxed text-white/80 md:mx-0">
            🔑 Мы полностью настраиваем ее под ключ
            <br />
            🌍 Создаем личный зарубежный
            <br />
            🎁 Аккаунт в подарок и подписка на игры
          </p>

          <CatalogButton className="hidden md:mx-0 md:flex" />
        </div>

        <div className="relative mx-auto w-full max-w-100">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[32px] bg-linear-to-br from-brand-violet/35 to-brand-pink/30 blur-2xl"
          />
          <div className="relative aspect-768/1365 overflow-hidden rounded-[24px] border border-white/10 bg-glass shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <Image
              src="/images/pages/console-purchase-hero.png"
              alt="Консоль PlayStation 5 и игра GTA V в рекламе Prostore"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 42vw, 400px"
              className="object-contain"
            />
          </div>
        </div>

        <CatalogButton className="md:hidden" />
      </div>
    </section>
  );
}

function CatalogButton({ className }: { className: string }) {
  return (
    <Link
      href="/catalog"
      className={`mx-auto flex w-fit items-center gap-2.5 rounded-full bg-linear-to-br from-brand-violet to-brand-pink px-8 py-4.25 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.4)] transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(139,92,246,0.6)] ${className}`}
    >
      Смотреть каталог
      <ArrowRight className="size-4" />
    </Link>
  );
}
