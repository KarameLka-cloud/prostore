import Image from "next/image";
import { Send, ClipboardCheck, Store } from "lucide-react";

import { contactConfig } from "@/shared/config/site";
import GlassCard from "@/shared/ui/custom/glass-card";
import PageHeader from "@/shared/ui/custom/page-header";
import PageSection from "@/shared/ui/custom/page-section";

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
      contactConfig.address,
      "Очная диагностика (5-10 минут)",
      "Выплатим деньги или оформим обмен на выбранную игру / приставку",
    ],
  },
];

export default function TradeInPage() {
  return (
    <PageSection>
      <PageHeader>Как работает TradeIn — в 3 шага</PageHeader>

      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          {STEPS.map(({ icon: Icon, title, description, details }, index) => (
            <GlassCard
              key={title}
              hover
              overlay="hover"
              className="rounded-[24px]"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink text-sm font-bold text-white shadow-lg">
                  {index + 1}
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
                  <Icon className="size-5" />
                </div>

                <h2 className="text-lg font-semibold text-white">{title}</h2>
              </div>

              <p className="mb-4 text-[15px] leading-relaxed text-white/80">
                {description}
              </p>

              {details.length > 0 && (
                <ul className="space-y-2">
                  {details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 text-sm text-white/80"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-linear-to-r from-brand-violet to-brand-pink" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>
          ))}
        </div>

        <div className="flex items-start justify-center">
          <Image
            src="/images/pages/tradein.png"
            alt="TradeIn"
            width={600}
            height={500}
            loading="eager"
            className="w-full rounded-[24px] border border-white/10 bg-glass object-cover shadow-2xl"
          />
        </div>
      </div>
    </PageSection>
  );
}
