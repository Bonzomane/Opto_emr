import { BinocularVision } from '@/types/emr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { BinoDisplay } from '@/print/sectionDisplays';

interface BinocularVisionSectionProps {
  binocularVision: BinocularVision;
  onChange: (updates: Partial<BinocularVision>) => void;
}

// Cover Test options - tropies and phorias
const COVER_TEST_OPTIONS = [
  { id: 'Ortho', label: 'Ortho' },
  { id: 'esophorie', label: 'Ésophorie' },
  { id: 'exophorie', label: 'Exophorie' },
  { id: 'hyperphorie', label: 'Hyperphorie' },
  { id: 'esotropie', label: 'Ésotropie' },
  { id: 'exotropie', label: 'Exotropie' },
  { id: 'hypertropie', label: 'Hypertropie' },
];

// Maddox options
const MADDOX_OPTIONS = [
  { id: 'Ortho', label: 'Ortho' },
  { id: 'eso', label: 'Éso' },
  { id: 'exo', label: 'Exo' },
  { id: 'hyper', label: 'Hyper' },
  { id: 'hypo', label: 'Hypo' },
];

// Filtre Rouge options
const FILTRE_ROUGE_OPTIONS = [
  { id: 'Fusion', label: 'Fusion' },
  { id: 'suppr-od', label: 'Suppr. OD' },
  { id: 'suppr-os', label: 'Suppr. OS' },
  { id: 'diplopie', label: 'Diplopie' },
  { id: 'diplopie-croisee', label: 'Diplopie croisée' },
  { id: 'diplopie-homonyme', label: 'Diplopie homonyme' },
];

 

