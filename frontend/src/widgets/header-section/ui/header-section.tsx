"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Menu, Phone, Search, User, X } from "lucide-react";
import type { CatalogProduct } from "@/features/catalog-management/api";

import {
  navHeaderConfig,
  navConfig,
  siteConfig,
  contactConfig,
  contactsConfig,
} from "@/shared/config/site";

export default function HeaderSection({
  userName,
  products = [],
}: {
  userName?: string;
  products?: CatalogProduct[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userInitial = userName?.trim().charAt(0).toLocaleUpperCase("ru-RU");
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("ru-RU");
  const searchResults =
    normalizedQuery.length === 0
      ? []
      : products
          .filter((product) => {
            const searchableText = [
              product.name,
              product.category?.name,
              product.brand?.name,
            ]
              .filter(Boolean)
              .join(" ")
              .toLocaleLowerCase("ru-RU");

            return searchableText.includes(normalizedQuery);
          })
          .slice(0, 8);

  useEffect(() => {
    if (!mobileMenuOpen && !searchOpen) return;

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
  }, [mobileMenuOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  return (
    <>
      <div className="hidden lg:flex justify-between items-center p-2 text-white/80">
        <a
          href={contactsConfig.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition-colors hover:text-white text-sm"
        >
          <MapPin className="size-4 shrink-0" />
          <span>
            {contactConfig.city}
            <br />
            {contactConfig.street}
          </span>
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
          <span className="flex items-center gap-2 text-sm">
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

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label={searchOpen ? "Закрыть поиск" : "Открыть поиск"}
              aria-expanded={searchOpen}
            >
              <Search className="size-5" />
            </button>
            <Link
              href="/login"
              aria-label={userName ? `Профиль: ${userName}` : "Войти в аккаунт"}
              className="hidden size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:flex"
            >
              {userInitial ? (
                <span className="text-sm font-bold">{userInitial}</span>
              ) : (
                <User className="size-5" />
              )}
            </Link>
          </div>

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
        className={`fixed inset-0 z-[60] flex items-start overflow-hidden bg-black/50 p-4 pt-16 backdrop-blur-md transition-opacity duration-300 sm:pt-20 ${
          searchOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => {
          setSearchOpen(false);
          setSearchQuery("");
        }}
        aria-hidden={!searchOpen}
        inert={!searchOpen}
      >
        <div
          className="mx-auto flex h-[min(82vh,42rem)] w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-panel/80 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-8"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Поиск товаров"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">Поиск товаров</h2>
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              aria-label="Закрыть поиск"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 px-4">
            <Search className="mr-3 size-5 shrink-0 text-white/50" />
            <input
              autoFocus
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Введите название товара"
              aria-label="Поиск товаров"
              className="h-14 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40 [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none sm:text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Очистить поиск"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            {!normalizedQuery ? null : searchResults.length > 0 ? (
              <ul className="grid gap-2">
                {searchResults.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/catalog/${encodeURIComponent(product.category.slug)}/${encodeURIComponent(product.brand.slug)}/${encodeURIComponent(product.slug)}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-colors hover:border-white/10 hover:bg-white/10"
                    >
                      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/20 sm:size-16">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].path}
                            alt={product.name}
                            width={64}
                            height={64}
                            unoptimized
                            className="size-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-white/40">Нет фото</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-white sm:text-base">
                          {product.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-white/50">
                          {product.brand.name} · {product.category.name}
                        </p>
                      </div>
                      <span className="hidden shrink-0 text-sm font-bold text-white sm:block">
                        {Number(product.price).toLocaleString("ru-RU")} ₽
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-10 text-center text-sm text-white/50">
                Ничего не найдено
              </p>
            )}
          </div>
        </div>
      </div>

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
              <span>{contactConfig.address}</span>
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
