import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CatalogCardProps {
  href: string;
  title: string;
  image?: {
    src: string;
    alt: string;
  } | null;
  price?: string;
}

export default function CatalogCard({
  href,
  title,
  image,
  price,
}: CatalogCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-glass p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={400}
            height={400}
            unoptimized
            className="size-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-transform duration-400 group-hover:scale-108 group-hover:-rotate-2"
          />
        ) : (
          <span className="text-center text-xs text-white/50">
            Изображение отсутствует
          </span>
        )}
      </div>

      <h3 className="mb-1 min-h-12 line-clamp-2 text-sm font-semibold text-white">
        {title}
      </h3>

      <div className="mt-auto flex min-h-11 items-center justify-between pt-3">
        {price ? (
          <p className="text-lg font-bold tracking-tight text-white">
            {Number(price).toLocaleString("ru-RU")} ₽
          </p>
        ) : (
          <span aria-hidden="true" />
        )}
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-200 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-linear-to-br group-hover:from-brand-violet group-hover:to-brand-pink"
        >
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
