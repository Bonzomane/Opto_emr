import { CurrentRx, PatientSession } from '@/types/emr';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { CurrentRxDisplay } from '@/print/caseHistoryDisplays';

interface CurrentRxSectionProps {
  currentRx: CurrentRx;
  onChange: (updates: Partial<CurrentRx>) => void;
  session?: PatientSession;
}

// Common types as quick buttons
const RX_TYPE_COMMON = ['progressif', 'sv-vl'];
const RX_TYPES = [
  { id: 'sv-vp', label: 'SV VP' },
  { id: 'degressif', label: 'Dégressif' },
  { id: 'ctrl-myopie', label: 'Ctrl. Myopie' },
  { id: 'lc', label: 'LC' },
];

// Vision options - all as quick buttons (only 3)
const VISION_OPTIONS = [
  { id: 'bonne', label: 'Bonne' },
  { id: 'moyenne', label: 'Moyenne' },
  { id: 'mauvaise', label: 'Mauvaise' },
];

// Condition options - common as quick buttons
const ETAT_COMMON = ['bon', 'use'];
const ETAT_OPTIONS = [
  { id: 'raye', label: 'Rayé' },
  { id: 'casse', label: 'Cassé' },
];

 

const getTypeLabel = (id: string) => {
  if (id === 'progressif') return 'Progressif';
  if (id === 'sv-vl') return 'SV VL';
  return RX_TYPES.find(o => o.id === id)?.label;
};

const getEtatLabel = (id: string) => {
  if (id === 'bon') return 'Bon';
  if (id === 'use') return 'Usé';
  return ETAT_OPTIONS.find(o => o.id === id)?.label;
};

export function CurrentRxSection({ currentRx, onChange }: CurrentRxSectionProps) {
  // Parse stored values - format: "field:option" e.g. "type:lunettes,vision:bonne"
  const getFieldValue = (field: string): string | null => {
    const parts = currentRx.etat.split(',').filter(v => v);
    for (const part of parts) {
      const [f, v] = part.split(':');
      if (f === field) return v;
    }
    return null;
  };

  const getFieldLabel = (field: string, options: { id: string; label: string }[]): string | undefined => {
    const value = getFieldValue(field);
    if (!value) return undefined;
    return options.find(o => o.id === value)?.label;
  };

  const setFieldValue = (field: string, value: string) => {
    const parts = currentRx.etat.split(',').filter(v => v && !v.startsWith(`${field}:`));
    parts.push(`${field}:${value}`);
    onChange({ etat: parts.join(','), hasNoRx: false });
  };

  const clearFieldValue = (field: string) => {
    const parts = currentRx.etat.split(',').filter(v => v && !v.startsWith(`${field}:`));
    onChange({ etat: parts.join(',') });
  };

  const handleNoRxToggle = () => {
    if (currentRx.hasNoRx) {
      // Deselect - just set hasNoRx to false
      onChange({ hasNoRx: false });
    } else {
      // Select - clear everything
      onChange({ hasNoRx: true, etat: '' });
    }
  };

  const isNoRxSelected = currentRx.hasNoRx;

  // Handle "Pas d'Rx VL" and "Pas d'Rx VP" toggles
  const handleNoRxPartialToggle = (field: 'norx-vl' | 'norx-vp') => {
    const parts = currentRx.etat.split(',').filter(v => v);
    if (parts.includes(field)) {
      // Remove it
      onChange({ etat: parts.filter(p => p !== field).join(',') });
    } else {
      // Add it
      onChange({ etat: [...parts, field].join(','), hasNoRx: false });
    }
  };

  const isNoRxVL = currentRx.etat.split(',').includes('norx-vl');
  const isNoRxVP = currentRx.etat.split(',').includes('norx-vp');

  return (
    <div className="space-y-4">
      <SectionHeaderWithPreview
        title="RX Actuel"
        preview={<CurrentRxDisplay currentRx={currentRx} />}
      />

      <div className="space-y-3">
        {/* Aucune Rx / Pas d'Rx VL/VP + Type row */}
        <div className="flex flex-wrap gap-1">
          <QuickSelectButton label="Aucune Rx" selected={isNoRxSelected} onClick={handleNoRxToggle} />
          <QuickSelectButton label="Pas d'Rx VL" selected={isNoRxVL} onClick={() => handleNoRxPartialToggle('norx-vl')} />
          <QuickSelectButton label="Pas d'Rx VP" selected={isNoRxVP} onClick={() => handleNoRxPartialToggle('norx-vp')} />
          <span className="text-xs text-muted-foreground self-center px-1">|</span>
          {RX_TYPE_COMMON.map((v) => (
            <QuickSelectButton 
              key={v} 
              label={getTypeLabel(v) || v} 
              selected={getFieldValue('type') === v} 
              onClick={() => getFieldValue('type') === v ? clearFieldValue('type') : setFieldValue('type', v)} 
            />
          ))}
          <DropdownButton label="+" selectedLabel={RX_TYPES.find(o => o.id === getFieldValue('type'))?.label}>
            {RX_TYPES.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={getFieldValue('type') === opt.id} onSelect={() => setFieldValue('type', opt.id)} onDeselect={() => clearFieldValue('type')} />
            ))}
          </DropdownButton>
        </div>

        {/* Vision row */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[40px]">Vision</span>
          {VISION_OPTIONS.map((opt) => (
            <QuickSelectButton 
              key={opt.id} 
              label={opt.label} 
              selected={getFieldValue('vision') === opt.id} 
              onClick={() => getFieldValue('vision') === opt.id ? clearFieldValue('vision') : setFieldValue('vision', opt.id)} 
            />
          ))}
        </div>

        {/* État row */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[40px]">État</span>
          {ETAT_COMMON.map((v) => (
            <QuickSelectButton 
              key={v} 
              label={getEtatLabel(v) || v} 
              selected={getFieldValue('condition') === v} 
              onClick={() => getFieldValue('condition') === v ? clearFieldValue('condition') : setFieldValue('condition', v)} 
            />
          ))}
          <DropdownButton label="+" selectedLabel={ETAT_OPTIONS.find(o => o.id === getFieldValue('condition'))?.label}>
            {ETAT_OPTIONS.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={getFieldValue('condition') === opt.id} onSelect={() => setFieldValue('condition', opt.id)} onDeselect={() => clearFieldValue('condition')} />
            ))}
          </DropdownButton>
        </div>
      </div>

      <CollapsibleNotes
        id="rx-notes"
        value={currentRx.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes additionnelles..."
      />
    </div>
  );
}
