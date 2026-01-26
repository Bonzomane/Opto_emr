import { CurrentRx, PatientSession } from '@/types/emr';
import { LABELS } from '@/constants/labels';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';

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

  const getFieldValueLabel = (field: string, id: string) => {
    return LABELS.rxFields[field]?.[id] || id;
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
      <SectionHeader title="RX Actuels" />

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
              label={getFieldValueLabel('type', v)} 
              selected={getFieldValue('type') === v} 
              onClick={() => getFieldValue('type') === v ? clearFieldValue('type') : setFieldValue('type', v)} 
            />
          ))}
          <DropdownButton label="+" selectedLabel={getFieldValueLabel('type', getFieldValue('type') || '')}>
            {RX_TYPES.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={getFieldValue('type') === opt.id} onSelect={() => setFieldValue('type', opt.id)} onDeselect={() => clearFieldValue('type')} />
            ))}
          </DropdownButton>
        </div>

        {/* Vision VL row */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[60px]">Vision VL</span>
          {VISION_OPTIONS.map((opt) => (
            <QuickSelectButton 
              key={opt.id} 
              label={getFieldValueLabel('visionVL', opt.id)} 
              selected={getFieldValue('visionVL') === opt.id} 
              onClick={() => getFieldValue('visionVL') === opt.id ? clearFieldValue('visionVL') : setFieldValue('visionVL', opt.id)} 
            />
          ))}
        </div>

        {/* Vision VP row */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[60px]">Vision VP</span>
          {VISION_OPTIONS.map((opt) => (
            <QuickSelectButton 
              key={opt.id} 
              label={getFieldValueLabel('visionVP', opt.id)} 
              selected={getFieldValue('visionVP') === opt.id} 
              onClick={() => getFieldValue('visionVP') === opt.id ? clearFieldValue('visionVP') : setFieldValue('visionVP', opt.id)} 
            />
          ))}
        </div>

        {/* État row */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[40px]">État</span>
          {ETAT_COMMON.map((v) => (
            <QuickSelectButton 
              key={v} 
              label={getFieldValueLabel('condition', v)} 
              selected={getFieldValue('condition') === v} 
              onClick={() => getFieldValue('condition') === v ? clearFieldValue('condition') : setFieldValue('condition', v)} 
            />
          ))}
          <DropdownButton label="+" selectedLabel={getFieldValueLabel('condition', getFieldValue('condition') || '')}>
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
