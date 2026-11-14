import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { contactConfig } from "@/shared/config/site";
import GlassCard from "@/shared/ui/custom/glass-card";
import IconBadge from "@/shared/ui/custom/icon-badge";
import PageHeader from "@/shared/ui/custom/page-header";
import PageSection from "@/shared/ui/custom/page-section";

const CONTACTS = [
  {
    icon: MapPin,
    label: "Адрес",
    value: contactConfig.address,
  },
  {
    icon: Phone,
    label: "Телефон",
    value: contactConfig.phone,
    href: contactConfig.phoneHref,
  },
  {
    icon: Clock,
    label: "Часы работы",
    value: contactConfig.hours,
  },
  {
    icon: MessageCircle,
    label: "Мессенджеры",
    value: "Напишите нам в любой удобный мессенджер",
  },
];

export default function ContactsPage() {
  return (
    <PageSection>
      <PageHeader>Контакты</PageHeader>

      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {CONTACTS.map(({ icon, label, value, href }) => (
          <GlassCard key={label} padding="sm" hover overlay="hover">
            <div className="flex items-start gap-4">
              <IconBadge icon={icon} size="sm" variant="outline" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="mt-1 block text-[15px] font-medium text-white transition-colors hover:text-brand-pink"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 text-[15px] font-medium text-white">
                    {value}
                  </p>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </PageSection>
  );
}
