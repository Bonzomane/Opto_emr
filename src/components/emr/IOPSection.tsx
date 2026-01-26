import { IOP } from '@/types/emr';
import { LABELS } from '@/constants/labels';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';
import { LateralizedInput } from './LateralizedInput';

interface IOPSectionProps {
  iop: IOP;
  onChange: (updates: Partial<IOP>) => void;
}

const METHOD_COMMON = ['goldmann', 'icare', 'ncr'];
const METHOD_OPTIONS = [
  { id: 'tonopen', label: 'Tonopen' },
  { id: 'palpation', label: 'Palpation' },
];

export function IOPSection({ iop, onChange }: IOPSectionProps) {
  const handleMethodSelect = (value: string) => {
    onChange({ method: iop.method === value ? '' : value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Pression Intraoculaire" />

      {/* Method */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Méthode</Label>
        <div className="flex flex-wrap gap-1">
          {METHOD_COMMON.map((v) => (
            <QuickSelectButton 
              key={v} 
              label={LABELS.iop.methods[v] || v} 
              selected={iop.method === v} 
              onClick={() => handleMethodSelect(v)} 
            />
          ))}
          <DropdownButton label="+" selectedLabel={METHOD_OPTIONS.find(o => o.id === iop.method)?.label}>
            {METHOD_OPTIONS.map((opt) => (
              <DropdownOption 
                key={opt.id} 
                label={opt.label} 
                selected={iop.method === opt.id} 
                onSelect={() => onChange({ method: opt.id })} 
                onDeselect={() => onChange({ method: '' })} 
              />
            ))}
          </DropdownButton>
        </div>
      </div>

      {/* IOP Values */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <LateralizedInput
          label="PIO (mmHg)"
          od={
            <Input
              value={iop.iopOD}
              onChange={(e) => onChange({ iopOD: e.target.value })}
              placeholder="14"
            />
          }
          os={
            <Input
              value={iop.iopOS}
              onChange={(e) => onChange({ iopOS: e.target.value })}
              placeholder="15"
            />
          }
        />
        
        <div className="flex items-center gap-3 pl-[25%] md:pl-[25%]">
          <Label className="text-xs text-muted-foreground w-16">Heure</Label>
          <Input
            value={iop.time}
            onChange={(e) => onChange({ time: e.target.value })}
            placeholder="10:30"
            className="max-w-[120px]"
          />
        </div>
      </div>

      <CollapsibleNotes
        id="iop-notes"
        value={iop.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes PIO..."
      />
    </div>
  );
}
