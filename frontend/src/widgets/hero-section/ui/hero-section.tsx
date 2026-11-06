import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/app/configs/site";

export default function HeroSection() {
  return (
    <section className="my-18">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div>
          <h1 className="mb-6 text-[40px] font-extrabold leading-[1.05] tracking-[-1px] sm:text-5xl lg:text-[60px] lg:tracking-[-2px]">
            <em className="bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink bg-clip-text not-italic text-transparent">
              Технологии в новом свете
            </em>
          </h1>

          <p className="mb-9 max-w-115 text-[17px] text-muted">
            {siteConfig.description}
          </p>

          <Link
            href="catalog"
            className="inline-flex items-center text-white hover:gap-3"
          >
            Смотреть каталог
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="relative aspect-square items-center justify-center hidden md:block">
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
