import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-18 mb-16">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          {/* Tag */}
          <span className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm text-[#f0f2f8] text-[13px] font-medium px-4 py-2 rounded-[40px] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]"></span>
            Доставка по России за 1 день
          </span>

          {/* Heading */}
          <h1 className="text-[40px] md:text-[52px] lg:text-[60px] font-extrabold leading-[1.05] tracking-tight mb-6">
            Технологии в{" "}
            <em className="font-normal bg-gradient-to-br from-[#8b5cf6] via-[#3b82f6] to-[#ec4899] bg-clip-text text-transparent">
              новом свете
            </em>
          </h1>

          {/* Description */}
          <p className="text-[17px] text-[#8b8fa8] mb-9 max-w-[460px]">
            Премиальная электроника с безупречным сервисом. Только оригинальные устройства и честные цены.
          </p>

          {/* CTA */}
          <Link
            href="/catalog"
            className="bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] border-none text-white font-semibold text-[15px] px-8 py-[17px] rounded-full no-underline inline-flex items-center gap-2.5 transition-all duration-250 shadow-[0_8px_24px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(139,92,246,0.6)]"
          >
            Смотреть каталог
            <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>

        {/* Right - Image */}
        <div className="relative aspect-square flex items-center justify-center">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(139,92,246,0.3)] to-[rgba(236,72,153,0.3)] rounded-[32px] blur-[40px] -z-10"></div>
          
          {/* Glass card */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-[32px] p-8 w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
              alt="Наушники"
              className="w-[85%] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
