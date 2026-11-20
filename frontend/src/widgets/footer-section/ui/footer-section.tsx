import Image from "next/image";
import Link from "next/link";

import { navHeaderConfig, siteConfig } from "@/shared/config/site";
import { getCurrentYear } from "@/shared/lib";
import SocialLinks from "@/shared/ui/custom/social-links";

export default async function FooterSection() {
  const currentYear = await getCurrentYear();

  return (
    <footer className="border-t border-white/10 pb-8 pt-12">
      <div className="grid gap-10 items-center sm:grid-cols-2">
        <div className="mx-auto sm:mx-0 flex w-34 flex-col items-center sm:items-start gap-5">
          <Link href="/" className="flex w-full">
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              width={1626}
              height={967}
              className="h-auto w-full object-contain"
            />
          </Link>

          <SocialLinks className="w-full" />
        </div>

        <nav
          className="flex flex-wrap items-start justify-center gap-x-6 gap-y-3 sm:justify-end"
          aria-label="Навигация в подвале"
        >
          {navHeaderConfig.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-10 flex flex-wrap justify-center sm:justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-white/80">
        <span>
          © {currentYear} {siteConfig.name}
        </span>
        <span>🍬 by KarameLka 🍬</span>
      </div>
    </footer>
  );
}
