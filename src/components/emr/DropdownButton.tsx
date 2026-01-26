import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { QuickSelectButton } from './QuickSelectButton';
import { useClickOutside } from '@/hooks/useClickOutside';

interface DropdownButtonProps {
  label: string;
  selectedLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function DropdownButton({
  label,
  selectedLabel,
  children,
  className,
}: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useClickOutside([buttonRef, popupRef], () => setIsOpen(false), isOpen);

  const hasSelection = !!selectedLabel;

  return (
    <div className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-md border transition-all duration-200 w-full text-left',
          hasSelection
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-muted/50 border-border text-foreground hover:bg-muted'
        )}
      >
        <span className="flex-1">
          {hasSelection ? (
            <>
              <span className="opacity-70">{label}:</span>{' '}
              <span className="font-medium">{selectedLabel}</span>
            </>
          ) : (
            label
          )}
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Click-away layer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown popup */}
      {isOpen && (
        <div
          ref={popupRef}
          className={cn(
            'absolute z-50 left-0 right-0 mt-1 p-3 rounded-lg',
            'border border-border bg-background',
            'animate-in fade-in-0 duration-150'
          )}
          style={{ minWidth: '200px', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
        >
          <div className="flex flex-wrap gap-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function DropdownOption({ label, selected, onSelect, onDeselect }: DropdownOptionProps & { onDeselect?: () => void }) {
  const handleClick = () => {
    if (selected && onDeselect) {
      onDeselect();
    } else {
      onSelect();
    }
  };

  return (
    <QuickSelectButton
      label={label}
      selected={selected}
      onClick={handleClick}
      size="sm"
      unselectedClassName="bg-transparent text-foreground border-border hover:bg-muted"
    />
  );
}
