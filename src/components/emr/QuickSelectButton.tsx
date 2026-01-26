import { cn } from '@/lib/utils';

type QuickSelectSize = '2xs' | 'xs' | 'sm' | 'md';

interface QuickSelectButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  size?: QuickSelectSize;
  className?: string;
  selectedClassName?: string;
  unselectedClassName?: string;
}

export function QuickSelectButton({
  label,
  selected,
  onClick,
  size = 'sm',
  className,
  selectedClassName,
  unselectedClassName,
}: QuickSelectButtonProps) {
  const sizeClass = {
    '2xs': 'w-5 h-5 flex items-center justify-center text-[10px]',
    'xs': 'px-1.5 py-1 text-[10px]',
    'sm': 'px-2 py-1.5 text-xs',
    'md': 'px-3 py-2 text-xs',
  }[size];
  const selectedClasses = selectedClassName ?? 'bg-primary text-primary-foreground border-primary';
  const unselectedClasses = unselectedClassName ?? 'bg-muted/50 border-border text-foreground hover:bg-muted';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded border transition-colors',
        sizeClass,
        selected ? selectedClasses : unselectedClasses,
        className
      )}
    >
      {label}
    </button>
  );
}
