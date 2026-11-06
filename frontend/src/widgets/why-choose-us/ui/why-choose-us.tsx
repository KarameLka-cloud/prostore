import {
  CheckCircle2,
  Shield,
  Heart,
  Truck,
  RefreshCw,
  Wrench,
} from "lucide-react";

export default function WhyChooseUs() {
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
  ];

  return (
    <section className="my-18">
      <h3 className="mb-8 text-center text-white text-2xl font-bold tracking-tight sm:text-3xl">
        Почему нас выбирают?
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((reason, index) => {
          const Icon = reason.icon;
          return (
            <div
              key={index}
              className="flex group overflow-hidden rounded-[20px] border border-white/10 bg-glass p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]"
            >
              <div className="pointer-events-none absolute -inset-px rounded-[20px] bg-linear-to-br from-brand-violet/5 via-brand-blue/5 to-brand-pink/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
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
    </section>
  );
}
