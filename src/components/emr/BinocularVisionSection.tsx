import { BinocularVision } from '@/types/emr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface BinocularVisionSectionProps {
  binocularVision: BinocularVision;
  onChange: (updates: Partial<BinocularVision>) => void;
}

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

// Direction options
type Direction = 'ortho' | 'eso' | 'exo' | 'hyper' | 'hypo';
type DeviationType = 'phorie' | 'tropie';
type Eye = 'OD' | 'OS' | 'alt';
type Frequency = 'constant' | 'intermittent';
type Compensation = 'bc' | 'mc' | 'malc';

interface DeviationState {
  direction: Direction | null;
  type: DeviationType | null;
  eye: Eye | null;
  frequency: Frequency | null;
  compensation: Compensation | null;
}

// Parse notation string back to state
function parseNotation(notation: string): DeviationState {
  if (!notation || notation === 'Ortho') {
    return { direction: notation === 'Ortho' ? 'ortho' : null, type: null, eye: null, frequency: null, compensation: null };
  }
  
  const state: DeviationState = { direction: null, type: null, eye: null, frequency: null, compensation: null };
  
  // Check for direction - h = hypo (lowercase), H = hyper (uppercase)
  const firstChar = notation.charAt(0);
  if (firstChar === 'h' || notation.toLowerCase().includes('hypo')) {
    state.direction = 'hypo';
  } else if (firstChar === 'H' || notation.toLowerCase().includes('hyper')) {
    state.direction = 'hyper';
  } else if (firstChar === 'E' || notation.toLowerCase().includes('eso') || notation.toLowerCase().includes('éso')) {
    state.direction = 'eso';
  } else if (firstChar === 'X' || notation.toLowerCase().includes('exo')) {
    state.direction = 'exo';
  }
  
  // Check for eye
  if (notation.includes('alt')) {
    state.eye = 'alt';
  } else if (notation.includes('OD')) {
    state.eye = 'OD';
  } else if (notation.includes('OS')) {
    state.eye = 'OS';
  }
  
  // Check for type - T or (T) = tropia, otherwise check for phoria indicators
  if (notation.includes('(T)')) {
    state.type = 'tropie';
    state.frequency = 'intermittent';
  } else if (notation.includes('T') || notation.toLowerCase().includes('tropie')) {
    state.type = 'tropie';
    state.frequency = 'constant';
  } else if (notation.includes('bc') || notation.includes('mc') || notation.includes('mal') || notation.toLowerCase().includes('phorie')) {
    // Has compensation or explicitly says phorie = phoria
    state.type = 'phorie';
  } else if (state.direction && notation.length <= 6) {
    // Short notation with just direction (+ maybe eye) = phoria
    // e.g., "E", "X", "H OD", "h OS"
    state.type = 'phorie';
  }
  
  // Check for compensation (only relevant for phorias)
  if (notation.includes('bc') || notation.toLowerCase().includes('bien')) state.compensation = 'bc';
  else if (notation.includes('malc') || notation.includes('mal c') || notation.toLowerCase().includes('mal')) state.compensation = 'malc';
  else if (notation.includes('mc') || notation.toLowerCase().includes('moyen')) state.compensation = 'mc';
  
  return state;
}

// Build notation string from state
function buildNotation(state: DeviationState): string {
  if (state.direction === 'ortho' || !state.direction) return state.direction === 'ortho' ? 'Ortho' : '';
  
  const isVertical = state.direction === 'hyper' || state.direction === 'hypo';
  
  // Direction prefix: H = hyper (uppercase), h = hypo (lowercase)
  const dirPrefix: Record<Direction, string> = {
    ortho: 'Ortho',
    eso: 'E',
    exo: 'X',
    hyper: 'H',
    hypo: 'h',
  };
  let notation = dirPrefix[state.direction];
  
  // Type suffix - Phoria = just letter, Tropia = letter + T
  if (state.type === 'tropie') {
    if (state.frequency === 'intermittent') {
      notation += '(T)';
    } else {
      notation += 'T';
    }
  }
  // Phoria = no suffix, just the direction letter
  
  // Add eye for vertical deviations
  if (isVertical && state.eye) {
    notation += ' ' + state.eye;
  }
  
  // Add eye for horizontal tropies
  if (!isVertical && state.type === 'tropie' && state.eye) {
    notation += ' ' + state.eye;
  }
  
  // Add compensation for phorias
  if (state.type === 'phorie' && state.compensation) {
    const compLabels: Record<Compensation, string> = {
      bc: ' bc',
      mc: ' mc',
      malc: ' mal c',
    };
    notation += compLabels[state.compensation];
  }
  
  return notation;
}

