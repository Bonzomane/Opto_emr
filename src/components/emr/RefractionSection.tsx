import { RefractionData, CYCLO_AGENTS } from '@/types/emr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RefractionSectionProps {
  refraction: RefractionData;
  onChange: (updates: Partial<RefractionData>) => void;
}

// VA options in metric 6/ format
const VA_OPTIONS = [
  { id: '6/6', label: '6/6' },
  { id: '6/7.5', label: '6/7.5' },
  { id: '6/9', label: '6/9' },
  { id: '6/12', label: '6/12' },
  { id: '6/15', label: '6/15' },
  { id: '6/18', label: '6/18' },
  { id: '6/21', label: '6/21' },
  { id: '6/24', label: '6/24' },
  { id: '6/30', label: '6/30' },
  { id: '6/60', label: '6/60' },
];

const VA_COMMON = ['6/6', '6/7.5', '6/9', '6/12'];

type RxField = 'sphere' | 'cylinder' | 'axis' | 'add';

// Simple numpad component that appears under a field
function NumpadPopup({
  value,
  onChange,
  fieldType,
  sign,
  onSignToggle,
}: {
  value: string;
  onChange: (v: string) => void;
  fieldType: 'power' | 'axis';
  sign?: '+' | '-';
  onSignToggle?: () => void;
}) {
  const appendDigit = (digit: string) => {
    const current = value.replace(/[^0-9.]/g, '');
    // For axis, max 3 digits
    if (fieldType === 'axis' && current.replace('.', '').length >= 3) return;
    // For power, max length with decimal
    if (fieldType === 'power' && current.length >= 5) return;
    
    const newValue = current + digit;
    if (fieldType === 'power' && sign) {
      onChange(sign + newValue);
    } else {
      onChange(newValue);
    }
  };

  const appendDecimal = (decimal: string) => {
    // Append .25, .50, or .75 to current integer part
    const current = value.replace(/[^0-9]/g, '');
    const intPart = current || '0';
    const newValue = intPart + decimal;
    if (fieldType === 'power' && sign) {
      onChange(sign + newValue);
    } else {
      onChange(newValue);
    }
  };

  const backspace = () => {
    const current = value.replace(/[^0-9.]/g, '');
    const newValue = current.slice(0, -1);
    if (fieldType === 'power' && sign && newValue) {
      onChange(sign + newValue);
    } else {
      onChange(newValue);
    }
  };

  const clear = () => {
    onChange('');
  };

  // Button style for consistency
  const btnClass = "w-8 h-8 text-sm font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 flex items-center justify-center";
  const btnSmClass = "w-10 h-8 text-xs font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 flex items-center justify-center";

  return (
    <div 
      className="absolute left-0 top-full z-50 p-3 -m-3 mt-0"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Visible numpad */}
      <div 
        className="rounded-md border border-border bg-white p-2"
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      >
        {/* Grid layout */}
        <div className="flex gap-1">
          {/* Numbers 1-9 and 0 */}
          <div className="flex flex-col gap-px">
            <div className="flex gap-px">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('1'); }} className={btnClass}>1</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('2'); }} className={btnClass}>2</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('3'); }} className={btnClass}>3</button>
            </div>
            <div className="flex gap-px">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('4'); }} className={btnClass}>4</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('5'); }} className={btnClass}>5</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('6'); }} className={btnClass}>6</button>
            </div>
            <div className="flex gap-px">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('7'); }} className={btnClass}>7</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('8'); }} className={btnClass}>8</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('9'); }} className={btnClass}>9</button>
            </div>
            <div className="flex gap-px justify-center">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDigit('0'); }} className={btnClass}>0</button>
            </div>
          </div>

          {/* Decimal column for power fields */}
          {fieldType === 'power' && (
            <div className="flex flex-col gap-px">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDecimal('.25'); }} className={btnSmClass}>.25</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDecimal('.50'); }} className={btnSmClass}>.50</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDecimal('.75'); }} className={btnSmClass}>.75</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); appendDecimal('.00'); }} className={btnSmClass}>.00</button>
            </div>
          )}

          {/* Sign toggle + backspace/clear for power fields */}
          {fieldType === 'power' && onSignToggle && (
            <div className="flex flex-col gap-px">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onSignToggle(); }}
                className={cn(
                  "w-8 h-8 text-sm font-bold rounded border flex items-center justify-center",
                  sign === '-' ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                )}
              >
                −
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onSignToggle(); }}
                className={cn(
                  "w-8 h-8 text-sm font-bold rounded border flex items-center justify-center",
                  sign === '+' ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                )}
              >
                +
              </button>
              {/* Backspace - orange */}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); backspace(); }}
                className="w-8 h-8 text-sm font-bold rounded border flex items-center justify-center bg-amber-500 text-white border-amber-600 hover:bg-amber-600 active:bg-amber-700"
              >
                &lt;
              </button>
              {/* Clear - red */}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); clear(); }}
                className="w-8 h-8 text-sm font-bold rounded border flex items-center justify-center bg-red-500 text-white border-red-600 hover:bg-red-600 active:bg-red-700"
              >
                C
              </button>
            </div>
          )}

          {/* For axis fields (no sign toggle), show backspace/clear in their own column */}
          {fieldType === 'axis' && (
            <div className="flex flex-col gap-px">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); backspace(); }}
                className="w-8 h-8 text-sm font-bold rounded border flex items-center justify-center bg-amber-500 text-white border-amber-600 hover:bg-amber-600 active:bg-amber-700"
              >
                &lt;
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); clear(); }}
                className="w-8 h-8 text-sm font-bold rounded border flex items-center justify-center bg-red-500 text-white border-red-600 hover:bg-red-600 active:bg-red-700"
              >
                C
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Single field with hover-triggered numpad
function RxField({
  label,
  value,
  onChange,
  fieldType,
  sign,
  onSignToggle,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  fieldType: 'power' | 'axis';
  sign?: '+' | '-';
  onSignToggle?: () => void;
  placeholder: string;
}) {
  const [showNumpad, setShowNumpad] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleMouseEnter = () => {
    if (!isLocked) setShowNumpad(true);
  };

  const handleMouseLeave = () => {
    if (!isLocked) setShowNumpad(false);
  };

  const handleClick = () => {
    if (isLocked) {
      setIsLocked(false);
      setShowNumpad(false);
    } else {
      setIsLocked(true);
      setShowNumpad(true);
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground w-8">{label}</span>
        {fieldType === 'power' && sign && (
          <button
            type="button"
            onClick={onSignToggle}
            className="h-8 w-7 rounded border border-border bg-white text-sm font-mono hover:bg-muted"
          >
            {sign}
          </button>
        )}
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            'h-8 min-w-[70px] rounded border px-2 text-sm font-mono text-left',
            showNumpad ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border bg-background'
          )}
        >
          {value || placeholder}
          {isLocked && <span className="ml-1 text-primary">🔒</span>}
        </button>
      </div>

      {showNumpad && (
        <NumpadPopup
          value={value}
          onChange={onChange}
          fieldType={fieldType}
          sign={sign}
          onSignToggle={onSignToggle}
        />
      )}
    </div>
  );
}

