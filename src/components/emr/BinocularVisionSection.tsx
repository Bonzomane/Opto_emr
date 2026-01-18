import { BinocularVision } from '@/types/emr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';
import { useState, useEffect } from 'react';

interface BinocularVisionSectionProps {
  binocularVision: BinocularVision;
  onChange: (updates: Partial<BinocularVision>) => void;
}

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
type Compensation = 'bc' | 'mbc' | 'mlc';

interface DeviationState {
  direction: Direction | null;
  type: DeviationType | null;
  eye: Eye | null;
  frequency: Frequency | null;
  compensation: Compensation | null;
  quantity: string | null;
}

type MaddoxDirection = 'eso' | 'exo' | 'hyper' | 'hypo';

interface MaddoxState {
  direction: MaddoxDirection | null;
  eye: Eye | null;
  quantity: string | null;
}

// Parse notation string back to state
function parseNotation(notation: string): DeviationState {
  if (!notation || notation === 'Ortho') {
    return { direction: notation === 'Ortho' ? 'ortho' : null, type: null, eye: null, frequency: null, compensation: null, quantity: null };
  }
  
  const state: DeviationState = { direction: null, type: null, eye: null, frequency: null, compensation: null, quantity: null };
  
  // Extract quantity (leading number)
  const quantityMatch = notation.match(/^(\d+)/);
  if (quantityMatch) {
    state.quantity = quantityMatch[1];
  }
  
  // Check for direction - h = hypo (lowercase), H = hyper (uppercase)
  // Skip leading digits to find direction letter
  const dirMatch = notation.match(/\d*([hHEX])/);
  const dirChar = dirMatch ? dirMatch[1] : '';
  if (dirChar === 'h' || notation.toLowerCase().includes('hypo')) {
    state.direction = 'hypo';
  } else if (dirChar === 'H' || notation.toLowerCase().includes('hyper')) {
    state.direction = 'hyper';
  } else if (dirChar === 'E' || notation.toLowerCase().includes('eso') || notation.toLowerCase().includes('éso')) {
    state.direction = 'eso';
  } else if (dirChar === 'X' || notation.toLowerCase().includes('exo')) {
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
  } else if (notation.includes('bc') || notation.includes('mbc') || notation.includes('mlc') || notation.toLowerCase().includes('phorie')) {
    // Has compensation or explicitly says phorie = phoria
    state.type = 'phorie';
  } else if (state.direction && notation.length <= 6) {
    // Short notation with just direction (+ maybe eye) = phoria
    // e.g., "E", "X", "H OD", "h OS"
    state.type = 'phorie';
  }
  
  // Check for compensation (only relevant for phorias)
  // Order matters: check mbc before bc (since bc is substring of mbc)
  if (notation.includes('mbc') || notation.toLowerCase().includes('moyennement')) state.compensation = 'mbc';
  else if (notation.includes('mlc') || notation.toLowerCase().includes('mal')) state.compensation = 'mlc';
  else if (notation.includes('bc') || notation.toLowerCase().includes('bien')) state.compensation = 'bc';
  
  return state;
}

// Build notation string from state
function buildNotation(state: DeviationState): string {
  if (state.direction === 'ortho' || !state.direction) return state.direction === 'ortho' ? 'Ortho' : '';
  
  const isVertical = state.direction === 'hyper' || state.direction === 'hypo';
  
  // Start with quantity if present
  let notation = state.quantity !== null ? state.quantity : '';
  
  // Direction prefix: H = hyper (uppercase), h = hypo (lowercase)
  const dirPrefix: Record<Direction, string> = {
    ortho: 'Ortho',
    eso: 'E',
    exo: 'X',
    hyper: 'H',
    hypo: 'h',
  };
  notation += dirPrefix[state.direction];
  
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
      mbc: ' mbc',
      mlc: ' mlc',
    };
    notation += compLabels[state.compensation];
  }
  
  return notation;
}

