import { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { PersonalGeneralHealth, PatientSession } from '@/types/emr';
import { ConditionGrid } from './ConditionGrid';
import { CollapsibleNotes } from './CollapsibleNotes';
import { MEDICAL_CONDITIONS, MEDICATIONS, ALLERGIES } from '@/data/medicalDefinitions';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { AllergiesDisplay, PersonalGeneralHealthDisplay } from '@/print/caseHistoryDisplays';

interface PersonalGeneralHealthSectionProps {
  personalGeneralHealth: PersonalGeneralHealth;
  onChange: (updates: Partial<PersonalGeneralHealth>) => void;
  session?: PatientSession;
}

export function PersonalGeneralHealthSection({ personalGeneralHealth, onChange }: PersonalGeneralHealthSectionProps) {
  const medicationCount = personalGeneralHealth.medications.length;
  const allergyCount = personalGeneralHealth.allergies.length;

  return (
    <div className="space-y-6">
      <SectionHeaderWithPreview
        title="Santé Générale Personnelle"
        preview={
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-zinc-400 uppercase block">Santé Générale</span>
              <PersonalGeneralHealthDisplay personalGeneralHealth={personalGeneralHealth} />
            </div>
            <div>
              <span className="text-[9px] text-zinc-400 uppercase block">Allergies</span>
              <AllergiesDisplay personalGeneralHealth={personalGeneralHealth} />
            </div>
          </div>
        }
      />

      {/* Medical Conditions */}
      <div>
        <Label className="text-sm font-medium">Conditions Médicales</Label>
        <div className="mt-2">
          <ConditionGrid
            definitions={MEDICAL_CONDITIONS}
            items={personalGeneralHealth.conditions}
            onChange={(conditions) => onChange({ conditions })}
          />
        </div>
      </div>

      {/* Medications - Dropdown */}
      <GridDropdown
        label="Médicaments"
        count={medicationCount}
        hasNone={false}
      >
        <ConditionGrid
          definitions={MEDICATIONS}
          items={personalGeneralHealth.medications}
          onChange={(medications) => onChange({ medications })}
                  />
      </GridDropdown>

      {/* Allergies - Dropdown */}
      <GridDropdown
        label="Allergies"
        count={allergyCount}
        hasNone={personalGeneralHealth.hasNKDA}
        onNoneToggle={(hasNone) => onChange({ hasNKDA: hasNone, allergies: hasNone ? [] : personalGeneralHealth.allergies })}
        noneLabel="Aucune"
      >
        <ConditionGrid
          definitions={ALLERGIES}
          items={personalGeneralHealth.allergies}
          onChange={(allergies) => onChange({ allergies })}
                    />
      </GridDropdown>

      <CollapsibleNotes
        id="general-notes"
        value={personalGeneralHealth.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Autres détails médicaux..."
      />
    </div>
  );
}

// Dropdown component that contains a ConditionGrid
interface GridDropdownProps {
  label: string;
  count: number;
  hasNone?: boolean;
  onNoneToggle?: (hasNone: boolean) => void;
  noneLabel?: string;
  children: React.ReactNode;
}

function GridDropdown({ label, count, hasNone, onNoneToggle, noneLabel, children }: GridDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getSummary = () => {
    if (hasNone) return noneLabel || 'Aucun';
    if (count === 0) return 'Aucun';
    return `${count} sélectionné${count > 1 ? 's' : ''}`;
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        {/* Main dropdown button */}
        <button
          type="button"
          onClick={() => {
            if (!hasNone) setIsOpen(!isOpen);
          }}
          className={cn(
            'flex-1 flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-md border transition-all duration-200 text-left',
            hasNone
              ? 'bg-muted/30 border-border text-zinc-400 cursor-default'
              : count > 0
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted/50 border-border text-foreground hover:bg-muted'
          )}
        >
          <span>
            <span className={cn(count > 0 && !hasNone ? 'opacity-70' : '')}>{label}:</span>{' '}
            <span className="font-medium">{getSummary()}</span>
          </span>
          {!hasNone && <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />}
        </button>

        {/* None toggle button (for allergies) */}
        {onNoneToggle && (
          <button
            type="button"
            onClick={() => {
              onNoneToggle(!hasNone);
              if (!hasNone) setIsOpen(false);
            }}
            className={cn(
              'px-3 py-2 text-xs rounded-md border transition-all duration-200',
              hasNone
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted/50 border-border text-foreground hover:bg-muted'
            )}
          >
            {noneLabel || 'Aucun'}
          </button>
        )}
      </div>

      {/* Click-away layer */}
      {isOpen && !hasNone && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown content */}
      {isOpen && !hasNone && (
        <div
          className={cn(
            'absolute z-50 left-0 right-0 mt-1 p-3 rounded-lg',
            'border border-border bg-background',
            'animate-in fade-in-0 duration-150'
          )}
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
