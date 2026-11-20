import { cn } from "@/shared/lib/shadcn/utils";

const sizeStyles = {
  sm: { box: "size-9 rounded-lg", icon: "size-4" },
  md: { box: "size-10 rounded-xl", icon: "size-5" },
  lg: { box: "size-12 rounded-2xl", icon: "size-6" },
} as const;

interface IconBadgeProps {
  icon: React.ComponentType<{ className?: string }>;
  size?: keyof typeof sizeStyles;
  variant?: "gradient" | "outline";
  className?: string;
}

export default function IconBadge({
  icon: Icon,
  size = "md",
  variant = "gradient",
  className,
}: IconBadgeProps) {
  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-white",
        styles.box,
        variant === "gradient"
          ? "bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink shadow-[0_8px_24px_rgba(139,92,246,0.35)]"
          : "border border-white/10 bg-white/5",
        className,
      )}
    >
      <Icon className={styles.icon} />
    </div>
  );
}