// Parse Maddox notation string back to state
function parseMaddoxNotation(notation: string): MaddoxState {
  if (!notation) {
    return { direction: null, eye: null, quantity: null };
  }

  const state: MaddoxState = { direction: null, eye: null, quantity: null };

  // Extract quantity (leading number)
  const quantityMatch = notation.match(/^(\d+)/);
  if (quantityMatch) {
    state.quantity = quantityMatch[1];
  }

  // Direction: E/X/H/h + dev
  const dirMatch = notation.match(/\d*([hHEX])dev/i);
  const dirChar = dirMatch ? dirMatch[1] : '';
  if (dirChar === 'h') {
    state.direction = 'hypo';
  } else if (dirChar === 'H') {
    state.direction = 'hyper';
  } else if (dirChar === 'E') {
    state.direction = 'eso';
  } else if (dirChar === 'X') {
    state.direction = 'exo';
  }

  // Eye for vertical deviations
  if (notation.includes('OD')) {
    state.eye = 'OD';
  } else if (notation.includes('OS')) {
    state.eye = 'OS';
  }

  return state;
}

// Build Maddox notation string from state
function buildMaddoxNotation(state: MaddoxState): string {
  if (!state.direction) return '';

  const isVertical = state.direction === 'hyper' || state.direction === 'hypo';
  const dirPrefix: Record<MaddoxDirection, string> = {
    eso: 'E',
    exo: 'X',
    hyper: 'H',
    hypo: 'h',
  };

  let notation = state.quantity !== null ? state.quantity : '';
  notation += `${dirPrefix[state.direction]}dev`;

  if (isVertical && state.eye) {
    notation += ` ${state.eye}`;
  }

  return notation;
}

