import { siteConfig } from "@/app/configs/site";
import { getCurrentYear } from "@/shared/lib";

export default function FooterSection() {
  const currentYear = getCurrentYear();

  return (
    <footer className="mt-12 border-t border-white/10 pb-8 pt-12">
      {/* <Container> */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-10 text-white">
        {/* {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-[18px] text-[13px] font-bold uppercase tracking-[1px]">
                {column.title}
              </h3>

              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="mb-3 block text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))} */}
        Ссылки
      </div>

      <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-muted">
        <span>
          © {currentYear} {siteConfig.name}
        </span>
        <span>🍬 by KarameLka 🍬</span>
      </div>
      {/* </Container> */}
    </footer>
  );
}
