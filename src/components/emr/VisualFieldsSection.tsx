import { VisualFields, VF_TYPES, VF_MACHINES, VF_RESULTS } from '@/types/emr';
import { Label } from '@/components/ui/label';
import { CollapsibleNotes } from './CollapsibleNotes';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { VisualFieldsDisplay } from '@/print/sectionDisplays';

interface VisualFieldsSectionProps {
  visualFields: VisualFields;
  onChange: (updates: Partial<VisualFields>) => void;
}

// Quick tags that can be combined
const RESULT_QUICK_TAGS = ['Fiable', 'Complet', 'Pas fiable', 'Normal'];

// Other results from dropdown (pathological findings)
const RESULT_OTHER = VF_RESULTS.filter(r => !['Normal', 'Fiable et complet', 'Pas fiable'].includes(r));

 

export function VisualFieldsSection({ visualFields, onChange }: VisualFieldsSectionProps) {
  const handleToggle = (field: keyof VisualFields, value: string) => {
    onChange({ [field]: visualFields[field] === value ? '' : value });
  };

  // Toggle a value in a comma-separated string (multi-select)
  const toggleResultValue = (field: 'resultOD' | 'resultOS', value: string) => {
    const current = (visualFields[field] as string) || '';
    const values = current ? current.split(', ').filter(v => v) : [];
    const idx = values.indexOf(value);
    
    if (idx >= 0) {
      // Remove the value
      values.splice(idx, 1);
    } else {
      // Add the value
      values.push(value);
    }
    
    onChange({ [field]: values.join(', ') });
  };

  const hasResultValue = (field: 'resultOD' | 'resultOS', value: string) => {
    const current = (visualFields[field] as string) || '';
    if (!current) return false;
    return current.split(', ').includes(value);
  };

  const renderResultField = (eye: 'OD' | 'OS') => {
    const field = `result${eye}` as 'resultOD' | 'resultOS';
    const value = visualFields[field] || '';
    
    // Check if any "other" option is selected
    const selectedOther = RESULT_OTHER.find(r => value.includes(r));
    
    return (
      <div className="space-y-1">
        <span className="text-[10px] text-muted-foreground">{eye}</span>
        <div className="flex flex-wrap gap-1">
          {RESULT_QUICK_TAGS.map((opt) => (
            <QuickSelectButton 
              key={opt} 
              label={opt} 
              selected={hasResultValue(field, opt)} 
              onClick={() => toggleResultValue(field, opt)} 
            />
          ))}
          <DropdownButton 
            label="+" 
            selectedLabel={selectedOther}
          >
            {RESULT_OTHER.map((opt) => (
              <DropdownOption
                key={opt}
                label={opt}
                selected={hasResultValue(field, opt)}
                onSelect={() => toggleResultValue(field, opt)}
                onDeselect={() => toggleResultValue(field, opt)}
              />
            ))}
          </DropdownButton>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeaderWithPreview
        title="Champs Visuels"
        preview={<VisualFieldsDisplay vf={visualFields} />}
      />

      {/* Type */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Type</Label>
        <div className="flex flex-wrap gap-1">
          {VF_TYPES.map((t) => (
            <QuickSelectButton 
              key={t} 
              label={t} 
              selected={visualFields.type === t} 
              onClick={() => handleToggle('type', t)} 
            />
          ))}
        </div>
      </div>

      {/* Machine */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Appareil</Label>
        <div className="flex flex-wrap gap-1">
          {VF_MACHINES.map((m) => (
            <QuickSelectButton 
              key={m} 
              label={m} 
              selected={visualFields.machine === m} 
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
        id="visual-fields-notes"
        value={visualFields.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes champs visuels..."
      />
    </div>
  );
}
