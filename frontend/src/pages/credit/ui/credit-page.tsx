import PageHeader from "@/shared/ui/custom/page-header";
import {
  Banknote,
  Calendar,
  UserCheck,
  Smartphone,
  MapPin,
  FileCheck,
  Percent,
  Info,
} from "lucide-react";

const CONDITIONS = [
  {
    icon: FileCheck,
    title: "Паспорт РФ 🇷🇺",
  },
  {
    icon: MapPin,
    title: "Наличие постоянной регистрации 🇷🇺",
  },
  {
    icon: UserCheck,
    title: "Возраст от 18 до 70 лет",
  },
  {
    icon: Smartphone,
    title: "Наличие мобильного номера телефона",
  },
  {
    icon: Banknote,
    title: "Первоначальный взнос — по желанию, может отсутствовать",
  },
];

const RATES = [
  {
    months: "6 месяцев",
    rate: "13%",
  },
  {
    months: "12 месяцев",
    rate: "18%",
  },
  {
    months: "24 месяца",
    rate: "27%",
  },
];

export default function CreditPage() {
  return (
    <section className="px-7 pb-20">
      <PageHeader>Рассрочка</PageHeader>

      {/* Intro */}
      <div className="mx-auto mb-16 max-w-3xl">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-gradient-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet via-brand-blue to-brand-pink">
                <Banknote className="size-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Любой товар можно приобрести в рассрочку или кредит
              </h3>
            </div>
            <p className="text-[17px] leading-relaxed text-muted-foreground">
              Специально для Вас — мы подготовили лучшие кредитные предложения
            </p>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="mb-16">
        <h3 className="mb-8 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Условия рассрочки
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONDITIONS.map((condition, index) => {
            const Icon = condition.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-glass p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]"
              >
                <div className="pointer-events-none absolute -inset-px rounded-[20px] bg-gradient-to-br from-brand-violet/5 via-brand-blue/5 to-brand-pink/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Icon className="size-4 text-white" />
                  </div>
                  <p className="text-[15px] font-medium text-white">
                    {condition.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rates */}
      <div className="mb-16">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-gradient-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Percent className="size-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Потеря процента за срок пользования рассрочки — включается в
                стоимость:
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {RATES.map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-[16px] border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:border-white/20"
                >
                  <div className="mb-2 text-3xl font-bold text-white">
                    {item.rate}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.months}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[17px] leading-relaxed text-muted-foreground">
              Цена всегда указана за наличный расчет 💰
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-6 backdrop-blur-xl lg:p-8">
          <div className="absolute -inset-px rounded-[24px] bg-gradient-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative flex items-start gap-3">
            <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Точную сумму для оформления Вам скажут менеджеры
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
