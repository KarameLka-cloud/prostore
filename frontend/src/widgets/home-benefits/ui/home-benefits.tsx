import { CreditCard, RefreshCw, Tag, Truck } from "lucide-react";
import Link from "next/link";

const BENEFITS = [
  {
    title: "Низкие цены",
    description: "У нас очень низкие цены на цифровую технику",
    href: "/catalog",
    icon: Tag,
    glow: "from-brand-violet/20 to-brand-pink/10",
  },
  {
    title: "TradeIn",
    description: "Меняем вашу технику на новую с доплатой",
    href: "/tradein",
    icon: RefreshCw,
    glow: "from-brand-blue/20 to-brand-violet/10",
  },
  {
    title: "Быстрая доставка",
    description: "Заказ любой техники и доставка от 3 дней",
    href: "/contacts",
    icon: Truck,
    glow: "from-brand-pink/20 to-brand-violet/10",
  },
  {
    title: "Доступные способы оплаты",
    description: "Наличными, картой или в кредит",
    href: "/credit",
    icon: CreditCard,
    glow: "from-brand-violet/20 to-brand-blue/10",
  },
];

export default function HomeBenefits() {
  return (
    <section className="my-16" aria-label="Преимущества PROSTORE">
      <div className="grid gap-4 md:grid-cols-2">
        {BENEFITS.map(({ title, description, href, icon: Icon, glow }) => (
          <Link
            key={title}
            href={href}
            className="group relative flex min-h-56 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-glass p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-violet"
          >
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-linear-to-br ${glow} opacity-60 transition-opacity group-hover:opacity-100`}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -right-8 text-white/[0.08] transition-transform duration-300 group-hover:scale-105 group-hover:text-white/[0.12]"
            >
              <Icon className="size-44" strokeWidth={1} />
            </div>
            <h2 className="relative max-w-[75%] text-2xl font-semibold tracking-tight text-white sm:text-[27px]">
              {title}
            </h2>
            <p className="relative mt-3 max-w-[75%] text-[15px] leading-relaxed text-white/75 sm:text-base">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
