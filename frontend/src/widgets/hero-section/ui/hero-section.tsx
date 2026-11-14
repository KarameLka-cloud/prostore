import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/shared/config/site";
import GradientText from "@/shared/ui/custom/gradient-text";

export default function HeroSection() {
  return (
    <section className="my-18">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div>
          <h1 className="mb-6 text-[40px] font-extrabold leading-[1.05] tracking-[-1px] sm:text-5xl lg:text-[60px] lg:tracking-[-2px]">
            <GradientText>Технологии в новом свете</GradientText>
          </h1>

          <p className="mb-9 max-w-115 text-[17px] text-muted-foreground">
            {siteConfig.description}
          </p>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-2.5 rounded-full bg-linear-to-br from-brand-violet to-brand-pink px-8 py-[17px] text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.4)] transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(139,92,246,0.6)]"
          >
            Смотреть каталог
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="relative hidden aspect-square items-center justify-center md:block">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[32px] bg-linear-to-br from-brand-violet/30 to-brand-pink/30 blur-2xl"
          />

          <div className="relative flex size-full items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-glass p-8 backdrop-blur-xl">
            <div className="relative size-[85%]">
              {/* <Image
                src={HERO_IMAGE}
                alt="Беспроводные наушники"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
