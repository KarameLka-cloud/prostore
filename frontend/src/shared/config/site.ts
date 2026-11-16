export interface SiteConfig {
  name: string;
  description: string;
}

export interface SiteContact {
  address: string;
  phone: string;
  phoneHref: string;
  hours: string;
  telegram: string;
  whatsapp: string;
}

export interface NavConfig {
  label: string;
  href: string;
}

export interface ContactsConfig {
  title: string;
  description?: string;
  mapUrl: string;
  mapEmbedUrl?: string;
}

export type SocialIcon = "telegram" | "whatsapp" | "phone";

export interface SocialLinkConfig {
  label: string;
  href: string;
  icon: SocialIcon;
}

export const siteConfig: SiteConfig = {
  name: "PROSTORE - магазин цифровой электроники",
  description:
    "Премиальная электроника с безупречным сервисом. Только оригинальные устройства и честные цены",
};

export const contactConfig: SiteContact = {
  address: "г. Иркутск, ул. Иркутской 30-й Дивизии, 55",
  phone: "+7 (000) 000-00-00",
  phoneHref: "tel:+70000000000",
  hours: "Пн–Вс: 10:00–20:00",
  telegram: "https://t.me/prostore",
  whatsapp: "https://wa.me/70000000000",
};

export const contactsConfig: ContactsConfig = {
  title: "Приезжайте в наш магазин",
  description:
    "Покажем технику вживую, поможем с выбором и настроим устройство на месте. Мы находимся в центре Иркутска — до нас легко добраться на машине и общественном транспорте.",
  mapUrl: `https://yandex.ru/maps/?text=${encodeURIComponent(contactConfig.address)}`,
  mapEmbedUrl:
    "https://yandex.ru/map-widget/v1/?um=constructor%3Af5a9917777ce91c93a3a397ee9e189ca66c0da3f006d669671d1c05ebb6357d3&source=constructor",
};

export const socialLinksConfig: SocialLinkConfig[] = [
  { label: "Telegram", href: contactConfig.telegram, icon: "telegram" },
  { label: "WhatsApp", href: contactConfig.whatsapp, icon: "whatsapp" },
  { label: "Позвонить", href: contactConfig.phoneHref, icon: "phone" },
];

export const navConfig: NavConfig[] = [
  { label: "Каталог", href: "/catalog" },
  { label: "TradeIn", href: "/tradein" },
  { label: "Рассрочка", href: "/credit" },
  { label: "Аренда", href: "/rental" },
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];
