import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { siteConfig, navConfig } from "@/app/configs/site";
import { getCurrentYear } from "@/shared/lib";

export default async function FooterSection() {
  const currentYear = await getCurrentYear();

  return (
    <footer className="border-t border-white/10 pb-8 pt-12 mx-4">
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="text-white">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-violet" />
              <span className="text-[15px]">
                г. Иркутская, ул. 30-й иркутской дивизии, д. 55
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-brand-violet" />
              <a
                href="tel:+74951234567"
                className="text-[15px] hover:text-gray-400"
              >
                +7 (000) 000-00-00
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-brand-violet" />
              <span className="text-[15px]">Пн–Вс: 10:00–21:00</span>
            </div>
          </div>
        </div>

        <div className="text-white">
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {navConfig.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] text-muted transition-colors hover:text-gray-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-muted">
        <span>
          © {currentYear} {siteConfig.name}
        </span>
        <span>🍬 by KarameLka 🍬</span>
      </div>
    </footer>
  );
}
