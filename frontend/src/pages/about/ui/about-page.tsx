import PageHeader from "@/shared/ui/custom/page-header";
import { Handshake, Sparkles, Heart, ImagePlus } from "lucide-react";

export default function AboutPage() {
  return (
    <section className="px-7 pb-20">
      <PageHeader>О нас</PageHeader>

      {/* Intro + photo */}
      <div className="mx-auto mb-16 grid max-w-5xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-linear-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink shadow-[0_8px_24px_rgba(139,92,246,0.35)]">
                <Handshake className="size-5 text-white" />
              </div>
              <span className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Основатель магазина
              </span>
            </div>

            <p className="text-[17px] leading-relaxed text-muted-foreground">
              Привет! Я <span className="font-semibold text-white">Андрей</span>{" "}
              — основатель ProStore. Если вы дочитали до этого раздела, значит,
              вам действительно интересно, кто стоит за магазином и у кого вы
              покупаете технику. Поэтому расскажу немного о нас.
            </p>

            <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-violet to-brand-pink text-sm font-bold text-white">
                А
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white">Андрей</p>
                <p className="text-[13px] text-muted-foreground">
                  Основатель ProStore
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo slot */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-[28px] bg-linear-to-br from-brand-violet/25 to-brand-pink/25 opacity-70 blur-2xl"
          />

          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
            <div className="relative flex aspect-[4/5] flex-col items-center justify-center gap-4 overflow-hidden rounded-[18px] border border-dashed border-white/20 bg-linear-to-br from-white/5 via-transparent to-white/5 px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <ImagePlus className="size-6 text-white/60" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-white">
                  Фото основателя
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  Здесь скоро появится фотография
                </p>
              </div>

              {/*
                Заготовка под фотографию.
                Положите файл в public/images/pages/about.jpg,
                добавьте импорт Image из "next/image"
                и замените блок выше на:

                <Image
                  src="/images/pages/about.jpg"
                  alt="Андрей — основатель ProStore"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              */}
            </div>
          </div>
        </div>
      </div>

      {/* About the store */}
      <div className="mx-auto mb-16 max-w-5xl">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-linear-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink">
                <Sparkles className="size-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                ProStore — это не просто магазин приставок и техники
              </h3>
            </div>
            <p className="text-[17px] leading-relaxed text-muted-foreground">
              Мы любим технику сами, поэтому прекрасно понимаем, что покупка
              новой PlayStation, Nintendo, Dyson, DJI или любого другого
              устройства — это всегда немного больше, чем просто коробка с
              гаджетом. Это ожидание. Это эмоции от распаковки. Это первое
              включение. И то самое чувство: «Вот оно, я наконец-то это купил!»
              😎. Именно поэтому нам важно не просто продать вам товар. Нам
              важно, чтобы вы не пожалели о покупке. Чтобы вам нормально
              рассказали, что вы покупаете. Помогли выбрать подходящую модель.
              Настроили, если это необходимо. Ответили на вопросы после покупки.
              И самое главное — чтобы с вами разговаривали по-человечески, а не
              относились как к очередному номеру заказа.
            </p>
          </div>
        </div>
      </div>

      {/* Closing */}
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-linear-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative">
            <div className="mb-6 flex justify-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink shadow-[0_8px_24px_rgba(139,92,246,0.35)]">
                <Heart className="size-6 text-white" />
              </div>
            </div>

            <div className="space-y-4 text-[17px] leading-relaxed text-muted-foreground">
              <p>
                Мы не хотим быть магазином, куда человек пришёл один раз и забыл.
                Хотим быть тем самым магазином, куда возвращаются. За новой
                приставкой. За камерой. За подарком. Или просто за советом: «А
                что сейчас взять?» 😄.
              </p>
              <p>
                Для нас клиент — это не просто покупатель. Это человек, которому
                мы однажды помогли выбрать технику. И которому всегда будем рады
                снова.
              </p>
              <p className="pt-2 text-center text-lg font-semibold">
                <em className="bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink bg-clip-text not-italic text-transparent">
                  Спасибо, что выбираете ProStore 💜
                </em>
              </p>
              <p className="text-center text-muted-foreground">
                🐵 Просто больше, чем техника 🐒
              </p>
              <p className="text-center text-muted-foreground">
                До встречи в магазине! 👋🏻
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
