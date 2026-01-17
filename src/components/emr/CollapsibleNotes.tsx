import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

interface CollapsibleNotesProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CollapsibleNotes({ id, value, onChange, placeholder = "Notes..." }: CollapsibleNotesProps) {
  const [isOpen, setIsOpen] = useState(value.length > 0);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 text-xs transition-colors',
          isOpen 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {isOpen ? (
          <Minus className="h-3 w-3" />
        ) : (
          <Plus className="h-3 w-3" />
        )}
        <span>Notes</span>
        {!isOpen && value.length > 0 && (
          <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
            {value.length > 20 ? value.substring(0, 20) + '...' : value}
          </span>
        )}
      </button>
      
      {isOpen && (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-16 text-sm animate-in fade-in-0 duration-150"
        />
      )}
    </div>
  );
}
