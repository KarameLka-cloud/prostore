import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-4 z-50 px-6 mb-2">
      <div className="mx-auto max-w-7xl rounded-full bg-[rgba(20,22,35,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] px-7 py-3 flex items-center justify-between h-17 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <Link
          href="/"
          className="font-extrabold text-[15px] md:text-[17px] lg:text-[20px] tracking-tighter text-[#f0f2f8] flex items-center gap-2.5 no-underline"
        >
          <span className="w-8 h-8 rounded-xl bg-liner-to-br from-[#8b5cf6] to-[#ec4899] flex items-center justify-center text-white text-xs shadow-[0_4px_12px_rgba(139,92,246,0.4)]">
            <i className="fas fa-wave-square"></i>
          </span>
          <span className="hidden sm:inline">ПроСтор</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link
            href="/catalog"
            className="text-[#8b8fa8] no-underline text-[14px] font-medium transition-colors duration-200 hover:text-[#f0f2f8]"
          >
            Каталог
          </Link>
          <Link
            href="/new"
            className="text-[#8b8fa8] no-underline text-[14px] font-medium transition-colors duration-200 hover:text-[#f0f2f8]"
          >
            Новинки
          </Link>
          <Link
            href="/brands"
            className="text-[#8b8fa8] no-underline text-[14px] font-medium transition-colors duration-200 hover:text-[#f0f2f8]"
          >
            Бренды
          </Link>
          <Link
            href="/support"
            className="text-[#8b8fa8] no-underline text-[14px] font-medium transition-colors duration-200 hover:text-[#f0f2f8]"
          >
            Поддержка
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] w-11 h-11 rounded-full text-[#f0f2f8] cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.18)] hover:scale-105 backdrop-blur-sm relative">
            <i className="fas fa-search text-sm"></i>
          </button>
          <button className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] w-11 h-11 rounded-full text-[#f0f2f8] cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.18)] hover:scale-105 backdrop-blur-sm relative">
            <i className="fas fa-shopping-bag text-sm"></i>
            <span className="absolute -top-1 -right-1 bg-liner-to-br from-[#8b5cf6] to-[#ec4899] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#06070d]">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
