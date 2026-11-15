import { ImagePlus, Sparkles } from "lucide-react";

import GlassCard from "@/shared/ui/custom/glass-card";
import GradientText from "@/shared/ui/custom/gradient-text";
import IconBadge from "@/shared/ui/custom/icon-badge";
import PageHeader from "@/shared/ui/custom/page-header";
import PageSection from "@/shared/ui/custom/page-section";

export default function AboutPage() {
  return (
    <PageSection>
      <PageHeader>О нас</PageHeader>

      <div className="mx-auto mb-16 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard overlay="glow" padding="lg">
          <p className="text-[17px] leading-relaxed text-white/80">
            Привет! Я <span className="font-semibold text-white">Андрей</span> —
            основатель ProStore. Если вы дочитали до этого раздела, значит, вам
            действительно интересно, кто стоит за магазином и у кого вы
            покупаете технику. Поэтому расскажу немного о нас.
          </p>
        </GlassCard>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-[28px] bg-linear-to-br from-brand-violet/25 to-brand-pink/25 opacity-70 blur-2xl"
          />

          <GlassCard padding="none" className="p-3">
            <div className="flex aspect-5/5 flex-col items-center justify-center gap-4 rounded-[18px] border border-dashed border-white/20 bg-linear-to-br from-white/5 via-transparent to-white/5 px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <ImagePlus className="size-6 text-white/60" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-white">
                  Фото основателя
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">
                  Здесь скоро появится фотография
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard overlay="glow" padding="lg" className="mx-auto mb-16">
        <div className="flex justify-center items-center gap-3">
          <IconBadge icon={Sparkles} />
          <h2 className="text-xl font-bold text-white">
            ProStore — это не просто магазин приставок и техники
          </h2>
          <IconBadge icon={Sparkles} />
        </div>
        <p className="mt-4 text-[17px] leading-relaxed text-white/80">
          Мы любим технику сами, поэтому прекрасно понимаем, что покупка новой
          PlayStation, Nintendo, Dyson, DJI или любого другого устройства — это
          всегда немного больше, чем просто коробка с гаджетом. Это ожидание.
          Это эмоции от распаковки. Это первое включение. И то самое чувство:
          «Вот оно, я наконец-то это купил!» 😎. Именно поэтому нам важно не
          просто продать вам товар. Нам важно, чтобы вы не пожалели о покупке.
          Чтобы вам нормально рассказали, что вы покупаете. Помогли выбрать
          подходящую модель. Настроили, если это необходимо. Ответили на вопросы
          после покупки. И самое главное — чтобы с вами разговаривали
          по-человечески, а не относились как к очередному номеру заказа.
        </p>
      </GlassCard>

      <GlassCard overlay="glow" padding="lg" className="mx-auto max-w-3xl">
        <div className="space-y-4 text-[17px] leading-relaxed text-white/80">
          <p>
            Мы не хотим быть магазином, куда человек пришёл один раз и забыл.
            Хотим быть тем самым магазином, куда возвращаются. За новой
            приставкой. За камерой. За подарком. Или просто за советом: «А что
            сейчас взять?» 😄.
          </p>
          <p>
            Для нас клиент — это не просто покупатель. Это человек, которому мы
            однажды помогли выбрать технику. И которому всегда будем рады снова.
          </p>
          <p className="pt-2 text-center text-lg font-semibold">
            <GradientText>💜 Спасибо, что выбираете ProStore 💜</GradientText>
          </p>
          <p className="text-center text-white/80">
            🐵 Просто больше, чем техника 🐒
          </p>
          <p className="text-center text-white/80">
            👋🏻 До встречи в магазине! 👋🏻
          </p>
        </div>
      </GlassCard>
    </PageSection>
  );
}
