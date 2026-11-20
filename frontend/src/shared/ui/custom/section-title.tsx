import { cn } from "@/shared/lib/shadcn/utils";

export default function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-8 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}
