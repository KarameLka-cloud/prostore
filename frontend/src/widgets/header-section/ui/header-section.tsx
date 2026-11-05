"use client";

import { useState } from "react";
import Link from "next/link";
import NavLink from "next/link";
import { navConfig } from "@/app/configs/site";
import { Menu, User, X } from "lucide-react";

export default function HeaderSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-4 z-50 mb-2">
        <div className="flex h-17 items-center justify-between rounded-full border border-white/10 bg-panel py-2 pl-5 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl md:py-3 md:pl-7 md:pr-3">
          <NavLink
            href="/"
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.5px]"
          >
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-linear-to-br from-brand-violet to-brand-pink text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]"></span>
            <span className="text-white">ПРОСТОР</span>
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

          <Link
            href="/login"
            className="flex size-10 ml-auto mr-6 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <User className="size-5" />
          </Link>

          {/* Burger button */}
          <button
            type="button"
            className="relative z-50 flex size-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className="w-full max-w-sm transform bg-panel/95 p-8 transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-8 flex items-center justify-end">
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Закрыть меню"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-2" aria-label="Мобильная навигация">
            {navConfig.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="py-4 text-center text-lg font-medium text-muted transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
