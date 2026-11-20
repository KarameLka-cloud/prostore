import { cn } from "@/shared/lib/shadcn/utils";

const paddingStyles = {
  none: "",
  sm: "p-6",
  md: "p-8",
  lg: "p-8 lg:p-10",
} as const;

interface GlassCardProps extends React.ComponentProps<"div"> {
  padding?: keyof typeof paddingStyles;
  hover?: boolean;
  overlay?: "none" | "glow" | "hover";
  contentClassName?: string;
}

export default function GlassCard({
  children,
  className,
  contentClassName,
  padding = "md",
  hover = false,
  overlay = "none",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-glass backdrop-blur-xl select-none",
        paddingStyles[padding],
        (hover || overlay === "hover") && "group",
        hover &&
          "transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]",
        className,
      )}
      {...props}
    >
      {overlay !== "none" && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br from-brand-violet/10 via-brand-blue/5 to-brand-pink/10",
            overlay === "hover" &&
              "opacity-0 transition-opacity group-hover:opacity-100",
          )}
        />
      )}
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}
