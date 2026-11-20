import Link from "next/link";
import { BENEFITS } from "../model/benefits";

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
              className="pointer-events-none absolute -bottom-12 -right-8 text-white/8 transition-transform duration-300 group-hover:scale-105 group-hover:text-white/12"
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
