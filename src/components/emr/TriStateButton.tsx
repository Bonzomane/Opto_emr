import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Minus, CircleDot } from 'lucide-react';
import { QuickSelectButton } from './QuickSelectButton';
import { useClickOutside } from '@/hooks/useClickOutside';

export type TriState = 'negative' | 'positive';

interface TriStateButtonProps {
  label: string;
  state: TriState;
  onStateChange: (state: TriState) => void;
  children?: React.ReactNode;
  className?: string;
  hasSelectedDetails?: boolean;
}

export function TriStateButton({
  label,
  state,
  onStateChange,
  children,
  className,
  hasSelectedDetails = false,
}: TriStateButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useClickOutside([buttonRef, popupRef], () => setIsExpanded(false), isExpanded);

  const handleClick = () => {
    if (state === 'negative') {
      // Négatif → Positif
      onStateChange('positive');
      if (children) {
        setIsExpanded(true);
      }
    } else {
      // Positif: si a des détails et popup fermé, rouvrir le popup
      // sinon désélectionner
      if (children && hasSelectedDetails && !isExpanded) {
        setIsExpanded(true);
      } else {
        onStateChange('negative');
        setIsExpanded(false);
      }
    }
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state === 'positive' && children) {
      setIsExpanded(!isExpanded);
    }
  };

  // Close when state changes to negative
  useEffect(() => {
    if (state === 'negative') {
      setIsExpanded(false);
    }
  }, [state]);

  return (
    <div className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md border transition-all duration-200 w-full text-left',
          state === 'negative' && 'bg-muted/50 border-border text-muted-foreground hover:bg-muted',
          state === 'positive' && 'bg-primary text-primary-foreground border-primary'
        )}
      >
        <span
          className={cn(
            'flex items-center justify-center h-4 w-4 rounded-sm border transition-colors flex-shrink-0',
            state === 'negative' && 'border-muted-foreground/40 bg-background',
            state === 'positive' && 'border-primary-foreground/40 bg-primary-foreground/20'
          )}
        >
          {state === 'negative' && <Minus className="h-3 w-3 opacity-50" />}
          {state === 'positive' && <Check className="h-3 w-3" />}
        </span>
        <span className="flex-1 truncate">{label}</span>
        {/* Indicator showing details are selected */}
        {hasSelectedDetails && state === 'positive' && (
          <CircleDot className="h-3 w-3 text-primary-foreground" />
        )}
        {children && (
          <button
            type="button"
            onClick={handleToggleExpand}
            className={cn(
              'ml-1 px-1.5 py-0.5 rounded text-[10px] transition-colors',
              state === 'positive'
                ? 'bg-primary-foreground/20 hover:bg-primary-foreground/30'
                : 'opacity-0 pointer-events-none'
            )}
          >
            {isExpanded ? '−' : '+'}
          </button>
        )}
      </button>

      {/* Click-away layer */}
      {isExpanded && children && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Expandable popup */}
      {isExpanded && children && (
        <div
          ref={popupRef}
          className={cn(
            'absolute z-50 left-0 right-0 mt-1 p-3 rounded-lg',
            'border border-border bg-background',
            'animate-in fade-in-0 duration-150'
          )}
          style={{ minWidth: '200px', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
        >
          <div className="space-y-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface TriStateOptionGroupProps {
  label: string;
  children: React.ReactNode;
}

export function TriStateOptionGroup({ label, children }: TriStateOptionGroupProps) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {children}
      </div>
    </div>
  );
}

interface TriStateOptionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function TriStateOption({ label, checked, onChange }: TriStateOptionProps) {
  return (
    <QuickSelectButton
      label={label}
      selected={checked}
      onClick={() => onChange(!checked)}
      size="xs"
      unselectedClassName="bg-transparent text-foreground/70 border-border hover:bg-muted"
    />
  );
}
