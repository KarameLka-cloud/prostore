import GlassCard from "@/shared/ui/custom/glass-card";
import IconBadge from "@/shared/ui/custom/icon-badge";
import SectionTitle from "@/shared/ui/custom/section-title";
import { REASONS } from "../model/reasons";

export default function WhyChooseUs() {
  return (
    <section className="my-16">
      <SectionTitle>Почему нас выбирают?</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map(({ icon, title }) => (
          <GlassCard
            key={title}
            padding="sm"
            hover
            overlay="hover"
            className="rounded-[20px]"
          >
            <div className="flex items-center gap-3">
              <IconBadge icon={icon} size="sm" variant="outline" />
              <p className="leading-none text-[15px] font-medium text-white">
                {title}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
