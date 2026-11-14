"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, User, X } from "lucide-react";

import { navConfig, siteConfig } from "@/shared/config/site";

export default function HeaderSection({ userName }: { userName?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userInitial = userName?.trim().charAt(0).toLocaleUpperCase("ru-RU");

  return (
    <>
      <header className="sticky top-4 z-50 mb-2">
        <div className="flex h-17 items-center justify-between rounded-full border border-white/10 bg-panel py-2 pl-5 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl md:py-3 md:pl-7 md:pr-3">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              width={720}
              height={389}
              loading="eager"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <nav className="hidden gap-8 lg:flex" aria-label="Основная навигация">
            {navConfig.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/login"
            aria-label={userName ? `Профиль: ${userName}` : "Войти в аккаунт"}
            className="ml-auto mr-6 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:ml-0"
          >
            {userInitial ? (
              <span className="text-sm font-bold">{userInitial}</span>
            ) : (
              <User className="size-5" />
            )}
          </Link>

          <button
            type="button"
            className="relative z-50 flex size-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <div
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-panel/95 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          onClick={(event) => event.stopPropagation()}
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
              <Link
                key={item.href}
                href={item.href}
                className="py-4 text-center text-lg font-medium text-muted-foreground transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
