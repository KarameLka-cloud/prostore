import { cn } from "@/shared/lib/shadcn/utils";

const tones = {
  muted: "border-white/10 bg-white/5 text-white/80",
  error: "border-red-500/30 bg-red-950/40 text-red-200",
} as const;

export default function StatusMessage({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={cn("rounded-xl border p-4 text-sm", tones[tone], className)}
    >
      {children}
    </p>
  );
}
