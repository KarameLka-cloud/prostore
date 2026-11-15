import { Clock } from "lucide-react";

import { contactConfig } from "@/shared/config/site";
import GlassCard from "@/shared/ui/custom/glass-card";
import IconBadge from "@/shared/ui/custom/icon-badge";
import PageHeader from "@/shared/ui/custom/page-header";
import PageSection from "@/shared/ui/custom/page-section";

export default function RentalPage() {
  return (
    <PageSection>
      <PageHeader>Аренда</PageHeader>

      <GlassCard
        overlay="glow"
        padding="lg"
        className="mx-auto max-w-3xl text-center"
      >
        <div className="mb-5 flex justify-center">
          <IconBadge icon={Clock} />
        </div>
        <h2 className="text-xl font-bold text-white">
          Раздел аренды скоро появится
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-white/80">
          Пока мы готовим подробные условия, вы можете уточнить детали аренды
          техники по телефону.
        </p>
        <a
          href={contactConfig.phoneHref}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-br from-brand-violet to-brand-pink px-8 py-[15px] text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(139,92,246,0.6)]"
        >
          {contactConfig.phone}
        </a>
      </GlassCard>
    </PageSection>
  );
}
