import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export function SectionHeader({ title, className }: SectionHeaderProps) {
  return (
    <h2 className={cn('text-sm font-semibold text-foreground uppercase tracking-wide mb-4', className)}>
      {title}
    </h2>
  );
}
