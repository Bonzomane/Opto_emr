import { PreliminaryTests, PatientSession } from '@/types/emr';
import { LABELS } from '@/constants/labels';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { cn } from '@/lib/utils';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';

interface PreliminaryTestsSectionProps {
  preliminaryTests: PreliminaryTests;
  onChange: (updates: Partial<PreliminaryTests>) => void;
  session?: PatientSession;
}

// Chart options
const CHART_VL_OPTIONS = [
  { id: 'snellen', label: 'Snellen' },
  { id: 'lea', label: 'Lea' },
  { id: 'numbers', label: 'Chiffres' },
  { id: 'shapes', label: 'Formes' },
];

const CHART_VP_OPTIONS = [
  { id: 'reading-card', label: 'Carte lecture' },
  { id: 'lea', label: 'Lea' },
];

// Common VA values shown as quick buttons (metric 6/ format)
const VA_VL_COMMON = ['6/6', '6/7.5', '6/9', '6/12'];
const VA_VL_OPTIONS = [
  { id: '6/15', label: '6/15' },
  { id: '6/18', label: '6/18' },
  { id: '6/21', label: '6/21' },
  { id: '6/24', label: '6/24' },
  { id: '6/30', label: '6/30' },
  { id: '6/60', label: '6/60' },
  { id: 'CF', label: 'CF' },
  { id: 'HM', label: 'HM' },
  { id: 'LP', label: 'LP' },
  { id: 'NLP', label: 'NLP' },
];

// VP acuity in M notation @40cm
const VA_VP_COMMON = ['0.37M', '0.50M', '0.62M', '0.75M'];
const VA_VP_OPTIONS = [
  { id: '1.00M', label: '1.00M' },
  { id: '1.25M', label: '1.25M' },
  { id: '1.50M', label: '1.50M' },
  { id: '2.00M', label: '2.00M' },
  { id: '2.50M', label: '2.50M' },
  { id: '3.00M', label: '3.00M' },
];

const COULEURS_COMMON = ['normal', 'deficient'];
const COULEURS_OPTIONS = [
  { id: 'protanope', label: 'Protanope' },
  { id: 'deuteranope', label: 'Deutéranope' },
  { id: 'non-teste', label: 'Non testé' },
];

// Randot stereo options
const FORMES_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
const CERCLES_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const ANIMAUX_OPTIONS = ['0', '1', '2', '3'];

const PUPILLES_OPTIONS = [
  { id: 'perrla', label: 'PERRLA' },
  { id: 'dpar-', label: 'DPAR-' },
  { id: 'lent', label: 'Lent' },
  { id: 'fixe', label: 'Fixe' },
  { id: 'marcus-gunn', label: 'Marcus Gunn +' },
  { id: 'anisocorie', label: 'Anisocorie' },
];

const MOUVEMENTS_OPTIONS = [
  { id: 'souple-complet', label: 'Souples et complets' },
  { id: 'limité', label: 'Limité' },
  { id: 'douloureux', label: 'Douloureux' },
  { id: 'nystagmus', label: 'Nystagmus' },
  { id: 'strabisme', label: 'Strabisme' },
];

 

// Chart selector component
function ChartSelector({ value, options, onChange }: { value: string; options: { id: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <QuickSelectButton
          key={opt.id}
          label={opt.label}
          selected={value === opt.id}
          onClick={() => onChange(opt.id)}
          size="xs"
          selectedClassName="bg-zinc-700 text-white border-zinc-700"
          unselectedClassName="bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50"
        />
      ))}
    </div>
  );
}

