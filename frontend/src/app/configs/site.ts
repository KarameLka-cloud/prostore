export interface SiteConfig {
  name: string;
  description: string;
}

export interface NavConfig {
  label: string;
  href: string;
}

export const siteConfig: SiteConfig = {
  name: "PROSTORE - магазин цифровой электроники",
  description:
    "Премиальная электроника с безупречным сервисом. Только оригинальные устройства и честные цены",
};

export const navConfig: NavConfig[] = [
  { label: "Каталог", href: "catalog" },
  { label: "TradeIn", href: "tradein" },
  { label: "Рассрочка", href: "credit" },
  { label: "О нас", href: "about" },
  { label: "Контакты", href: "contacts" },
];

export const footerConfig = [];
