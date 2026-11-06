import PageHeader from "@/shared/ui/custom/page-header";
import { Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <section className="px-7 pb-20">
      <PageHeader>О нас</PageHeader>

      <div className="mx-auto mb-16 max-w-3xl">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-linear-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative">
            <div className="mb-4 text-3xl">🤝🏻</div>
            <p className="text-[17px] leading-relaxed text-muted-foreground">
              Привет! Я <span className="font-semibold text-white">Андрей</span>{" "}
              — основатель ProStore. Если вы дочитали до этого раздела, значит,
              вам действительно интересно, кто стоит за магазином и у кого вы
              покупаете технику. Поэтому расскажу немного о нас.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-linear-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink">
              <Sparkles className="size-5 text-white" />
            </div>
            <h3 className="mb-4 text-xl font-bold text-white">
              ProStore — это не просто магазин приставок и техники
            </h3>
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
          <div className="relative space-y-4 text-[17px] leading-relaxed text-muted-foreground">
            <p>
              Мы не хотим быть магазином, куда человек пришёл один раз и забыл.
              Хотим быть тем самым магазином, куда возвращаются. За новой
              приставкой. За камерой. За подарком. Или просто за советом: «А что
              сейчас взять?» 😄.
            </p>
            <p>
              Для нас клиент — это не просто покупатель. Это человек, которому
              мы однажды помогли выбрать технику. И которому всегда будем рады
              снова.
            </p>
            <p className="text-center text-lg font-semibold text-white">
              Спасибо, что выбираете ProStore 💜
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
    </section>
  );
}
