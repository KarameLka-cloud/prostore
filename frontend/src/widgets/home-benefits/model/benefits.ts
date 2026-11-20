import {
  CreditCard,
  RefreshCw,
  Tag,
  Truck,
  type LucideIcon,
} from "lucide-react";

interface Benefits {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  glow: string;
}

export const BENEFITS: Benefits[] = [
  {
    title: "Низкие цены",
    description: "У нас очень низкие цены на цифровую технику",
    href: "/catalog",
    icon: Tag,
    glow: "from-brand-violet/20 to-brand-pink/10",
  },
  {
    title: "TradeIn",
    description: "Меняем вашу технику на новую с доплатой",
    href: "/tradein",
    icon: RefreshCw,
    glow: "from-brand-blue/20 to-brand-violet/10",
  },
  {
    title: "Быстрая доставка",
    description: "Заказ любой техники и доставка от 3 дней",
    href: "/contacts",
    icon: Truck,
    glow: "from-brand-pink/20 to-brand-violet/10",
  },
  {
    title: "Доступные способы оплаты",
    description: "Наличными, картой или в кредит",
    href: "/credit",
    icon: CreditCard,
    glow: "from-brand-violet/20 to-brand-blue/10",
  },
];
