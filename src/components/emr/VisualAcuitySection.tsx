import { VisualAcuityData, PatientSession } from '@/types/emr';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';

interface VisualAcuitySectionProps {
  visualAcuity: VisualAcuityData;
  onChange: (updates: Partial<VisualAcuityData>) => void;
  session?: PatientSession;
}

// Common VA values shown as quick buttons
const VA_COMMON = ['20/20', '20/25', '20/30', '20/40'];
const VA_OPTIONS = [
  { id: '20/50', label: '20/50' },
  { id: '20/60', label: '20/60' },
  { id: '20/70', label: '20/70' },
  { id: '20/80', label: '20/80' },
  { id: '20/100', label: '20/100' },
  { id: '20/150', label: '20/150' },
  { id: '20/200', label: '20/200' },
  { id: '20/400', label: '20/400' },
  { id: 'CF', label: 'CF' },
  { id: 'HM', label: 'HM' },
  { id: 'LP', label: 'LP' },
  { id: 'NLP', label: 'NLP' },
];

 

export function VisualAcuitySection({ visualAcuity, onChange }: VisualAcuitySectionProps) {
  const handleSelect = (field: keyof VisualAcuityData, value: string) => {
    const current = visualAcuity[field];
    onChange({ [field]: current === value ? '' : value });
  };

  const renderVARow = (label: string, field: keyof VisualAcuityData) => (
    <div className="space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1">
        {VA_COMMON.map((v) => (
          <QuickSelectButton key={v} label={v} selected={visualAcuity[field] === v} onClick={() => handleSelect(field, v)} />
        ))}
        <DropdownButton label="+" selectedLabel={VA_OPTIONS.find(o => o.id === visualAcuity[field])?.label}>
          {VA_OPTIONS.map((opt) => (
            <DropdownOption key={opt.id} label={opt.label} selected={visualAcuity[field] === opt.id} onSelect={() => onChange({ [field]: opt.id })} onDeselect={() => onChange({ [field]: '' })} />
          ))}
        </DropdownButton>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Acuité Visuelle" />

      {/* Sans Correction */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Sans Correction (SC)</Label>
        <div className="grid grid-cols-3 gap-3">
          {renderVARow('OD', 'scOD')}
          {renderVARow('OS', 'scOS')}
          {renderVARow('OU', 'scOU')}
        </div>
      </div>

      {/* Avec Correction */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Avec Correction (AC)</Label>
        <div className="grid grid-cols-3 gap-3">
          {renderVARow('OD', 'avecOD')}
          {renderVARow('OS', 'avecOS')}
          {renderVARow('OU', 'avecOU')}
        </div>
      </div>

      {/* Trou Sténopéique */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Trou Sténopéique (PH)</Label>
        <div className="grid grid-cols-2 gap-3">
          {renderVARow('OD', 'phOD')}
          {renderVARow('OS', 'phOS')}
        </div>
      </div>

      <CollapsibleNotes
        id="visual-acuity-notes"
        value={visualAcuity.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes sur l'acuité..."
      />
    </div>
  );
}
