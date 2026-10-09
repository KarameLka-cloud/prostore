export type NavLink = {
  name: string;
  url: string;
};

export const NAV_LINKS: NavLink[] = [
  {
    name: "Каталог",
    url: "/catalog",
  },
  {
    name: "Trade-in",
    url: "/trade-in",
  },
  {
    name: "Инструкции",
    url: "/instructions",
  },
  {
    name: "О нас",
    url: "/about",
  },
];