// Full Rx input for one eye
function RxPicker({
  label,
  sphere,
  cylinder,
  axis,
  add,
  onSphereChange,
  onCylinderChange,
  onAxisChange,
  onAddChange,
}: {
  label: string;
  sphere: string;
  cylinder: string;
  axis: string;
  add: string;
  onSphereChange: (v: string) => void;
  onCylinderChange: (v: string) => void;
  onAxisChange: (v: string) => void;
  onAddChange: (v: string) => void;
}) {
  const [sphSign, setSphSign] = useState<'+' | '-'>(() => sphere.includes('+') ? '+' : '-');
  const [cylSign, setCylSign] = useState<'+' | '-'>(() => cylinder.includes('+') ? '+' : '-');
  const [addSign, setAddSign] = useState<'+' | '-'>(() => add.includes('-') ? '-' : '+');

  const handleSphereChange = (v: string) => {
    onSphereChange(v);
  };

  const handleCylinderChange = (v: string) => {
    onCylinderChange(v);
  };

  const handleAxisChange = (v: string) => {
    // Clamp axis to 0-180
    const num = parseInt(v.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > 180) {
      onAxisChange('180');
    } else {
      onAxisChange(v);
    }
  };

  const handleAddChange = (v: string) => {
    onAddChange(v);
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-bold">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <RxField
          label="Sph"
          value={sphere}
          onChange={handleSphereChange}
          fieldType="power"
          sign={sphSign}
          onSignToggle={() => {
            const newSign = sphSign === '-' ? '+' : '-';
            setSphSign(newSign);
            if (sphere) {
              const digits = sphere.replace(/[^0-9.]/g, '');
              onSphereChange(newSign + digits);
            }
          }}
          placeholder="0.00"
        />
        <RxField
          label="Cyl"
          value={cylinder}
          onChange={handleCylinderChange}
          fieldType="power"
          sign={cylSign}
          onSignToggle={() => {
            const newSign = cylSign === '-' ? '+' : '-';
            setCylSign(newSign);
            if (cylinder) {
              const digits = cylinder.replace(/[^0-9.]/g, '');
              onCylinderChange(newSign + digits);
            }
          }}
          placeholder="0.00"
        />
        <RxField
          label="Axe"
          value={axis}
          onChange={handleAxisChange}
          fieldType="axis"
          placeholder="180"
        />
        <RxField
          label="Add"
          value={add}
          onChange={handleAddChange}
          fieldType="power"
          sign={addSign}
          onSignToggle={() => {
            const newSign = addSign === '-' ? '+' : '-';
            setAddSign(newSign);
            if (add) {
              const digits = add.replace(/[^0-9.]/g, '');
              onAddChange(newSign + digits);
            }
          }}
          placeholder="0.00"
        />
      </div>
    </div>
  );
}

