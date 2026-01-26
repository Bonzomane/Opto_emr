import { AnteriorSegment } from '@/types/emr';
import { Label } from '@/components/ui/label';
import { CollapsibleNotes } from './CollapsibleNotes';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { cn } from '@/lib/utils';
import { QuickSelectButton } from './QuickSelectButton';
import { hasCsvValue, parseCsv, toggleCsvValue } from '@/lib/selection';
import { SectionHeader } from './SectionHeader';
import { GradedButton } from './GradedButton';
import { LateralizedInput } from './LateralizedInput';

interface AnteriorSegmentSectionProps {
  anteriorSegment: AnteriorSegment;
  onChange: (updates: Partial<AnteriorSegment>) => void;
}

 

// Cristallin types with grades
const CRISTALLIN_GRADED = ['SN', 'SC', 'SCP', 'OCP'];

// Van Herick angle ratios
const VAN_HERICK_RATIOS = ['1:1', '1:1/2', '1:1/3', '1:1/4'];

// Field definitions (excluding cristallin and angles which are handled separately)
const FIELDS: { 
  baseKey: string; 
  label: string; 
  common: string[];
  options: { id: string; label: string }[];
}[] = [
  { 
    baseKey: 'paupieres', 
    label: 'Paupières',
    common: ['Saines'],
    options: [
      { id: 'blepharite', label: 'Blépharite' },
      { id: 'chalazion', label: 'Chalazion' },
      { id: 'orgelet', label: 'Orgelet' },
      { id: 'ptosis', label: 'Ptosis' },
      { id: 'ectropion', label: 'Ectropion' },
      { id: 'entropion', label: 'Entropion' },
      { id: 'mgd', label: 'MGD' },
    ]
  },
  { 
    baseKey: 'conjonctive', 
    label: 'Conjonctive',
    common: ['Claire et lisse'],
    options: [
      { id: 'injection', label: 'Injection' },
      { id: 'pterygion', label: 'Ptérygion' },
      { id: 'pinguecula', label: 'Pinguécula' },
      { id: 'papilles', label: 'Papilles' },
      { id: 'follicules', label: 'Follicules' },
      { id: 'hemorragie', label: 'Hémorragie' },
    ]
  },
  { 
    baseKey: 'cornee', 
    label: 'Cornée',
    common: ['Claire'],
    options: [
      { id: 'keratite', label: 'Kératite' },
      { id: 'arcus', label: 'Arcus' },
      { id: 'oedeme', label: 'Œdème' },
      { id: 'cicatrice', label: 'Cicatrice' },
      { id: 'dystrophie', label: 'Dystrophie' },
      { id: 'guttata', label: 'Guttata' },
      { id: 'spk', label: 'SPK' },
    ]
  },
  { 
    baseKey: 'chambreAnt', 
    label: 'Chambre Ant.',
    common: ['Calme et profonde'],
    options: [
      { id: 'etroite', label: 'Étroite' },
      { id: 'tyndall', label: 'Tyndall +' },
      { id: 'hyphema', label: 'Hyphéma' },
      { id: 'hypopion', label: 'Hypopion' },
      { id: 'cellules', label: 'Cellules' },
    ]
  },
  { 
    baseKey: 'iris', 
    label: 'Iris',
    common: ['Sain'],
    options: [
      { id: 'synechies', label: 'Synéchies' },
      { id: 'neovx', label: 'Néovaisseaux' },
      { id: 'atrophie', label: 'Atrophie' },
      { id: 'nodules', label: 'Nodules' },
      { id: 'heterochromie', label: 'Hétérochromie' },
    ]
  },
];

