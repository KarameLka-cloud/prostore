import Link from "next/link";
import GlassCard from "@/shared/ui/custom/glass-card";

interface AuthShellProps {
  title: string;
  description: string;
  footerText: string;
  footerLink: {
    href: string;
    label: string;
  };
  children: React.ReactNode;
}

export default function AuthShell({
  title,
  description,
  footerText,
  footerLink,
  children,
}: AuthShellProps) {
  return (
    <div className="w-full max-w-md">
      <header className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>

      <GlassCard overlay="glow">{children}</GlassCard>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {footerText}{" "}
        <Link
          href={footerLink.href}
          className="font-medium text-white underline-offset-4 hover:underline"
        >
          {footerLink.label}
        </Link>
      </p>
    </div>
  );
}
