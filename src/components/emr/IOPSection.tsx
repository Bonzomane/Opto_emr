import { IOP } from '@/types/emr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { IOPDisplay } from '@/print/sectionDisplays';

interface IOPSectionProps {
  iop: IOP;
  onChange: (updates: Partial<IOP>) => void;
}

const METHOD_COMMON = ['goldmann', 'icare', 'ncr'];
const METHOD_OPTIONS = [
  { id: 'tonopen', label: 'Tonopen' },
  { id: 'palpation', label: 'Palpation' },
];

 

const getMethodLabel = (id: string) => {
  if (id === 'goldmann') return 'Goldmann';
  if (id === 'icare') return 'iCare';
  if (id === 'ncr') return 'NCT';
  return METHOD_OPTIONS.find(o => o.id === id)?.label;
};

export function IOPSection({ iop, onChange }: IOPSectionProps) {
  const handleMethodSelect = (value: string) => {
    onChange({ method: iop.method === value ? '' : value });
  };

  return (
    <div className="space-y-6">
      <SectionHeaderWithPreview
        title="Pression Intraoculaire"
        preview={<IOPDisplay iop={iop} />}
      />

      {/* Method */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Méthode</Label>
        <div className="flex flex-wrap gap-1">
          {METHOD_COMMON.map((v) => (
            <QuickSelectButton key={v} label={getMethodLabel(v) || v} selected={iop.method === v} onClick={() => handleMethodSelect(v)} />
          ))}
          <DropdownButton label="+" selectedLabel={METHOD_OPTIONS.find(o => o.id === iop.method)?.label}>
            {METHOD_OPTIONS.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={iop.method === opt.id} onSelect={() => onChange({ method: opt.id })} onDeselect={() => onChange({ method: '' })} />
            ))}
          </DropdownButton>
        </div>
      </div>

      {/* IOP Values */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">PIO (mmHg)</Label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">OD</Label>
            <Input
              value={iop.iopOD}
              onChange={(e) => onChange({ iopOD: e.target.value })}
              placeholder="14"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">OS</Label>
            <Input
              value={iop.iopOS}
              onChange={(e) => onChange({ iopOS: e.target.value })}
              placeholder="15"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Heure</Label>
            <Input
              value={iop.time}
              onChange={(e) => onChange({ time: e.target.value })}
              placeholder="10:30"
              className="mt-1"
            />
          </div>
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
