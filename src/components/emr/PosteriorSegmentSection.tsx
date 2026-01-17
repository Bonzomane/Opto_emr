import { PosteriorSegment } from '@/types/emr';
import { Label } from '@/components/ui/label';
import { CollapsibleNotes } from './CollapsibleNotes';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { QuickSelectButton } from './QuickSelectButton';
import { hasCsvValue, toggleCsvValue } from '@/lib/selection';
import { SectionHeader } from './SectionHeader';

interface PosteriorSegmentSectionProps {
  posteriorSegment: PosteriorSegment;
  onChange: (updates: Partial<PosteriorSegment>) => void;
}

 

// Field definitions
const FIELDS: { 
  baseKey: string; 
  label: string; 
  common: string[];
  options: { id: string; label: string }[];
}[] = [
  { 
    baseKey: 'papille', 
    label: 'Papille',
    common: ['Saine', 'Distincte', 'Rosée'],
    options: [
      { id: 'pale', label: 'Pâle' },
      { id: 'oedeme', label: 'Œdème' },
      { id: 'excavation', label: 'Excavation' },
      { id: 'hemorragie', label: 'Hémorragie' },
      { id: 'atrophie', label: 'Atrophie' },
    ]
  },
  { 
    baseKey: 'macula', 
    label: 'Macula',
    common: ['Saine', 'RF+', 'RF-'],
    options: [
      { id: 'drusen', label: 'Drusen' },
      { id: 'dmla-seche', label: 'DMLA sèche' },
      { id: 'dmla-humide', label: 'DMLA humide' },
      { id: 'epm', label: 'EPM' },
      { id: 'trou', label: 'Trou maculaire' },
      { id: 'oedeme', label: 'Œdème' },
    ]
  },
  { 
    baseKey: 'vaisseaux', 
    label: 'Vaisseaux',
    common: ['2/3-1/3'],
    options: [
      { id: 'croisements', label: 'Croisements AV' },
      { id: 'hemorragies', label: 'Hémorragies' },
      { id: 'exsudats', label: 'Exsudats' },
      { id: 'microanevrismes', label: 'Microanévrismes' },
      { id: 'neovx', label: 'Néovaisseaux' },
    ]
  },
  { 
    baseKey: 'peripherie', 
    label: 'Périphérie',
    common: ['Saine', 'Pas de trou', 'Déchirure', 'Décollement'],
    options: [
      { id: 'lattice', label: 'Lattice' },
      { id: 'non-vue', label: 'Non vue' },
      { id: 'drusen', label: 'Drusen périph.' },
      { id: 'pigment', label: 'Pigment' },
    ]
  },
  { 
    baseKey: 'vitre', 
    label: 'Vitré',
    common: ['Clair'],
    options: [
      { id: 'cf', label: 'Corps flottants' },
      { id: 'dvp', label: 'DVP' },
      { id: 'hemorragie', label: 'Hémorragie' },
      { id: 'opacites', label: 'Opacités' },
    ]
  },
];

// C/D ratio options
const CD_OPTIONS = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'];

export function PosteriorSegmentSection({ posteriorSegment, onChange }: PosteriorSegmentSectionProps) {
  const handleToggle = (key: keyof PosteriorSegment, value: string) => {
    onChange({ [key]: toggleCsvValue(posteriorSegment[key] || '', value) });
  };

  const isSelected = (key: keyof PosteriorSegment, value: string) => {
    return hasCsvValue(posteriorSegment[key] || '', value);
  };

  const renderEyeField = (baseKey: string, eye: 'OD' | 'OS', common: string[], options: { id: string; label: string }[]) => {
    const key = `${baseKey}${eye}` as keyof PosteriorSegment;
    const cdVertKey = `cdVert${eye}` as keyof PosteriorSegment;
    const cdHorizKey = `cdHoriz${eye}` as keyof PosteriorSegment;
    
    return (
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {common.map((opt) => (
            <QuickSelectButton 
              key={opt} 
              label={opt} 
              selected={isSelected(key, opt)} 
              onClick={() => handleToggle(key, opt)} 
            />
          ))}
          <DropdownButton 
            label="+" 
            selectedLabel={options.find(o => isSelected(key, o.label))?.label}
          >
            {options.map((opt) => (
              <DropdownOption
                key={opt.id}
                label={opt.label}
                selected={isSelected(key, opt.label)}
                onSelect={() => handleToggle(key, opt.label)}
                onDeselect={() => handleToggle(key, opt.label)}
              />
            ))}
          </DropdownButton>
        </div>
        {/* V/H cup quick buttons for papille */}
        {baseKey === 'papille' && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[10px] text-muted-foreground w-3">V</span>
            {CD_OPTIONS.map((v) => (
              <QuickSelectButton
                key={`v-${v}`}
                label={v}
                selected={posteriorSegment[cdVertKey] === v}
                onClick={() => onChange({ [cdVertKey]: posteriorSegment[cdVertKey] === v ? '' : v })}
              />
            ))}
          </div>
        )}
        {baseKey === 'papille' && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[10px] text-muted-foreground w-3">H</span>
            {CD_OPTIONS.map((v) => (
              <QuickSelectButton
                key={`h-${v}`}
                label={v}
                selected={posteriorSegment[cdHorizKey] === v}
                onClick={() => onChange({ [cdHorizKey]: posteriorSegment[cdHorizKey] === v ? '' : v })}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Segment Postérieur" />

      <div className="space-y-4">
        {FIELDS.map(({ baseKey, label, common, options }) => (
          <div key={baseKey} className="space-y-2">
            <Label className="text-xs font-medium">{label}</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">OD</span>
                {renderEyeField(baseKey, 'OD', common, options)}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">OS</span>
                {renderEyeField(baseKey, 'OS', common, options)}
              </div>
            </div>
          </div>
        ))}

      </div>

      <CollapsibleNotes
        id="posterior-segment-notes"
        value={posteriorSegment.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes segment postérieur..."
      />
    </div>
  );
}
