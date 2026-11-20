import {
  CheckCircle2,
  Heart,
  RefreshCw,
  Shield,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

interface Reasons {
  icon: LucideIcon;
  title: string;
}

export const REASONS: Reasons[] = [
  {
    icon: Shield,
    title: "Проверенная техника и оригинальные товары",
  },
  {
    icon: CheckCircle2,
    title: "Честные цены и условия",
  },
  {
    icon: Heart,
    title: "Гарантия и проверка перед покупкой",
  },
  {
    icon: RefreshCw,
    title: "Рассрочка и Trade-in",
  },
  {
    icon: Truck,
    title: "Доставка по городу и Авито Доставка",
  },
  {
    icon: Wrench,
    title: "Настройка техники и помощь после покупки",
  },
];
