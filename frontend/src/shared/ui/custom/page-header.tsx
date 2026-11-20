import { cn } from "@/shared/lib/shadcn/utils";
import GradientText from "@/shared/ui/custom/gradient-text";

export default function PageHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "mt-14 mb-10 text-center text-4xl font-extrabold leading-[1.05] tracking-[-1px] text-white sm:text-5xl lg:tracking-[-2px]",
        className,
      )}
    >
      <GradientText>{children}</GradientText>
    </h1>
  );
}
