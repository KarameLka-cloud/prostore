import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";

import { contactConfig, navConfig, siteConfig } from "@/shared/config/site";
import { getCurrentYear } from "@/shared/lib";

export default async function FooterSection() {
  const currentYear = await getCurrentYear();

  return (
    <footer className="border-t border-white/10 pb-8 pt-12">
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="space-y-3 text-white">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand-violet" />
            <span className="text-[15px]">{contactConfig.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="size-4 shrink-0 text-brand-violet" />
            <a
              href={contactConfig.phoneHref}
              className="text-[15px] transition-colors hover:text-muted-foreground"
            >
              {contactConfig.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 shrink-0 text-brand-violet" />
            <span className="text-[15px]">{contactConfig.hours}</span>
          </div>
        </div>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:justify-end"
          aria-label="Навигация в подвале"
        >
          {navConfig.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] text-muted-foreground transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-muted-foreground">
        <span>
          © {currentYear} {siteConfig.name}
        </span>
        <span>🍬 by KarameLka 🍬</span>
      </div>
    </footer>
  );
}
