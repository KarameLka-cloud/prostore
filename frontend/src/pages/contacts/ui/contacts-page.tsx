import { Clock, MapPin, Navigation, Phone } from "lucide-react";

import { contactConfig, contactsConfig } from "@/shared/config/site";
import GlassCard from "@/shared/ui/custom/glass-card";
import IconBadge from "@/shared/ui/custom/icon-badge";
import PageHeader from "@/shared/ui/custom/page-header";
import PageSection from "@/shared/ui/custom/page-section";
import SocialLinks from "@/shared/ui/custom/social-links";

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: "Адрес",
    values: [{ value: contactConfig.address, href: contactsConfig.mapUrl }],
  },
  {
    icon: Phone,
    label: "Телефон",
    values: [
      { value: contactConfig.phone, href: contactConfig.phoneHref },
      { value: contactConfig.phoneCity, href: "tel:+73952922242" },
    ],
  },
  {
    icon: Clock,
    label: "Время работы",
    values: [{ value: contactConfig.hours }],
  },
];

function ContactMap() {
  if (contactsConfig.mapEmbedUrl) {
    return (
      <iframe
        src={contactsConfig.mapEmbedUrl}
        title="Карта — как добраться до магазина"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-white/5 via-transparent to-white/5 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
        <MapPin className="size-6 text-white/60" />
      </div>
      <div>
        <p className="text-[15px] font-medium text-white">Карта проезда</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">
          Здесь скоро появится интерактивная карта
        </p>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <PageSection>
      <PageHeader>Контакты</PageHeader>
      {(contactsConfig.title || contactsConfig.description) && (
        <GlassCard overlay="glow" padding="lg" className="mb-6">
          <h2 className="text-xl font-bold text-white">
            {contactsConfig.title}
          </h2>
          {contactsConfig.description && (
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">
              {contactsConfig.description}
            </p>
          )}
        </GlassCard>
      )}

      <div className="grid gap-6 lg:items-stretch lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col gap-4 lg:min-h-105">
          <GlassCard
            padding="sm"
            overlay="glow"
            className="lg:flex-1"
            contentClassName="lg:flex lg:h-full lg:flex-col lg:justify-center"
          >
            <ul className="divide-y divide-white/10">
              {CONTACT_DETAILS.map(({ icon, label, values }) => (
                <li key={label} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <IconBadge icon={icon} size="sm" variant="outline" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/80">
                        {label}
                      </p>
                      {values.map(({ value, href }) => {
                        const isExternal = href?.startsWith("http");

                        return href ? (
                          <a
                            key={value}
                            href={href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            className="mt-1 block text-[15px] font-medium text-white transition-colors hover:text-brand-pink"
                          >
                            {value}
                          </a>
                        ) : (
                          <p
                            key={value}
                            className="mt-1 text-[15px] font-medium text-white"
                          >
                            {value}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard padding="sm" hover overlay="hover">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/80">
                  Мы в мессенджерах
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-white/80">
                  Ответим на вопросы и поможем с выбором
                </p>
              </div>
              <SocialLinks />
            </div>
          </GlassCard>
        </div>

        <GlassCard
          padding="none"
          overlay="glow"
          className="lg:h-full"
          contentClassName="lg:h-full"
        >
          <div className="relative aspect-4/3 w-full p-3 sm:aspect-16/10 lg:aspect-auto lg:h-full">
            <div className="relative size-full overflow-hidden rounded-[18px] border border-white/10 bg-white/5">
              <ContactMap />

              <a
                href={contactsConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[13px] font-medium text-white backdrop-blur-md transition-colors hover:border-white/30 hover:bg-black/75"
              >
                <Navigation className="size-4" aria-hidden="true" />
                Построить маршрут
              </a>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageSection>
  );
}
