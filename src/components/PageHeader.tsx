import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 space-y-3">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {eyebrow}
        </div>
      )}
      <h1 className="text-3xl sm:text-4xl font-serif tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
      )}
      {children}
    </header>
  );
}