export function AnteriorSegmentSection({ anteriorSegment, onChange }: AnteriorSegmentSectionProps) {
  const handleToggle = (key: keyof AnteriorSegment, value: string) => {
    onChange({ [key]: toggleCsvValue(anteriorSegment[key] || '', value) });
  };

  const isSelected = (key: keyof AnteriorSegment, value: string) => {
    return hasCsvValue(anteriorSegment[key] || '', value);
  };

  const getGradedValue = (key: keyof AnteriorSegment, prefix: string): string | null => {
    const values = parseCsv(anteriorSegment[key] || '');
    const match = values.find((v) => v.startsWith(prefix + ' '));
    if (match) {
      return match.replace(prefix + ' ', '');
    }
    return null;
  };

  const setGradedValue = (key: keyof AnteriorSegment, prefix: string, grade: string | null) => {
    const values = parseCsv(anteriorSegment[key] || '');
    const filtered = values.filter((v) => !v.startsWith(prefix + ' ') && v !== prefix);
    
    if (grade) {
      filtered.push(`${prefix} ${grade}`);
    }
    
    onChange({ [key]: filtered.join(', ') });
  };

  const renderEyeField = (baseKey: string, eye: 'OD' | 'OS', common: string[], options: { id: string; label: string }[]) => {
    const key = `${baseKey}${eye}` as keyof AnteriorSegment;
    return (
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
    );
  };

  const renderCristallinField = (eye: 'OD' | 'OS') => {
    const key = `cristallin${eye}` as keyof AnteriorSegment;
    
    return (
      <div className="flex flex-wrap gap-1">
        <QuickSelectButton 
          label="Clair" 
          selected={isSelected(key, 'Clair')} 
          onClick={() => handleToggle(key, 'Clair')} 
        />
        <QuickSelectButton 
          label="IOL" 
          selected={isSelected(key, 'IOL')} 
          onClick={() => handleToggle(key, 'IOL')} 
        />
        {CRISTALLIN_GRADED.map((type) => (
          <GradedButton
            key={type}
            label={type}
            currentGrade={getGradedValue(key, type)}
            onGradeChange={(grade) => setGradedValue(key, type, grade)}
          />
        ))}
      </div>
    );
  };

  const renderAnglesField = (eye: 'OD' | 'OS') => {
    const key = `angles${eye}` as keyof AnteriorSegment;
    const value = anteriorSegment[key] || '';
    
    return (
      <div className="flex flex-wrap gap-1">
        <span className="text-[10px] text-muted-foreground self-center mr-1">VH:</span>
        {VAN_HERICK_RATIOS.map((ratio) => (
          <QuickSelectButton 
            key={ratio} 
            label={ratio} 
            selected={value === ratio} 
            onClick={() => onChange({ [key]: value === ratio ? '' : ratio })} 
          />
        ))}
        <DropdownButton 
          label="+" 
          selectedLabel={!VAN_HERICK_RATIOS.includes(value) && value ? value : undefined}
        >
          <DropdownOption label="Ouvert" selected={value === 'Ouvert'} onSelect={() => onChange({ [key]: 'Ouvert' })} onDeselect={() => onChange({ [key]: '' })} />
          <DropdownOption label="Étroit" selected={value === 'Étroit'} onSelect={() => onChange({ [key]: 'Étroit' })} onDeselect={() => onChange({ [key]: '' })} />
          <DropdownOption label="Fermable" selected={value === 'Fermable'} onSelect={() => onChange({ [key]: 'Fermable' })} onDeselect={() => onChange({ [key]: '' })} />
        </DropdownButton>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Segment Antérieur" />

      <div className="space-y-4">
        {/* Regular fields */}
        {FIELDS.map(({ baseKey, label, common, options }) => (
          <LateralizedInput
            key={baseKey}
            label={label}
            od={renderEyeField(baseKey, 'OD', common, options)}
            os={renderEyeField(baseKey, 'OS', common, options)}
          />
        ))}

        {/* Cristallin - special handling */}
        <LateralizedInput
          label="Cristallin"
          od={renderCristallinField('OD')}
          os={renderCristallinField('OS')}
        />

        {/* Angles - Van Herick */}
        <LateralizedInput
          label="Angles"
          od={renderAnglesField('OD')}
          os={renderAnglesField('OS')}
        />
      </div>

      <CollapsibleNotes
        id="anterior-segment-notes"
        value={anteriorSegment.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes segment antérieur..."
      />
    </div>
  );
}
