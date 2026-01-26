import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/useClickOutside';

const GRADES = ['Tr', '1+', '2+', '3+', '4+'];

interface GradedButtonProps {
  label: string;
  currentGrade: string | null;
  onGradeChange: (grade: string | null) => void;
  className?: string;
}

export function GradedButton({
  label,
  currentGrade,
  onGradeChange,
  className,
}: GradedButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'px-2 py-1.5 text-xs rounded border transition-colors min-w-[40px]',
          currentGrade
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-muted/50 border-border text-foreground hover:bg-muted'
        )}
      >
        {currentGrade ? `${label} ${currentGrade}` : label}
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden"
          style={{ boxShadow: '0 8px 12px rgba(0,0,0,0.25)' }}
        >
          <div className="max-h-32 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onGradeChange(null);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors',
                !currentGrade && 'bg-muted'
              )}
            >
              —
            </button>
            {GRADES.map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => {
                  onGradeChange(grade);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors',
                  currentGrade === grade && 'bg-primary text-primary-foreground'
                )}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