// VA Input row component
function VAInputRow({ 
  label, 
  odField, osField, ouField,
  odValue, osValue, ouValue,
  commonOptions, dropdownOptions,
  onChange,
  showOU = true 
}: { 
  label: string;
  odField: keyof PreliminaryTests;
  osField: keyof PreliminaryTests;
  ouField?: keyof PreliminaryTests;
  odValue: string;
  osValue: string;
  ouValue?: string;
  commonOptions: string[];
  dropdownOptions: { id: string; label: string }[];
  onChange: (updates: Partial<PreliminaryTests>) => void;
  showOU?: boolean;
}) {
  const handleSelect = (field: keyof PreliminaryTests, value: string, currentValue: string) => {
    onChange({ [field]: currentValue === value ? '' : value });
  };

  return (
    <div className="grid grid-cols-[50px_1fr_1fr_1fr] gap-2 items-start">
      <span className="text-xs font-medium text-zinc-600 pt-1">{label}</span>
      
      {/* OD */}
      <div className="space-y-0.5">
        <span className="text-[10px] text-muted-foreground">OD</span>
        <div className="flex flex-wrap gap-0.5">
          {commonOptions.map((v) => (
            <QuickSelectButton key={v} label={v} selected={odValue === v} onClick={() => handleSelect(odField, v, odValue)} size="xs" />
          ))}
          <DropdownButton label="+" selectedLabel={dropdownOptions.find(o => o.id === odValue)?.label}>
            {dropdownOptions.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={odValue === opt.id} onSelect={() => onChange({ [odField]: opt.id })} onDeselect={() => onChange({ [odField]: '' })} />
            ))}
          </DropdownButton>
        </div>
      </div>
      
      {/* OS */}
      <div className="space-y-0.5">
        <span className="text-[10px] text-muted-foreground">OS</span>
        <div className="flex flex-wrap gap-0.5">
          {commonOptions.map((v) => (
            <QuickSelectButton key={v} label={v} selected={osValue === v} onClick={() => handleSelect(osField, v, osValue)} size="xs" />
          ))}
          <DropdownButton label="+" selectedLabel={dropdownOptions.find(o => o.id === osValue)?.label}>
            {dropdownOptions.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={osValue === opt.id} onSelect={() => onChange({ [osField]: opt.id })} onDeselect={() => onChange({ [osField]: '' })} />
            ))}
          </DropdownButton>
        </div>
      </div>
      
      {/* OU */}
      {showOU && ouField ? (
        <div className="space-y-0.5">
          <span className="text-[10px] text-muted-foreground">OU</span>
          <div className="flex flex-wrap gap-0.5">
            {commonOptions.map((v) => (
              <QuickSelectButton key={v} label={v} selected={ouValue === v} onClick={() => handleSelect(ouField, v, ouValue || '')} size="xs" />
            ))}
            <DropdownButton label="+" selectedLabel={dropdownOptions.find(o => o.id === ouValue)?.label}>
              {dropdownOptions.map((opt) => (
                <DropdownOption key={opt.id} label={opt.label} selected={ouValue === opt.id} onSelect={() => onChange({ [ouField]: opt.id })} onDeselect={() => onChange({ [ouField]: '' })} />
              ))}
            </DropdownButton>
          </div>
        </div>
      ) : <div />}
    </div>
  );
}

