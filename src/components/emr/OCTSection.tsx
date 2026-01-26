import { OCT } from '@/types/emr';
import { LABELS } from '@/constants/labels';
import { Label } from '@/components/ui/label';
import { CollapsibleNotes } from './CollapsibleNotes';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';

interface OCTSectionProps {
  oct: OCT;
  onChange: (updates: Partial<OCT>) => void;
}

export function OCTSection({ oct, onChange }: OCTSectionProps) {
  const handleToggle = (field: keyof OCT, value: string) => {
    onChange({ [field]: oct[field] === value ? '' : value });
  };

  const renderResultField = (eye: 'OD' | 'OS') => {
    const field = `result${eye}` as keyof OCT;
    const value = oct[field] || '';
    const commonResults = ['Normal', 'Amincissement', 'Épaississement'];
    
    return (
      <div className="space-y-1">
        <span className="text-[10px] text-muted-foreground">{eye}</span>
        <div className="flex flex-wrap gap-1">
          {commonResults.map((opt) => (
            <QuickSelectButton 
              key={opt} 
              label={opt} 
              selected={value === opt} 
              onClick={() => handleToggle(field, opt)} 
            />
          ))}
          <DropdownButton 
            label="+" 
            selectedLabel={LABELS.oct.results.filter(r => !commonResults.includes(r)).find(r => value === r)}
          >
            {LABELS.oct.results.filter(r => !commonResults.includes(r)).map((opt) => (
              <DropdownOption
                key={opt}
                label={opt}
                selected={value === opt}
                onSelect={() => onChange({ [field]: opt })}
                onDeselect={() => onChange({ [field]: '' })}
              />
            ))}
          </DropdownButton>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="OCT" />

      {/* Type */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Type</Label>
        <div className="flex flex-wrap gap-1">
          {LABELS.oct.types.map((t) => (
            <QuickSelectButton 
              key={t} 
              label={t} 
              selected={oct.type === t} 
              onClick={() => handleToggle('type', t)} 
            />
          ))}
        </div>
      </div>

      {/* Machine */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Appareil</Label>
        <div className="flex flex-wrap gap-1">
          {LABELS.oct.machines.map((m) => (
            <QuickSelectButton 
              key={m} 
              label={m} 
              selected={oct.machine === m} 
              onClick={() => handleToggle('machine', m)} 
            />
          ))}
        </div>
      </div>

      {/* Results OD/OS */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Résultats</Label>
        <div className="grid grid-cols-2 gap-3">
          {renderResultField('OD')}
          {renderResultField('OS')}
        </div>
      </div>

      <CollapsibleNotes
        id="oct-notes"
        value={oct.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes OCT..."
      />
    </div>
  );
}
