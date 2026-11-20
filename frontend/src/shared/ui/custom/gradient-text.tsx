import { cn } from "@/shared/lib/shadcn/utils";

export default function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <em
      className={cn(
        "bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink bg-clip-text not-italic text-transparent",
        className,
      )}
    >
      {children}
    </em>
  );
}
