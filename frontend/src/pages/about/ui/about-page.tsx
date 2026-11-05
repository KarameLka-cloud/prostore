import PageHeader from "@/shared/ui/custom/page-header";
import {
  CheckCircle2,
  Shield,
  Sparkles,
  Heart,
  Truck,
  RefreshCw,
  Wrench,
  MessageCircle,
} from "lucide-react";

const REASONS = [
  {
    icon: Shield,
    title: "Проверенная техника и оригинальные товары",
  },
  {
    icon: CheckCircle2,
    title: "Честные цены и условия",
  },
  {
    icon: Heart,
    title: "Гарантия и проверка перед покупкой",
  },
  {
    icon: RefreshCw,
    title: "Рассрочка и Trade-in",
  },
  {
    icon: Truck,
    title: "Доставка по городу и Авито Доставка",
  },
  {
    icon: Wrench,
    title: "Настройка техники и помощь после покупки",
  },
];

export default function AboutPage() {
  return (
    <section className="px-7 pb-20">
      <PageHeader>О нас</PageHeader>

      {/* Intro */}
      <div className="mx-auto mb-16 max-w-3xl">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-gradient-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative">
            <div className="mb-4 text-3xl">🤝🏻</div>
            <p className="text-[17px] leading-relaxed text-muted-foreground">
              Привет! Я{" "}
              <span className="font-semibold text-white">Андрей</span> —
              основатель ProStore. Если вы дочитали до этого раздела, значит,
              вам действительно интересно, кто стоит за магазином и у кого вы
              покупаете технику. Поэтому расскажу немного о нас.
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="mb-16">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-gradient-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
          <div className="relative">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet via-brand-blue to-brand-pink">
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
              😎. Именно поэтому нам важно не просто продать вам товар. Нам важно,
              чтобы вы не пожалели о покупке. Чтобы вам нормально рассказали, что
              вы покупаете. Помогли выбрать подходящую модель. Настроили, если
              это необходимо. Ответили на вопросы после покупки. И самое главное —
              чтобы с вами разговаривали по-человечески, а не относились как к
              очередному номеру заказа.
            </p>
          </div>
        </div>
      </div>

      {/* Why choose us */}
      <div className="mb-16">
        <h3 className="mb-8 text-center text-white text-2xl font-bold tracking-tight sm:text-3xl">
          Почему нас выбирают?
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-glass p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]"
              >
                <div className="pointer-events-none absolute -inset-px rounded-[20px] bg-gradient-to-br from-brand-violet/5 via-brand-blue/5 to-brand-pink/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                    <Icon className="size-4" />
                  </div>
                  <p className="text-[15px] font-medium text-white">
                    {reason.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing */}
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-glass p-8 backdrop-blur-xl lg:p-10">
          <div className="absolute -inset-px rounded-[24px] bg-gradient-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10" />
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
