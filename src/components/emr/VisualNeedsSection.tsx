import { VisualNeeds, PatientSession } from '@/types/emr';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';

interface VisualNeedsSectionProps {
  visualNeeds: VisualNeeds;
  onChange: (updates: Partial<VisualNeeds>) => void;
  session?: PatientSession;
}

// Common options as quick buttons
const TRAVAIL_COMMON = ['bureau', 'ecrans'];
const TRAVAIL_OPTIONS = [
  { id: 'exterieur', label: 'Extérieur' },
  { id: 'conduite', label: 'Conduite pro' },
  { id: 'precision', label: 'Précision' },
];

// All screen options as buttons (only 4)
const ECRAN_OPTIONS = [
  { id: '0-2h', label: '0-2h' },
  { id: '2-4h', label: '2-4h' },
  { id: '4-8h', label: '4-8h' },
  { id: '8h+', label: '8h+' },
];

// Common conduite options
const CONDUITE_COMMON = ['les-deux', 'non'];
const CONDUITE_OPTIONS = [
  { id: 'jour', label: 'Jour seul' },
  { id: 'nuit', label: 'Nuit seule' },
];

const LOISIRS_COMMON = ['lecture', 'sports'];
const LOISIRS_OPTIONS = [
  { id: 'bricolage', label: 'Bricolage' },
  { id: 'couture', label: 'Couture' },
  { id: 'musique', label: 'Musique' },
  { id: 'jardinage', label: 'Jardinage' },
];

// All distance options as buttons (only 4)
const DISTANCE_OPTIONS = [
  { id: 'vl', label: 'VL' },
  { id: 'vp', label: 'VP' },
  { id: 'vi', label: 'VI' },
  { id: 'toutes', label: 'Toutes' },
];

 

const getTravailLabel = (id: string) => {
  if (id === 'bureau') return 'Bureau';
  if (id === 'ecrans') return 'Écrans';
  return TRAVAIL_OPTIONS.find(o => o.id === id)?.label;
};

const getConduiteLabel = (id: string) => {
  if (id === 'les-deux') return 'J+N';
  if (id === 'non') return 'Non';
  return CONDUITE_OPTIONS.find(o => o.id === id)?.label;
};

const getLoisirsLabel = (id: string) => {
  if (id === 'lecture') return 'Lecture';
  if (id === 'sports') return 'Sports';
  return LOISIRS_OPTIONS.find(o => o.id === id)?.label;
};

export function VisualNeedsSection({ visualNeeds, onChange }: VisualNeedsSectionProps) {
  const getFieldValue = (field: string): string | null => {
    const parts = visualNeeds.needs.split(',').filter(v => v);
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
    const parts = visualNeeds.needs.split(',').filter(v => v && !v.startsWith(`${field}:`));
    parts.push(`${field}:${value}`);
    onChange({ needs: parts.join(',') });
  };

  const clearFieldValue = (field: string) => {
    const parts = visualNeeds.needs.split(',').filter(v => v && !v.startsWith(`${field}:`));
    onChange({ needs: parts.join(',') });
  };

  const handleToggle = (field: string, value: string) => {
    if (getFieldValue(field) === value) {
      clearFieldValue(field);
    } else {
      setFieldValue(field, value);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Besoin Visuel" />

      <div className="space-y-3">
        {/* Travail row */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[50px]">Travail</span>
          {TRAVAIL_COMMON.map((v) => (
            <QuickSelectButton key={v} label={getTravailLabel(v) || v} selected={getFieldValue('travail') === v} onClick={() => handleToggle('travail', v)} />
          ))}
          <DropdownButton label="+" selectedLabel={TRAVAIL_OPTIONS.find(o => o.id === getFieldValue('travail'))?.label}>
            {TRAVAIL_OPTIONS.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={getFieldValue('travail') === opt.id} onSelect={() => setFieldValue('travail', opt.id)} onDeselect={() => clearFieldValue('travail')} />
            ))}
          </DropdownButton>
        </div>

        {/* Écran row - all buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[50px]">Écran</span>
          {ECRAN_OPTIONS.map((opt) => (
            <QuickSelectButton key={opt.id} label={opt.label} selected={getFieldValue('ecran') === opt.id} onClick={() => handleToggle('ecran', opt.id)} />
          ))}
        </div>

        {/* Conduite row */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[50px]">Conduite</span>
          {CONDUITE_COMMON.map((v) => (
            <QuickSelectButton key={v} label={getConduiteLabel(v) || v} selected={getFieldValue('conduite') === v} onClick={() => handleToggle('conduite', v)} />
          ))}
          <DropdownButton label="+" selectedLabel={CONDUITE_OPTIONS.find(o => o.id === getFieldValue('conduite'))?.label}>
            {CONDUITE_OPTIONS.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={getFieldValue('conduite') === opt.id} onSelect={() => setFieldValue('conduite', opt.id)} onDeselect={() => clearFieldValue('conduite')} />
            ))}
          </DropdownButton>
        </div>

        {/* Distance row - all buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[50px]">Distance</span>
          {DISTANCE_OPTIONS.map((opt) => (
            <QuickSelectButton key={opt.id} label={opt.label} selected={getFieldValue('distance') === opt.id} onClick={() => handleToggle('distance', opt.id)} />
          ))}
        </div>

        {/* Loisirs row */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground min-w-[50px]">Loisirs</span>
          {LOISIRS_COMMON.map((v) => (
            <QuickSelectButton key={v} label={getLoisirsLabel(v) || v} selected={getFieldValue('loisirs') === v} onClick={() => handleToggle('loisirs', v)} />
          ))}
          <DropdownButton label="+" selectedLabel={LOISIRS_OPTIONS.find(o => o.id === getFieldValue('loisirs'))?.label}>
            {LOISIRS_OPTIONS.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={getFieldValue('loisirs') === opt.id} onSelect={() => setFieldValue('loisirs', opt.id)} onDeselect={() => clearFieldValue('loisirs')} />
            ))}
          </DropdownButton>
        </div>
      </div>

      <CollapsibleNotes
        id="visual-needs-notes"
        value={visualNeeds.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Autres besoins visuels..."
      />
    </div>
  );
}
