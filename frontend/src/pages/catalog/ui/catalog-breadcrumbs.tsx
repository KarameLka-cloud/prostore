import Link from "next/link";
import { Fragment } from "react";

interface CatalogBreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export default function CatalogBreadcrumbs({ items }: CatalogBreadcrumbsProps) {
  return (
    <nav
      aria-label="Навигация каталога"
      className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
    >
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