function MaddoxBuilder({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [state, setState] = useState<MaddoxState>(() => parseMaddoxNotation(value));

  useEffect(() => {
    const parsed = parseMaddoxNotation(value);
    setState(parsed);
  }, [value]);

  const updateState = (updates: Partial<MaddoxState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    onChange(buildMaddoxNotation(newState));
  };

  const toggleDirection = (dir: MaddoxDirection) => {
    if (state.direction === dir) {
      updateState({ direction: null, eye: null, quantity: null });
    } else {
      updateState({ direction: dir });
    }
  };

  const toggleQuantity = (num: number) => {
    const digit = String(num);
    const current = state.quantity ?? '';
    if (current.length >= 2) return;
    if (!current || current === '0') {
      updateState({ quantity: digit });
      return;
    }
    updateState({ quantity: `${current}${digit}` });
  };

  const backspaceQuantity = () => {
    const current = state.quantity ?? '';
    if (!current) return;
    const next = current.slice(0, -1);
    updateState({ quantity: next ? next : null });
  };

  const clearQuantity = () => {
    updateState({ quantity: null });
  };

  const isVertical = state.direction === 'hyper' || state.direction === 'hypo';

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {(['eso', 'exo', 'hyper', 'hypo'] as MaddoxDirection[]).map((dir) => (
          <QuickSelectButton
            key={dir}
            size="xs"
            label={{ eso: 'Éso', exo: 'Exo', hyper: 'Hyper', hypo: 'Hypo' }[dir]}
            selected={state.direction === dir}
            onClick={() => toggleDirection(dir)}
          />
        ))}
      </div>

      {state.direction && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Δ:</span>
          <div className="grid grid-cols-[repeat(3,1.25rem)] gap-px">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => toggleQuantity(num)}
                className="w-5 h-5 text-[10px] font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
              >
                {num}
              </button>
            ))}
          </div>
          <div className="grid grid-rows-3 gap-px">
            <button
              type="button"
              onClick={backspaceQuantity}
              className="w-5 h-5 text-[10px] font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
              aria-label="Retour"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => toggleQuantity(0)}
              className="w-5 h-5 text-[10px] font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            >
              0
            </button>
            <button
              type="button"
              onClick={clearQuantity}
              className="w-5 h-5 text-[10px] font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            >
              C
            </button>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 min-w-[16px]">
            {state.quantity ?? ''}
          </div>
        </div>
      )}

      {isVertical && state.direction && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-muted-foreground">
            {state.direction === 'hyper' ? 'Œil haut:' : 'Œil bas:'}
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
        </div>
      )}

      {state.direction && (
        <div className="text-xs font-mono bg-muted/50 px-2 py-1 rounded border border-border">
          {buildMaddoxNotation(state) || '—'}
        </div>
      )}
    </div>
  );
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
        newState.quantity = null;
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
      updateState({ direction: null, type: null, eye: null, frequency: null, compensation: null, quantity: null });
    } else {
      updateState({ direction: dir });
    }
  };
  
  const toggleQuantity = (num: number) => {
    const digit = String(num);
    const current = state.quantity ?? '';
    if (current.length >= 2) return;
    if (!current || current === '0') {
      updateState({ quantity: digit });
      return;
    }
    updateState({ quantity: `${current}${digit}` });
  };

  const backspaceQuantity = () => {
    const current = state.quantity ?? '';
    if (!current) return;
    const next = current.slice(0, -1);
    updateState({ quantity: next ? next : null });
  };

  const clearQuantity = () => {
    updateState({ quantity: null });
  };
  
  const isVertical = state.direction === 'hyper' || state.direction === 'hypo';
  const showQuantity = state.direction && state.direction !== 'ortho';
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
      
      {/* Quantity Numpad */}
      {showQuantity && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Δ:</span>
          <div className="grid grid-cols-[repeat(3,1.25rem)] gap-px">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => toggleQuantity(num)}
                className="w-5 h-5 text-[10px] font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
              >
                {num}
              </button>
            ))}
          </div>
          <div className="grid grid-rows-3 gap-px">
            <button
              type="button"
              onClick={backspaceQuantity}
              className="w-5 h-5 text-[10px] font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
              aria-label="Retour"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => toggleQuantity(0)}
              className="w-5 h-5 text-[10px] font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            >
              0
            </button>
            <button
              type="button"
              onClick={clearQuantity}
              className="w-5 h-5 text-[10px] font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            >
              C
            </button>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 min-w-[16px]">
            {state.quantity ?? ''}
          </div>
        </div>
      )}
      
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
            label="Bien"
            selected={state.compensation === 'bc'}
            onClick={() => updateState({ compensation: state.compensation === 'bc' ? null : 'bc' })}
          />
          <QuickSelectButton
            size="xs"
            label="Moy. Bien"
            selected={state.compensation === 'mbc'}
            onClick={() => updateState({ compensation: state.compensation === 'mbc' ? null : 'mbc' })}
          />
          <QuickSelectButton
            size="xs"
            label="Mal"
            selected={state.compensation === 'mlc'}
            onClick={() => updateState({ compensation: state.compensation === 'mlc' ? null : 'mlc' })}
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
  const tables = binocularVision.tables?.length
    ? binocularVision.tables
    : [
        {
          rxStatus: '',
          coverTestVL: '',
          coverTestVP: '',
          maddoxVL: '',
          maddoxVP: '',
          filtreRougeVL: '',
          filtreRougeVP: '',
          reservesBIVL: '',
          reservesBOVL: '',
          reservesBIVP: '',
          reservesBOVP: '',
          ppc: '',
          ppcRecovery: '',
          ppcTarget: '',
        },
      ];

  const updateTable = (index: number, updates: Partial<typeof tables[number]>) => {
    const nextTables = tables.map((table, idx) =>
      idx === index ? { ...table, ...updates } : table
    );
    onChange({ tables: nextTables });
  };

  const addTable = () => {
    const nextTables = [
      ...tables,
      {
        rxStatus: '',
        coverTestVL: '',
        coverTestVP: '',
        maddoxVL: '',
        maddoxVP: '',
        filtreRougeVL: '',
        filtreRougeVP: '',
        reservesBIVL: '',
        reservesBOVL: '',
        reservesBIVP: '',
        reservesBOVP: '',
        ppc: '',
        ppcRecovery: '',
        ppcTarget: '',
      },
    ];
    onChange({ tables: nextTables });
  };

  const renderCoverTestCell = (
    tableIndex: number,
    field: 'coverTestVL' | 'coverTestVP'
  ) => {
    return (
      <CoverTestBuilder
        value={tables[tableIndex][field]}
        onChange={(v) => updateTable(tableIndex, { [field]: v })}
      />
    );
  };

  const renderMaddoxCell = (tableIndex: number, field: 'maddoxVL' | 'maddoxVP') => {
    return (
      <MaddoxBuilder
        value={tables[tableIndex][field]}
        onChange={(v) => updateTable(tableIndex, { [field]: v })}
      />
    );
  };

  const renderFiltreRougeCell = (
    tableIndex: number,
    field: 'filtreRougeVL' | 'filtreRougeVP'
  ) => {
    const value = tables[tableIndex][field];
    
    return (
      <div className="flex flex-wrap gap-1">
        <QuickSelectButton
          size="xs"
          label="Fusion"
          selected={value === 'Fusion'}
          onClick={() => updateTable(tableIndex, { [field]: value === 'Fusion' ? '' : 'Fusion' })}
          selectedClassName="bg-zinc-900 text-white border-zinc-900"
        />
        <DropdownButton label="+" selectedLabel={FILTRE_ROUGE_OPTIONS.filter(o => o.id !== 'Fusion').find(o => o.id === value)?.label}>
          {FILTRE_ROUGE_OPTIONS.filter(o => o.id !== 'Fusion').map((opt) => (
            <DropdownOption
              key={opt.id}
              label={opt.label}
              selected={value === opt.id}
              onSelect={() => updateTable(tableIndex, { [field]: opt.id })}
              onDeselect={() => updateTable(tableIndex, { [field]: '' })}
            />
          ))}
        </DropdownButton>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Vision Binoculaire" />

      {tables.map((table, index) => {
        const rxLabel =
          table.rxStatus === 'avec'
            ? ' (avec Rx)'
            : table.rxStatus === 'sans'
            ? ' (sans Rx)'
            : '';

        return (
          <div key={`bino-table-${index}`} className="space-y-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-3 py-2 font-medium w-32">Test</th>
                    <th className="text-left px-3 py-2 font-medium">VL</th>
                    <th className="text-left px-3 py-2 font-medium">VP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2 font-medium text-xs align-top">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span>Test Écran{rxLabel}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <QuickSelectButton
                            size="xs"
                            label="Avec Rx"
                            selected={table.rxStatus === 'avec'}
                            onClick={() =>
                              updateTable(index, {
                                rxStatus: table.rxStatus === 'avec' ? '' : 'avec',
                              })
                            }
                          />
                          <QuickSelectButton
                            size="xs"
                            label="Sans Rx"
                            selected={table.rxStatus === 'sans'}
                            onClick={() =>
                              updateTable(index, {
                                rxStatus: table.rxStatus === 'sans' ? '' : 'sans',
                              })
                            }
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">{renderCoverTestCell(index, 'coverTestVL')}</td>
                    <td className="px-3 py-2">{renderCoverTestCell(index, 'coverTestVP')}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2 font-medium text-xs align-top">TM</td>
                    <td className="px-3 py-2">{renderMaddoxCell(index, 'maddoxVL')}</td>
                    <td className="px-3 py-2">{renderMaddoxCell(index, 'maddoxVP')}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2 font-medium text-xs align-top">FR</td>
                    <td className="px-3 py-2">{renderFiltreRougeCell(index, 'filtreRougeVL')}</td>
                    <td className="px-3 py-2">{renderFiltreRougeCell(index, 'filtreRougeVP')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">PPC (Bris / Recouvrement)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={table.ppc}
                  onChange={(e) => updateTable(index, { ppc: e.target.value })}
                  placeholder="Bris: ex. 8cm"
                  className="text-xs"
                />
                <Input
                  value={table.ppcRecovery || ''}
                  onChange={(e) => updateTable(index, { ppcRecovery: e.target.value })}
                  placeholder="Recouv: ex. 12cm"
                  className="text-xs"
                />
                <Input
                  value={table.ppcTarget || ''}
                  onChange={(e) => updateTable(index, { ppcTarget: e.target.value })}
                  placeholder="Cible: stylo, lumière"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Réserves Fusionnelles</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">VL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={table.reservesBIVL}
                      onChange={(e) => updateTable(index, { reservesBIVL: e.target.value })}
                      placeholder="BI: x/x/x"
                      className="text-xs"
                    />
                    <Input
                      value={table.reservesBOVL}
                      onChange={(e) => updateTable(index, { reservesBOVL: e.target.value })}
                      placeholder="BO: x/x/x"
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">VP</Label>
                  <div className="flex gap-2">
                    <Input
                      value={table.reservesBIVP}
                      onChange={(e) => updateTable(index, { reservesBIVP: e.target.value })}
                      placeholder="BI: x/x/x"
                      className="text-xs"
                    />
                    <Input
                      value={table.reservesBOVP}
                      onChange={(e) => updateTable(index, { reservesBOVP: e.target.value })}
                      placeholder="BO: x/x/x"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {index === tables.length - 1 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addTable}
                  className="h-7 w-7 rounded-md border border-border bg-white text-sm font-semibold text-muted-foreground hover:bg-muted"
                  aria-label="Ajouter une table de tests"
                >
                  +
                </button>
              </div>
            )}
          </div>
        );
      })}

      <CollapsibleNotes
        id="binocular-vision-notes"
        value={binocularVision.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes vision binoculaire..."
      />
    </div>
  );
}
