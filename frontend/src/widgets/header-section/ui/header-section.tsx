import NavLink from "next/link";
import { siteConfig, navConfig } from "@/app/configs/site";

export default function HeaderSection() {
  return (
    <header className="sticky top-4 z-50 mb-2 px-3">
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between rounded-full border border-white/10 bg-panel py-2 pl-5 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl md:py-3 md:pl-7 md:pr-3">
        <NavLink
          href="/"
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.5px]"
        >
          <span className="flex size-8 items-center justify-center rounded-[10px] bg-linear-to-br from-brand-violet to-brand-pink text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]"></span>
          <span className="text-white">PROSTORE</span>
        </NavLink>

        <nav className="hidden gap-8 md:flex" aria-label="Основная навигация">
          {navConfig.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-gray-400"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex gap-2">
          <span className="h-10 w-10 bg-amber-600 rounded-full"></span>
          <span className="h-10 w-10 bg-amber-600 rounded-full"></span>
          {/* <IconButton label="Поиск">
            <Search className="size-4.5" />
          </IconButton>
          <CartButton /> */}
        </div>
      </div>
    </header>
  );
}
