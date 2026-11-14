import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/shared/lib/shadcn/utils";

interface CatalogCardProps {
  href: string;
  title: string;
  description?: string | null;
  image?: {
    src: string;
    alt: string;
  } | null;
  price?: string;
  descriptionLines?: 3 | 4;
}

export default function CatalogCard({
  href,
  title,
  description,
  image,
  price,
  descriptionLines = 3,
}: CatalogCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-3xl border border-white/10 bg-glass p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
    >
      {image && (
        <div className="mb-4.5 flex aspect-square items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-black/20 p-5">
          <Image
            src={image.src}
            alt={image.alt}
            width={400}
            height={400}
            unoptimized
            className="size-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-transform duration-400 group-hover:scale-108 group-hover:-rotate-2"
          />
        </div>
      )}

      <h3 className="mb-1 text-base font-semibold text-white">{title}</h3>

      {description && (
        <p
          className={cn(
            "text-[13px] text-muted-foreground",
            descriptionLines === 4 ? "line-clamp-4" : "line-clamp-3",
          )}
        >
          {description}
        </p>
      )}

      {price && (
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-xl font-bold tracking-tight text-white">
            {Number(price).toLocaleString("ru-RU")} ₽
          </p>
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-200 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-linear-to-br group-hover:from-brand-violet group-hover:to-brand-pink"
          >
            <ArrowRight className="size-4" />
          </span>
        </div>
      )}
    </Link>
  );
}
