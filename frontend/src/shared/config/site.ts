export interface SiteConfig {
  name: string;
  description: string;
}

export interface SiteContact {
  address: string;
  phone: string;
  phoneHref: string;
  hours: string;
}

export interface NavConfig {
  label: string;
  href: string;
}

export const siteConfig: SiteConfig = {
  name: "ПРОСТОР - магазин цифровой электроники",
  description:
    "Премиальная электроника с безупречным сервисом. Только оригинальные устройства и честные цены",
};

export const contactConfig: SiteContact = {
  address: "г. Иркутск, ул. Иркутской 30-й Дивизии, 55",
  phone: "+7 (000) 000-00-00",
  phoneHref: "tel:+70000000000",
  hours: "Пн–Вс: 10:00–20:00",
};

export const navConfig: NavConfig[] = [
  { label: "Каталог", href: "/catalog" },
  { label: "TradeIn", href: "/tradein" },
  { label: "Рассрочка", href: "/credit" },
  { label: "Аренда", href: "/rental" },
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];
