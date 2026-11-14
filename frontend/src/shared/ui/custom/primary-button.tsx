import { cn } from "@/shared/lib/shadcn/utils";

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

interface PrimaryButtonProps extends React.ComponentProps<"button"> {
  loading?: boolean;
  loadingText?: string;
}

export default function PrimaryButton({
  children,
  className,
  loading = false,
  loadingText = "Загрузка...",
  disabled,
  type = "submit",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-violet to-brand-pink text-sm font-semibold text-white shadow-[0_4px_16px_rgba(139,92,246,0.35)] transition-all hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
