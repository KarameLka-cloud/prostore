import {
  CheckCircle2,
  Heart,
  RefreshCw,
  Shield,
  Truck,
  Wrench,
} from "lucide-react";
import { type ReasonItem } from "./types";

export const REASONS: ReasonItem[] = [
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
