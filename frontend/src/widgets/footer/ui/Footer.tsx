import Link from "next/link";

export default function Footer() {
  // const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] mt-12">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h5 className="text-[13px] font-bold text-[#f0f2f8] mb-4 uppercase tracking-widest">
              Магазин
            </h5>
            <Link
              href="/catalog"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              Каталог
            </Link>
            <Link
              href="/sale"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              Акции
            </Link>
            <Link
              href="/brands"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              Бренды
            </Link>
          </div>

          <div>
            <h5 className="text-[13px] font-bold text-[#f0f2f8] mb-4 uppercase tracking-widest">
              Помощь
            </h5>
            <Link
              href="/delivery"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              Доставка
            </Link>
            <Link
              href="/payment"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              Оплата
            </Link>
            <Link
              href="/returns"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              Возврат
            </Link>
          </div>

          <div>
            <h5 className="text-[13px] font-bold text-[#f0f2f8] mb-4 uppercase tracking-widest">
              Контакты
            </h5>
            <a
              href="tel:88005550123"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              8 800 555-01-23
            </a>
            <a
              href="mailto:hello@prostore.ru"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              hello@prostore.ru
            </a>
          </div>

          <div>
            <h5 className="text-[13px] font-bold text-[#f0f2f8] mb-4 uppercase tracking-widest">
              Соцсети
            </h5>
            <a
              href="#"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              Telegram
            </a>
            <a
              href="#"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              YouTube
            </a>
            <a
              href="#"
              className="block text-[#8b8fa8] no-underline text-[14px] mb-3 transition-colors duration-200 hover:text-[#f0f2f8]"
            >
              VK
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(255,255,255,0.08)] flex flex-wrap justify-between gap-3 text-[#8b8fa8] text-[13px]">
          <span>© 2026 ПроСтор | Powered by KarameLka</span>
          <span>
            Магазин игровых приставок! PlayStation, Nintendo, Oculus, Steam,
            Xbox
          </span>
        </div>
      </div>
    </footer>
  );
}
