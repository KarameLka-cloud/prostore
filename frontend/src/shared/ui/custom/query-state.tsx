import { LoaderCircle } from "lucide-react";

import StatusMessage from "@/shared/ui/custom/status-message";

interface QueryStateProps {
  loading?: boolean;
  loadingText: string;
  error?: string;
  empty?: boolean;
  emptyText?: string;
  children: React.ReactNode;
}

export default function QueryState({
  loading = false,
  loadingText,
  error,
  empty = false,
  emptyText,
  children,
}: QueryStateProps) {
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="my-12 flex flex-col items-center justify-center gap-3 text-sm text-white/80"
      >
        <LoaderCircle
          aria-hidden="true"
          className="size-8 animate-spin text-brand-violet"
        />
        <span>{loadingText}</span>
      </div>
    );
  }

  if (error) {
    return <StatusMessage tone="error">{error}</StatusMessage>;
  }

  if (empty && emptyText) {
    return <StatusMessage>{emptyText}</StatusMessage>;
  }

  return <>{children}</>;
}
