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
    return <p className="text-sm text-muted-foreground">{loadingText}</p>;
  }

  if (error) {
    return <StatusMessage tone="error">{error}</StatusMessage>;
  }

  if (empty && emptyText) {
    return <StatusMessage>{emptyText}</StatusMessage>;
  }

  return <>{children}</>;
}
