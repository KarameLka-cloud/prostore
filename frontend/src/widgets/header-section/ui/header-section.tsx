"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Menu, Phone, User, X } from "lucide-react";

import {
  navHeaderConfig,
  navConfig,
  siteConfig,
  contactConfig,
  contactsConfig,
} from "@/shared/config/site";

export default function HeaderSection({ userName }: { userName?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userInitial = userName?.trim().charAt(0).toLocaleUpperCase("ru-RU");

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="hidden lg:flex justify-between items-center px-2 py-4 text-white/80">
        <a
          href={contactsConfig.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition-colors hover:text-white"
        >
          <MapPin className="size-4 shrink-0" />
          <span>Г. Иркутск</span>
        </a>
        <nav className="hidden gap-8 lg:flex" aria-label="Основная навигация">
          {navHeaderConfig.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-1">
          <a
            href={contactConfig.phoneCityHref}
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <Phone className="size-4 shrink-0" />
            <span>{contactConfig.phoneCity}</span>
          </a>
          <span className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" />
            {contactConfig.hours}
          </span>
        </div>
      </div>
      <header className="sticky top-4 z-50 mb-2">
        <div className="flex h-17 items-center justify-between rounded-full border border-white/10 bg-panel/50 py-2 pl-5 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm md:py-3 md:pl-7 md:pr-3">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              width={1626}
              height={967}
              loading="eager"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden gap-8 lg:flex" aria-label="Основная навигация">
            {navConfig.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/login"
            aria-label={userName ? `Профиль: ${userName}` : "Войти в аккаунт"}
            className="hidden ml-auto mr-6 lg:flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:ml-0"
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
        className={`fixed inset-0 z-50 flex overflow-auto overscroll-contain bg-black/50 p-4 backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <div
          className="m-auto w-full max-w-sm rounded-3xl border border-white/10 bg-panel/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-end">
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Закрыть меню"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav
            className="flex flex-col gap-2 mb-6"
            aria-label="Мобильная навигация"
          >
            {navHeaderConfig.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-4 text-center text-lg font-medium text-white/80 transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
            <a
              href={contactsConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
            >
              <MapPin className="size-5 shrink-0" />
              <span>Г. Иркутск</span>
            </a>
            <a
              href={contactConfig.phoneCityHref}
              className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
            >
              <Phone className="size-5 shrink-0" />
              <span>{contactConfig.phoneCity}</span>
            </a>
            <span className="flex items-center gap-3 text-white/80">
              <Clock className="size-5 shrink-0" />
              <span>{contactConfig.hours}</span>
            </span>
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            <Link
              href="/login"
              aria-label={userName ? `Профиль: ${userName}` : "Войти в аккаунт"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-3 text-white transition-colors hover:bg-white/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              {userInitial ? (
                <span className="text-sm font-bold">{userInitial}</span>
              ) : (
                <User className="size-5" />
              )}
              <span>{userName ? userName : "Войти"}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