// Parse Rx string like "-1.25 / -0.50 x 180" into parts
function parseRx(rx: string): { sphere: string; cylinder: string; axis: string } {
  const parts = rx.split(/[\/x]/).map(p => p.trim());
  return {
    sphere: parts[0] || '',
    cylinder: parts[1] || '',
    axis: parts[2] || '',
  };
}

// Combine parts back into formatted Rx string
function combineRx(sphere: string, cylinder: string, axis: string): string {
  let result = sphere;
  if (cylinder) {
    result += ` / ${cylinder}`;
    if (axis) {
      result += ` x ${axis}`;
    }
  }
  return result;
}

export function RefractionSection({ refraction, onChange }: RefractionSectionProps) {
  const handleVASelect = (field: keyof RefractionData, value: string) => {
    const current = refraction[field];
    onChange({ [field]: current === value ? '' : value });
  };

  // Parse current values
  const odParsed = parseRx(refraction.rxOD);
  const osParsed = parseRx(refraction.rxOS);

  return (
    <div className="space-y-6">
      <SectionHeader title="Réfraction" />

      {/* Rx Finale */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Rx Subjective Finale</Label>
        <div className="space-y-4">
          <RxPicker
            label="OD"
            sphere={odParsed.sphere}
            cylinder={odParsed.cylinder}
            axis={odParsed.axis}
            add={refraction.addOD}
            onSphereChange={(v) => onChange({ rxOD: combineRx(v, odParsed.cylinder, odParsed.axis) })}
            onCylinderChange={(v) => onChange({ rxOD: combineRx(odParsed.sphere, v, odParsed.axis) })}
            onAxisChange={(v) => onChange({ rxOD: combineRx(odParsed.sphere, odParsed.cylinder, v) })}
            onAddChange={(v) => onChange({ addOD: v })}
          />
          <RxPicker
            label="OS"
            sphere={osParsed.sphere}
            cylinder={osParsed.cylinder}
            axis={osParsed.axis}
            add={refraction.addOS}
            onSphereChange={(v) => onChange({ rxOS: combineRx(v, osParsed.cylinder, osParsed.axis) })}
            onCylinderChange={(v) => onChange({ rxOS: combineRx(osParsed.sphere, v, osParsed.axis) })}
            onAxisChange={(v) => onChange({ rxOS: combineRx(osParsed.sphere, osParsed.cylinder, v) })}
            onAddChange={(v) => onChange({ addOS: v })}
          />
        </div>
      </div>

      {/* AV avec Rx finale */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">AV avec Rx Finale</Label>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">OD</span>
            <div className="flex flex-wrap gap-1">
              {VA_COMMON.map((v) => (
                <QuickSelectButton
                  key={v}
                  label={v}
                  selected={refraction.avOD === v}
                  onClick={() => handleVASelect('avOD', v)}
                />
              ))}
              <DropdownButton
                label="+"
                selectedLabel={VA_OPTIONS.find((o) => o.id === refraction.avOD && !VA_COMMON.includes(o.id))?.label}
              >
                {VA_OPTIONS.filter((o) => !VA_COMMON.includes(o.id)).map((opt) => (
                  <DropdownOption
                    key={opt.id}
                    label={opt.label}
                    selected={refraction.avOD === opt.id}
                    onSelect={() => onChange({ avOD: opt.id })}
                    onDeselect={() => onChange({ avOD: '' })}
                  />
                ))}
              </DropdownButton>
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">OS</span>
            <div className="flex flex-wrap gap-1">
              {VA_COMMON.map((v) => (
                <QuickSelectButton
                  key={v}
                  label={v}
                  selected={refraction.avOS === v}
                  onClick={() => handleVASelect('avOS', v)}
                />
              ))}
              <DropdownButton
                label="+"
                selectedLabel={VA_OPTIONS.find((o) => o.id === refraction.avOS && !VA_COMMON.includes(o.id))?.label}
              >
                {VA_OPTIONS.filter((o) => !VA_COMMON.includes(o.id)).map((opt) => (
                  <DropdownOption
                    key={opt.id}
                    label={opt.label}
                    selected={refraction.avOS === opt.id}
                    onSelect={() => onChange({ avOS: opt.id })}
                    onDeselect={() => onChange({ avOS: '' })}
                  />
                ))}
              </DropdownButton>
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">OU</span>
            <div className="flex flex-wrap gap-1">
              {VA_COMMON.map((v) => (
                <QuickSelectButton
                  key={v}
                  label={v}
                  selected={refraction.avOU === v}
                  onClick={() => handleVASelect('avOU', v)}
                />
              ))}
              <DropdownButton
                label="+"
                selectedLabel={VA_OPTIONS.find((o) => o.id === refraction.avOU && !VA_COMMON.includes(o.id))?.label}
              >
                {VA_OPTIONS.filter((o) => !VA_COMMON.includes(o.id)).map((opt) => (
                  <DropdownOption
                    key={opt.id}
                    label={opt.label}
                    selected={refraction.avOU === opt.id}
                    onSelect={() => onChange({ avOU: opt.id })}
                    onDeselect={() => onChange({ avOU: '' })}
                  />
                ))}
              </DropdownButton>
            </div>
          </div>
        </div>
      </div>

      {/* DP */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Distance Pupillaire</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">VL</Label>
            <Input
              value={refraction.dpVL}
              onChange={(e) => onChange({ dpVL: e.target.value })}
              placeholder="64"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">VP</Label>
            <Input
              value={refraction.dpVP}
              onChange={(e) => onChange({ dpVP: e.target.value })}
              placeholder="61"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Cycloplégie */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium">Cycloplégie</Label>
          <QuickSelectButton
            label={refraction.cycloUsed ? 'Oui' : 'Non'}
            selected={refraction.cycloUsed}
            onClick={() => onChange({ cycloUsed: !refraction.cycloUsed })}
          />
        </div>

        {refraction.cycloUsed && (
          <div className="pl-4 border-l-2 border-primary/20 space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Agent</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {CYCLO_AGENTS.map((agent) => (
                  <QuickSelectButton
                    key={agent}
                    label={agent.split(' ')[0]}
                    selected={refraction.cycloAgent === agent}
                    onClick={() => onChange({ cycloAgent: refraction.cycloAgent === agent ? '' : agent })}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Rx Cyclo OD</Label>
                <Input
                  value={refraction.cycloRxOD}
                  onChange={(e) => onChange({ cycloRxOD: e.target.value })}
                  placeholder="+1.00 -0.50 x 90"
                  className="mt-1 font-mono text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Rx Cyclo OS</Label>
                <Input
                  value={refraction.cycloRxOS}
                  onChange={(e) => onChange({ cycloRxOS: e.target.value })}
                  placeholder="+1.00 -0.50 x 90"
                  className="mt-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <CollapsibleNotes
        id="refraction-notes"
        value={refraction.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes sur la réfraction..."
      />
    </div>
  );
}
