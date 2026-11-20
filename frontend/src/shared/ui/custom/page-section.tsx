import { cn } from "@/shared/lib/shadcn/utils";

export default function PageSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("pb-20", className)}>{children}</section>;
}
