import { cn } from "@/shared/lib/shadcn/utils";

const inputStyles =
  "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand-violet/50 focus:ring-2 focus:ring-brand-violet/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500/50 aria-invalid:focus:border-red-500/50 aria-invalid:focus:ring-red-500/20";

interface InputFieldProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  hint?: React.ReactNode;
}

export default function InputField({
  id,
  label,
  error,
  hint,
  className,
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
        {hint}
      </div>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputStyles, className)}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
