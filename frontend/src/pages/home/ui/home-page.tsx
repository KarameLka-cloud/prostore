import { HeroSection } from "@/widgets/hero-section/index";
import {
  CheckCircle2,
  Shield,
  Heart,
  Truck,
  RefreshCw,
  Wrench,
  MessageCircle,
} from "lucide-react";

export default function HomePage() {
  const REASONS = [
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
    {
      icon: MessageCircle,
      title: "Нормальное человеческое отношение",
    },
  ];

  return (
    <>
      <HeroSection />

      {/* Why choose us */}
      <div className="mb-16">
        <h3 className="mb-8 text-center text-white text-2xl font-bold tracking-tight sm:text-3xl">
          Почему нас выбирают?
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-glass p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]"
              >
                <div className="pointer-events-none absolute -inset-px rounded-[20px] bg-gradient-to-br from-brand-violet/5 via-brand-blue/5 to-brand-pink/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                    <Icon className="size-4" />
                  </div>
                  <p className="text-[15px] font-medium text-white">
                    {reason.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