export function PreliminaryTestsSection({ preliminaryTests, onChange }: PreliminaryTestsSectionProps) {
  const handleVASelect = (field: keyof PreliminaryTests, value: string) => {
    const current = preliminaryTests[field];
    onChange({ [field]: current === value ? '' : value });
  };

  // Toggle a value in a comma-separated string (for PERRLA + DPAR- combo)
  const togglePupilValue = (field: 'pupillesOD' | 'pupillesOS', value: string) => {
    const current = preliminaryTests[field] as string;
    const values = current ? current.split(', ').filter(v => v) : [];
    const idx = values.indexOf(value);
    if (idx >= 0) {
      values.splice(idx, 1);
    } else {
      // Only allow perrla and dpar- to be combined
      if (['perrla', 'dpar-'].includes(value)) {
        const filtered = values.filter(v => ['perrla', 'dpar-'].includes(v));
        filtered.push(value);
        onChange({ [field]: filtered.join(', ') });
        return;
      }
      onChange({ [field]: value });
      return;
    }
    onChange({ [field]: values.join(', ') });
  };

  const hasPupilValue = (field: 'pupillesOD' | 'pupillesOS', value: string) => {
    const current = preliminaryTests[field] as string;
    if (!current) return false;
    return current.split(', ').includes(value);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Tests Préliminaires" />

      {/* ==================== AV VL SECTION ==================== */}
      <div className="border border-zinc-300 rounded-lg p-3 bg-zinc-50/50">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold text-zinc-800">Acuité Visuelle — VL (6/)</Label>
          <ChartSelector 
            value={preliminaryTests.chartVL} 
            options={CHART_VL_OPTIONS} 
            onChange={(v) => onChange({ chartVL: v })} 
          />
        </div>
        
        <div className="space-y-3">
          <VAInputRow
            label="SC"
            odField="avVLscOD" osField="avVLscOS" ouField="avVLscOU"
            odValue={preliminaryTests.avVLscOD} osValue={preliminaryTests.avVLscOS} ouValue={preliminaryTests.avVLscOU}
            commonOptions={VA_VL_COMMON} dropdownOptions={VA_VL_OPTIONS}
            onChange={onChange}
          />
          <VAInputRow
            label="AC"
            odField="avVLacOD" osField="avVLacOS" ouField="avVLacOU"
            odValue={preliminaryTests.avVLacOD} osValue={preliminaryTests.avVLacOS} ouValue={preliminaryTests.avVLacOU}
            commonOptions={VA_VL_COMMON} dropdownOptions={VA_VL_OPTIONS}
            onChange={onChange}
          />
          <VAInputRow
            label="PH"
            odField="avVLphOD" osField="avVLphOS"
            odValue={preliminaryTests.avVLphOD} osValue={preliminaryTests.avVLphOS}
            commonOptions={VA_VL_COMMON} dropdownOptions={VA_VL_OPTIONS}
            onChange={onChange}
            showOU={false}
          />
        </div>
      </div>

      {/* ==================== AV VP SECTION ==================== */}
      <div className="border border-zinc-300 rounded-lg p-3 bg-zinc-50/50">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold text-zinc-800">Acuité Visuelle — VP (M @40cm)</Label>
          <ChartSelector 
            value={preliminaryTests.chartVP} 
            options={CHART_VP_OPTIONS} 
            onChange={(v) => onChange({ chartVP: v })} 
          />
        </div>
        
        <div className="space-y-3">
          <VAInputRow
            label="SC"
            odField="avVPscOD" osField="avVPscOS" ouField="avVPscOU"
            odValue={preliminaryTests.avVPscOD} osValue={preliminaryTests.avVPscOS} ouValue={preliminaryTests.avVPscOU}
            commonOptions={VA_VP_COMMON} dropdownOptions={VA_VP_OPTIONS}
            onChange={onChange}
          />
          <VAInputRow
            label="AC"
            odField="avVPacOD" osField="avVPacOS" ouField="avVPacOU"
            odValue={preliminaryTests.avVPacOD} osValue={preliminaryTests.avVPacOS} ouValue={preliminaryTests.avVPacOU}
            commonOptions={VA_VP_COMMON} dropdownOptions={VA_VP_OPTIONS}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Vision des couleurs */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Vision des Couleurs (Ishihara)</Label>
        <div className="flex flex-wrap gap-1">
          {COULEURS_COMMON.map((v) => (
            <QuickSelectButton key={v} label={v === 'normal' ? 'Normal' : 'Déficient'} selected={preliminaryTests.couleurs === v} onClick={() => handleVASelect('couleurs', v)} />
          ))}
          <DropdownButton label="+" selectedLabel={COULEURS_OPTIONS.find(o => o.id === preliminaryTests.couleurs)?.label}>
            {COULEURS_OPTIONS.map((opt) => (
              <DropdownOption key={opt.id} label={opt.label} selected={preliminaryTests.couleurs === opt.id} onSelect={() => onChange({ couleurs: opt.id })} onDeselect={() => onChange({ couleurs: '' })} />
            ))}
          </DropdownButton>
        </div>
      </div>

      {/* Stéréoscopie (Randot) */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Stéréoscopie (Randot)</Label>
        <div className="space-y-2">
          {/* Normal quick button */}
          <div className="flex items-center gap-2 mb-2">
            <QuickSelectButton 
              label="Normal" 
              selected={preliminaryTests.stereoFormes === 'Normal' && preliminaryTests.stereoCercles === 'Normal' && preliminaryTests.stereoAnimaux === 'Normal'} 
              onClick={() => {
                const isNormal = preliminaryTests.stereoFormes === 'Normal' && preliminaryTests.stereoCercles === 'Normal' && preliminaryTests.stereoAnimaux === 'Normal';
                if (isNormal) {
                  onChange({ stereoFormes: '', stereoCercles: '', stereoAnimaux: '' });
                } else {
                  onChange({ stereoFormes: 'Normal', stereoCercles: 'Normal', stereoAnimaux: 'Normal' });
                }
              }} 
            />
          </div>
          {/* Formes /8 */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-muted-foreground min-w-[55px]">Formes</span>
            {FORMES_OPTIONS.map((v) => (
              <QuickSelectButton key={v} label={v} selected={preliminaryTests.stereoFormes === v} onClick={() => handleVASelect('stereoFormes', v)} size="xs" />
            ))}
            <span className="text-xs text-muted-foreground">/8</span>
          </div>
          {/* Cercles /10 */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-muted-foreground min-w-[55px]">Cercles</span>
            {CERCLES_OPTIONS.map((v) => (
              <QuickSelectButton key={v} label={v} selected={preliminaryTests.stereoCercles === v} onClick={() => handleVASelect('stereoCercles', v)} size="xs" />
            ))}
            <span className="text-xs text-muted-foreground">/10</span>
          </div>
          {/* Animaux /3 */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-muted-foreground min-w-[55px]">Animaux</span>
            {ANIMAUX_OPTIONS.map((v) => (
              <QuickSelectButton key={v} label={v} selected={preliminaryTests.stereoAnimaux === v} onClick={() => handleVASelect('stereoAnimaux', v)} size="xs" />
            ))}
            <span className="text-xs text-muted-foreground">/3</span>
          </div>
        </div>
      </div>

      {/* Réflexes pupillaires - PERRLA and DPAR- can be selected together */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Réflexes Pupillaires</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">OD</span>
            <div className="flex flex-wrap gap-1">
              <QuickSelectButton label="PERRLA" selected={hasPupilValue('pupillesOD', 'perrla')} onClick={() => togglePupilValue('pupillesOD', 'perrla')} />
              <QuickSelectButton label="DPAR-" selected={hasPupilValue('pupillesOD', 'dpar-')} onClick={() => togglePupilValue('pupillesOD', 'dpar-')} />
              <DropdownButton label="+" selectedLabel={preliminaryTests.pupillesOD && !preliminaryTests.pupillesOD.includes('perrla') && !preliminaryTests.pupillesOD.includes('dpar-') ? PUPILLES_OPTIONS.find(o => o.id === preliminaryTests.pupillesOD)?.label : undefined}>
                {PUPILLES_OPTIONS.filter(o => !['perrla', 'dpar-'].includes(o.id)).map((opt) => (
                  <DropdownOption key={opt.id} label={opt.label} selected={preliminaryTests.pupillesOD === opt.id} onSelect={() => onChange({ pupillesOD: opt.id })} onDeselect={() => onChange({ pupillesOD: '' })} />
                ))}
              </DropdownButton>
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">OS</span>
            <div className="flex flex-wrap gap-1">
              <QuickSelectButton label="PERRLA" selected={hasPupilValue('pupillesOS', 'perrla')} onClick={() => togglePupilValue('pupillesOS', 'perrla')} />
              <QuickSelectButton label="DPAR-" selected={hasPupilValue('pupillesOS', 'dpar-')} onClick={() => togglePupilValue('pupillesOS', 'dpar-')} />
              <DropdownButton label="+" selectedLabel={preliminaryTests.pupillesOS && !preliminaryTests.pupillesOS.includes('perrla') && !preliminaryTests.pupillesOS.includes('dpar-') ? PUPILLES_OPTIONS.find(o => o.id === preliminaryTests.pupillesOS)?.label : undefined}>
                {PUPILLES_OPTIONS.filter(o => !['perrla', 'dpar-'].includes(o.id)).map((opt) => (
                  <DropdownOption key={opt.id} label={opt.label} selected={preliminaryTests.pupillesOS === opt.id} onSelect={() => onChange({ pupillesOS: opt.id })} onDeselect={() => onChange({ pupillesOS: '' })} />
                ))}
              </DropdownButton>
            </div>
          </div>
        </div>
      </div>

      {/* Mouvements Oculaires */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Mouvements Oculaires</Label>
        <div className="flex flex-wrap gap-1">
          <QuickSelectButton 
            label="Souples et complets" 
            selected={preliminaryTests.mouvements === 'souple-complet'} 
            onClick={() => handleVASelect('mouvements', 'souple-complet')} 
          />
          <DropdownButton label="+" selectedLabel={preliminaryTests.mouvements && preliminaryTests.mouvements !== 'souple-complet' ? MOUVEMENTS_OPTIONS.find(o => o.id === preliminaryTests.mouvements)?.label : undefined}>
            {MOUVEMENTS_OPTIONS.filter(o => o.id !== 'souple-complet').map((opt) => (
              <DropdownOption 
                key={opt.id} 
                label={opt.label} 
                selected={preliminaryTests.mouvements === opt.id} 
                onSelect={() => onChange({ mouvements: opt.id })} 
                onDeselect={() => onChange({ mouvements: '' })} 
              />
            ))}
          </DropdownButton>
        </div>
      </div>

      <CollapsibleNotes
        id="preliminary-tests-notes"
        value={preliminaryTests.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes supplémentaires..."
      />
    </div>
  );
}