export function BinocularVisionSection({ binocularVision, onChange }: BinocularVisionSectionProps) {
  const handleSelect = (field: keyof BinocularVision, value: string) => {
    const current = binocularVision[field];
    onChange({ [field]: current === value ? '' : value });
  };

  // Check if value is one of the predefined options
  const isOption = (value: string, options: { id: string }[]) => 
    options.some(o => o.id === value);

  const renderCoverTestCell = (field: 'coverTestVL' | 'coverTestVP') => {
    const value = binocularVision[field];
    const isCustom = value && !isOption(value, COVER_TEST_OPTIONS);
    
    return (
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          <QuickSelectButton
            size="xs"
            label="Ortho"
            selected={value === 'Ortho'}
            onClick={() => handleSelect(field, 'Ortho')}
            selectedClassName="bg-zinc-900 text-white border-zinc-900"
          />
          <DropdownButton label="Phorie" selectedLabel={['esophorie', 'exophorie', 'hyperphorie'].includes(value) ? COVER_TEST_OPTIONS.find(o => o.id === value)?.label : undefined}>
            {COVER_TEST_OPTIONS.filter(o => o.id.includes('phorie')).map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={value === opt.id} onSelect={() => onChange({ [field]: opt.id })} onDeselect={() => onChange({ [field]: '' })} />
            ))}
          </DropdownButton>
          <DropdownButton label="Tropie" selectedLabel={['esotropie', 'exotropie', 'hypertropie'].includes(value) ? COVER_TEST_OPTIONS.find(o => o.id === value)?.label : undefined}>
            {COVER_TEST_OPTIONS.filter(o => o.id.includes('tropie')).map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={value === opt.id} onSelect={() => onChange({ [field]: opt.id })} onDeselect={() => onChange({ [field]: '' })} />
            ))}
          </DropdownButton>
        </div>
        <Input
          value={isCustom ? value : ''}
          onChange={(e) => onChange({ [field]: e.target.value })}
          placeholder="ex: 4E(T)alt, 5Xbc"
          className="h-7 text-xs"
        />
      </div>
    );
  };

  const renderMaddoxCell = (field: 'maddoxVL' | 'maddoxVP') => {
    const value = binocularVision[field];
    const isCustom = value && !isOption(value, MADDOX_OPTIONS);
    
    return (
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          <QuickSelectButton
            size="xs"
            label="Ortho"
            selected={value === 'Ortho'}
            onClick={() => handleSelect(field, 'Ortho')}
            selectedClassName="bg-zinc-900 text-white border-zinc-900"
          />
          {MADDOX_OPTIONS.filter(o => o.id !== 'Ortho').map((opt) => (
            <QuickSelectButton size="xs" key={opt.id} label={opt.label} selected={value === opt.id} onClick={() => handleSelect(field, opt.id)} />
          ))}
        </div>
        <Input
          value={isCustom ? value : ''}
          onChange={(e) => onChange({ [field]: e.target.value })}
          placeholder="ex: 4Xdev, 2Hdev"
          className="h-7 text-xs"
        />
      </div>
    );
  };

  const renderFiltreRougeCell = (field: 'filtreRougeVL' | 'filtreRougeVP') => {
    const value = binocularVision[field];
    
    return (
      <div className="flex flex-wrap gap-1">
        <QuickSelectButton
          size="xs"
          label="Fusion"
          selected={value === 'Fusion'}
          onClick={() => handleSelect(field, 'Fusion')}
          selectedClassName="bg-zinc-900 text-white border-zinc-900"
        />
        <DropdownButton label="+" selectedLabel={FILTRE_ROUGE_OPTIONS.filter(o => o.id !== 'Fusion').find(o => o.id === value)?.label}>
          {FILTRE_ROUGE_OPTIONS.filter(o => o.id !== 'Fusion').map((opt) => (
            <DropdownOption key={opt.id} label={opt.label} selected={value === opt.id} onSelect={() => onChange({ [field]: opt.id })} onDeselect={() => onChange({ [field]: '' })} />
          ))}
        </DropdownButton>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeaderWithPreview
        title="Vision Binoculaire"
        preview={<BinoDisplay bino={binocularVision} />}
      />

      {/* Main Tests Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-3 py-2 font-medium w-24">Test</th>
              <th className="text-left px-3 py-2 font-medium">VL</th>
              <th className="text-left px-3 py-2 font-medium">VP</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-2 font-medium text-xs align-top">Test Écran</td>
              <td className="px-3 py-2">{renderCoverTestCell('coverTestVL')}</td>
              <td className="px-3 py-2">{renderCoverTestCell('coverTestVP')}</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2 font-medium text-xs align-top">TM</td>
              <td className="px-3 py-2">{renderMaddoxCell('maddoxVL')}</td>
              <td className="px-3 py-2">{renderMaddoxCell('maddoxVP')}</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2 font-medium text-xs align-top">FR</td>
              <td className="px-3 py-2">{renderFiltreRougeCell('filtreRougeVL')}</td>
              <td className="px-3 py-2">{renderFiltreRougeCell('filtreRougeVP')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PPC */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">PPC (Bris / Recouvrement)</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            value={binocularVision.ppc}
            onChange={(e) => onChange({ ppc: e.target.value })}
            placeholder="Bris: ex. 8cm"
            className="text-xs"
          />
          <Input
            value={binocularVision.ppcRecovery || ''}
            onChange={(e) => onChange({ ppcRecovery: e.target.value })}
            placeholder="Recouv: ex. 12cm"
            className="text-xs"
          />
          <Input
            value={binocularVision.ppcTarget || ''}
            onChange={(e) => onChange({ ppcTarget: e.target.value })}
            placeholder="Cible: stylo, lumière"
            className="text-xs"
          />
        </div>
      </div>

      {/* Réserves Fusionnelles */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Réserves Fusionnelles</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-medium">VL</Label>
            <div className="flex gap-2">
              <Input
                value={binocularVision.reservesBIVL}
                onChange={(e) => onChange({ reservesBIVL: e.target.value })}
                placeholder="BI: x/x/x"
                className="text-xs"
              />
              <Input
                value={binocularVision.reservesBOVL}
                onChange={(e) => onChange({ reservesBOVL: e.target.value })}
                placeholder="BO: x/x/x"
                className="text-xs"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-medium">VP</Label>
            <div className="flex gap-2">
              <Input
                value={binocularVision.reservesBIVP}
                onChange={(e) => onChange({ reservesBIVP: e.target.value })}
                placeholder="BI: x/x/x"
                className="text-xs"
              />
              <Input
                value={binocularVision.reservesBOVP}
                onChange={(e) => onChange({ reservesBOVP: e.target.value })}
                placeholder="BO: x/x/x"
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <CollapsibleNotes
        id="binocular-vision-notes"
        value={binocularVision.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes vision binoculaire..."
      />
    </div>
  );
}