// Structured Cover Test Builder Component
function CoverTestBuilder({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (v: string) => void;
}) {
  const [state, setState] = useState<DeviationState>(() => parseNotation(value));
  
  useEffect(() => {
    const parsed = parseNotation(value);
    setState(parsed);
  }, [value]);
  
  const updateState = (updates: Partial<DeviationState>) => {
    const newState = { ...state, ...updates };
    
    // Clear downstream fields when direction changes
    if (updates.direction !== undefined) {
      if (updates.direction === 'ortho') {
        newState.type = null;
        newState.eye = null;
        newState.frequency = null;
        newState.compensation = null;
      } else if (updates.direction !== state.direction) {
        // Switching direction: clear type-related stuff but keep eye for vertical
        const wasVertical = state.direction === 'hyper' || state.direction === 'hypo';
        const isVertical = updates.direction === 'hyper' || updates.direction === 'hypo';
        
        // If switching from vertical to horizontal, clear eye
        if (wasVertical && !isVertical) {
          newState.eye = null;
        }
        // If switching from horizontal to vertical, eye will be set by user
        // If switching between hyper/hypo, keep the eye (same context)
      }
    }
    
    // Clear irrelevant fields based on type
    if (updates.type === 'phorie') {
      newState.frequency = null;
      // For horizontal phorias, eye is not relevant
      const dir = newState.direction;
      if (dir !== 'hyper' && dir !== 'hypo') {
        newState.eye = null;
      }
    } else if (updates.type === 'tropie') {
      newState.compensation = null;
      if (!newState.frequency) newState.frequency = 'constant';
    }
    
    setState(newState);
    onChange(buildNotation(newState));
  };
  
  const toggleDirection = (dir: Direction) => {
    if (state.direction === dir) {
      updateState({ direction: null, type: null, eye: null, frequency: null, compensation: null });
    } else {
      updateState({ direction: dir });
    }
  };
  
  const isVertical = state.direction === 'hyper' || state.direction === 'hypo';
  const showType = state.direction && state.direction !== 'ortho';
  const showEye = showType && (isVertical || state.type === 'tropie');
  const showFrequency = state.type === 'tropie';
  const showCompensation = state.type === 'phorie';
  
  return (
    <div className="space-y-2">
      {/* Direction Row */}
      <div className="flex flex-wrap gap-1">
        {(['ortho', 'eso', 'exo', 'hyper', 'hypo'] as Direction[]).map((dir) => (
          <QuickSelectButton
            key={dir}
            size="xs"
            label={{ ortho: 'Ortho', eso: 'Éso', exo: 'Exo', hyper: 'Hyper', hypo: 'Hypo' }[dir]}
            selected={state.direction === dir}
            onClick={() => toggleDirection(dir)}
            selectedClassName={dir === 'ortho' ? 'bg-emerald-600 text-white border-emerald-600' : undefined}
          />
        ))}
      </div>
      
      {/* Type Row (Phorie/Tropie) */}
      {showType && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-muted-foreground">Type:</span>
          <QuickSelectButton
            size="xs"
            label="Phorie"
            selected={state.type === 'phorie'}
            onClick={() => updateState({ type: state.type === 'phorie' ? null : 'phorie' })}
          />
          <QuickSelectButton
            size="xs"
            label="Tropie"
            selected={state.type === 'tropie'}
            onClick={() => updateState({ type: state.type === 'tropie' ? null : 'tropie' })}
          />
        </div>
      )}
      
      {/* Eye Row (for vertical or tropies) */}
      {showEye && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-muted-foreground">
            {state.direction === 'hyper' ? 'Œil haut:' : state.direction === 'hypo' ? 'Œil bas:' : 'Œil:'}
          </span>
          <QuickSelectButton
            size="xs"
            label="OD"
            selected={state.eye === 'OD'}
            onClick={() => updateState({ eye: state.eye === 'OD' ? null : 'OD' })}
          />
          <QuickSelectButton
            size="xs"
            label="OS"
            selected={state.eye === 'OS'}
            onClick={() => updateState({ eye: state.eye === 'OS' ? null : 'OS' })}
          />
          {state.type === 'tropie' && (
            <QuickSelectButton
              size="xs"
              label="Alt"
              selected={state.eye === 'alt'}
              onClick={() => updateState({ eye: state.eye === 'alt' ? null : 'alt' })}
            />
          )}
        </div>
      )}
      
      {/* Frequency Row (for tropies) */}
      {showFrequency && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-muted-foreground">Fréquence:</span>
          <QuickSelectButton
            size="xs"
            label="Constant"
            selected={state.frequency === 'constant'}
            onClick={() => updateState({ frequency: 'constant' })}
          />
          <QuickSelectButton
            size="xs"
            label="Intermittent"
            selected={state.frequency === 'intermittent'}
            onClick={() => updateState({ frequency: 'intermittent' })}
          />
        </div>
      )}
      
      {/* Compensation Row (for phorias) */}
      {showCompensation && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-muted-foreground">Compensation:</span>
          <QuickSelectButton
            size="xs"
            label="Bonne"
            selected={state.compensation === 'bc'}
            onClick={() => updateState({ compensation: state.compensation === 'bc' ? null : 'bc' })}
          />
          <QuickSelectButton
            size="xs"
            label="Moyenne"
            selected={state.compensation === 'mc'}
            onClick={() => updateState({ compensation: state.compensation === 'mc' ? null : 'mc' })}
          />
          <QuickSelectButton
            size="xs"
            label="Mauvaise"
            selected={state.compensation === 'malc'}
            onClick={() => updateState({ compensation: state.compensation === 'malc' ? null : 'malc' })}
          />
        </div>
      )}
      
      {/* Result display */}
      {state.direction && state.direction !== 'ortho' && (
        <div className="text-xs font-mono bg-muted/50 px-2 py-1 rounded border border-border">
          {buildNotation(state) || '—'}
        </div>
      )}
    </div>
  );
}

export function BinocularVisionSection({ binocularVision, onChange }: BinocularVisionSectionProps) {
  const handleSelect = (field: keyof BinocularVision, value: string) => {
    const current = binocularVision[field];
    onChange({ [field]: current === value ? '' : value });
  };

  // Check if value is one of the predefined options
  const isOption = (value: string, options: { id: string }[]) => 
    options.some(o => o.id === value);

  const renderCoverTestCell = (field: 'coverTestVL' | 'coverTestVP') => {
    return (
      <CoverTestBuilder
        value={binocularVision[field]}
        onChange={(v) => onChange({ [field]: v })}
      />
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
      <SectionHeader title="Vision Binoculaire" />

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
