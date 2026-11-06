import PageHeader from "@/shared/ui/custom/page-header";
import Image from "next/image";
import { Send, ClipboardCheck, Store } from "lucide-react";

const STEPS = [
  {
    icon: Send,
    title: "Отправьте заявку",
    description:
      "Напишите нам в любой удобный мессенджер с подробным описанием:",
    details: [
      "Название / модель приставки",
      "Состояние (отлично / хорошо / есть нюансы)",
      "Комплектность (что входит)",
      "Приложите 2-3 фото товара",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Получите предварительную оценку",
    description:
      "Наши менеджеры свяжутся с вами в течение дня, назовут сумму выкупа или размер скидки на новую покупку.",
    details: [],
  },
  {
    icon: Store,
    title: "Приезжайте в магазин",
    description: "Привезите товар к нам",
    details: [
      "г. Иркутск, ул. Иркутской 30-й Дивизии, 55",
      "Очная диагностика (5-10 минут)",
      "Выплатим деньги или оформим обмен на выбранную игру / приставку",
    ],
  },
];

export default function TradeInPage() {
  return (
    <section className="pb-20">
      <PageHeader>Как работает TradeIn — в 3 шага</PageHeader>

      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
              >
                <div className="pointer-events-none absolute -inset-px rounded-[24px] bg-linear-to-br from-brand-violet/5 via-brand-blue/5 to-brand-pink/5 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink text-sm font-bold text-white shadow-lg">
                    {index + 1}
                  </div>

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
                    <Icon className="size-5" />
                  </div>

                  <h4 className="text-lg font-semibold text-white">
                    {step.title}
                  </h4>
                </div>

                <p className="mb-4 text-[15px] leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {step.details.length > 0 && (
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-linear-to-r from-brand-violet to-brand-pink" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-start justify-center">
          <Image
            src="/images/pages/tradein.png"
            alt="TradeIn"
            width={600}
            height={500}
            className="w-full rounded-[24px] border border-white/10 bg-glass object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
