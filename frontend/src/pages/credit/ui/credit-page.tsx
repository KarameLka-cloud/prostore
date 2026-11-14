import {
  Banknote,
  FileCheck,
  Info,
  MapPin,
  Percent,
  Smartphone,
  UserCheck,
} from "lucide-react";

import GlassCard from "@/shared/ui/custom/glass-card";
import IconBadge from "@/shared/ui/custom/icon-badge";
import PageHeader from "@/shared/ui/custom/page-header";
import PageSection from "@/shared/ui/custom/page-section";
import SectionTitle from "@/shared/ui/custom/section-title";

const CONDITIONS = [
  { icon: FileCheck, title: "Паспорт РФ" },
  { icon: MapPin, title: "Наличие постоянной регистрации" },
  { icon: UserCheck, title: "Возраст от 18 до 70 лет" },
  { icon: Smartphone, title: "Наличие мобильного номера телефона" },
  {
    icon: Banknote,
    title: "Первоначальный взнос — по желанию, может отсутствовать",
  },
];

const RATES = [
  { months: "6 месяцев", rate: "13%" },
  { months: "12 месяцев", rate: "18%" },
  { months: "24 месяца", rate: "27%" },
];

export default function CreditPage() {
  return (
    <PageSection>
      <PageHeader>Рассрочка</PageHeader>

      <GlassCard
        overlay="glow"
        padding="lg"
        className="mx-auto mb-16 max-w-3xl"
      >
        <div className="flex justify-center items-center gap-3">
          <IconBadge icon={Banknote} />
          <h2 className="text-xl font-bold text-white">
            Любой товар можно приобрести в рассрочку или кредит
          </h2>
        </div>
        <p className="text-center mt-4 text-[17px] leading-relaxed text-muted-foreground">
          Специально для Вас — мы подготовили лучшие кредитные предложения
        </p>
      </GlassCard>

      <div className="mb-16">
        <SectionTitle>Условия рассрочки</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONDITIONS.map(({ icon, title }) => (
            <GlassCard
              key={title}
              padding="sm"
              hover
              overlay="hover"
              className="rounded-[20px]"
            >
              <IconBadge
                icon={icon}
                size="sm"
                variant="outline"
                className="mb-3"
              />
              <p className="text-[15px] font-medium text-white">{title}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <GlassCard overlay="glow" padding="lg" className="mb-16">
        <div className="flex justify-center items-center gap-3">
          <IconBadge icon={Percent} variant="outline" />
          <h2 className="text-lg font-semibold text-white">
            Потеря процента за срок пользования рассрочки — включается в
            стоимость
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {RATES.map(({ months, rate }) => (
            <div
              key={months}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-colors duration-300 hover:border-white/20"
            >
              <div className="mb-2 text-3xl font-bold text-white">{rate}</div>
              <div className="text-sm text-muted-foreground">{months}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard
        overlay="glow"
        padding="sm"
        className="mx-auto max-w-3xl lg:p-8"
      >
        <div className="flex justify-center items-start gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Точную сумму для оформления Вам скажут менеджеры
          </p>
        </div>
      </GlassCard>
    </PageSection>
  );
}
