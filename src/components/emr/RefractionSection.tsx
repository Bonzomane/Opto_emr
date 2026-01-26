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
  // Parse value into integer and decimal parts
  const stripped = value.replace(/[^0-9.]/g, '');
  const dotIndex = stripped.indexOf('.');
  const intPart = dotIndex >= 0 ? stripped.slice(0, dotIndex) : stripped;
  const decPart = dotIndex >= 0 ? stripped.slice(dotIndex) : '.00'; // default to .00

  // Append digit to integer part only
  const appendDigit = (digit: string) => {
    // If intPart is just '0', replace it (don't allow '05')
    const effectiveInt = intPart === '0' ? '' : intPart;
    
    // For axis, max 3 digits
    if (fieldType === 'axis' && effectiveInt.length >= 3) return;
    // For power, max 2 digits (e.g., 12.50)
    if (fieldType === 'power' && effectiveInt.length >= 2) return;
    
    const newInt = effectiveInt + digit;
    const newValue = fieldType === 'power' ? newInt + decPart : newInt;
    
    if (fieldType === 'power' && sign) {
      onChange(sign + newValue);
    } else {
      onChange(newValue);
    }
  };

  // Select decimal (exclusive - replaces current decimal)
  const selectDecimal = (decimal: string) => {
    const newValue = (intPart || '0') + decimal;
    if (sign) {
      onChange(sign + newValue);
    } else {
      onChange(newValue);
    }
  };

  // Backspace removes last digit from integer part
  const backspace = () => {
    if (intPart.length === 0) return;
    const newInt = intPart.slice(0, -1);
    const newValue = fieldType === 'power' ? (newInt || '0') + decPart : newInt;
    
    if (fieldType === 'power' && sign && newValue) {
      onChange(sign + newValue);
    } else {
      onChange(newValue);
    }
  };

  const clear = () => {
    onChange('');
  };

  // Button styles
  const btnClass = "w-8 h-8 text-sm font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 flex items-center justify-center";
  const btnDecClass = (dec: string) => cn(
    "w-10 h-8 text-xs font-medium rounded border flex items-center justify-center",
    decPart === dec 
      ? "bg-zinc-800 text-white border-zinc-800" 
      : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
  );

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

          {/* Decimal column for power fields - exclusive selection */}
          {fieldType === 'power' && (
            <div className="flex flex-col gap-px">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); selectDecimal('.25'); }} className={btnDecClass('.25')}>.25</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); selectDecimal('.50'); }} className={btnDecClass('.50')}>.50</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); selectDecimal('.75'); }} className={btnDecClass('.75')}>.75</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); selectDecimal('.00'); }} className={btnDecClass('.00')}>.00</button>
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
  arn,
  arp,
  av,
  avLabel = 'AV',
  onSphereChange,
  onCylinderChange,
  onAxisChange,
  onAddChange,
  onArnChange,
  onArpChange,
  onAvChange,
}: {
  label: string;
  sphere: string;
  cylinder: string;
  axis: string;
  add: string;
  arn?: string;
  arp?: string;
  av?: string;
  avLabel?: string;
  onSphereChange: (v: string) => void;
  onCylinderChange: (v: string) => void;
  onAxisChange: (v: string) => void;
  onAddChange: (v: string) => void;
  onArnChange?: (v: string) => void;
  onArpChange?: (v: string) => void;
  onAvChange?: (v: string) => void;
}) {
  const [sphSign, setSphSign] = useState<'+' | '-'>(() => sphere.includes('+') ? '+' : '-');
  const [cylSign, setCylSign] = useState<'+' | '-'>(() => cylinder.includes('+') ? '+' : '-');
  const [addSign, setAddSign] = useState<'+' | '-'>(() => add.includes('-') ? '-' : '+');
  const [arnSign, setArnSign] = useState<'+' | '-'>(() => arn?.includes('-') ? '-' : '+');
  const [arpSign, setArpSign] = useState<'+' | '-'>(() => arp?.includes('-') ? '-' : '+');

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

  const handleArnChange = (v: string) => {
    onArnChange?.(v);
  };

  const handleArpChange = (v: string) => {
    onArpChange?.(v);
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
          placeholder="00"
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
        {/* ARN column - optional */}
        {onArnChange && (
          <RxField
            label="ARN"
            value={arn || ''}
            onChange={handleArnChange}
            fieldType="power"
            sign={arnSign}
            onSignToggle={() => {
              const newSign = arnSign === '-' ? '+' : '-';
              setArnSign(newSign);
              if (arn) {
                const digits = arn.replace(/[^0-9.]/g, '');
                onArnChange(newSign + digits);
              }
            }}
            placeholder="0.00"
          />
        )}
        {/* ARP column - optional */}
        {onArpChange && (
          <RxField
            label="ARP"
            value={arp || ''}
            onChange={handleArpChange}
            fieldType="power"
            sign={arpSign}
            onSignToggle={() => {
              const newSign = arpSign === '-' ? '+' : '-';
              setArpSign(newSign);
              if (arp) {
                const digits = arp.replace(/[^0-9.]/g, '');
                onArpChange(newSign + digits);
              }
            }}
            placeholder="0.00"
          />
        )}
        {/* AV column - optional */}
        {onAvChange && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground w-8">{avLabel}</span>
            <div className="flex flex-wrap gap-0.5">
              {VA_COMMON.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onAvChange(av === v ? '' : v)}
                  className={cn(
                    "h-8 px-1.5 text-xs rounded border",
                    av === v 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background border-border hover:bg-muted"
                  )}
                >
                  {v}
                </button>
              ))}
              <DropdownButton
                label="+"
                selectedLabel={VA_OPTIONS.find((o) => o.id === av && !VA_COMMON.includes(o.id))?.label}
              >
                {VA_OPTIONS.filter((o) => !VA_COMMON.includes(o.id)).map((opt) => (
                  <DropdownOption
                    key={opt.id}
                    label={opt.label}
                    selected={av === opt.id}
                    onSelect={() => onAvChange(opt.id)}
                    onDeselect={() => onAvChange('')}
                  />
                ))}
              </DropdownButton>
            </div>
          </div>
        )}
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
  // Parse current subjective values
  const odParsed = parseRx(refraction.rxOD);
  const osParsed = parseRx(refraction.rxOS);

  // Parse final Rx values (default to subjective if empty)
  const finalOdParsed = parseRx(refraction.finalRxOD || refraction.rxOD);
  const finalOsParsed = parseRx(refraction.finalRxOS || refraction.rxOS);
  const finalAddOD = refraction.finalAddOD || refraction.addOD;
  const finalAddOS = refraction.finalAddOS || refraction.addOS;
  const finalArnOD = refraction.finalArnOD || refraction.arnOD;
  const finalArnOS = refraction.finalArnOS || refraction.arnOS;
  const finalArpOD = refraction.finalArpOD || refraction.arpOD;
  const finalArpOS = refraction.finalArpOS || refraction.arpOS;

  // Check if final differs from subjective
  const finalDiffersFromSubjective =
    refraction.finalRxOD !== '' || refraction.finalRxOS !== '' ||
    refraction.finalAddOD !== '' || refraction.finalAddOS !== '' ||
    refraction.finalArnOD !== '' || refraction.finalArnOS !== '' ||
    refraction.finalArpOD !== '' || refraction.finalArpOS !== '';

  // Copy subjective to final
  const copySubjectiveToFinal = () => {
    onChange({
      finalRxOD: refraction.rxOD,
      finalRxOS: refraction.rxOS,
      finalAddOD: refraction.addOD,
      finalAddOS: refraction.addOS,
      finalArnOD: refraction.arnOD,
      finalArnOS: refraction.arnOS,
      finalArpOD: refraction.arpOD,
      finalArpOS: refraction.arpOS,
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Réfraction" />

      {/* Rx Subjective */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Rx Subjective</Label>
        <div className="space-y-4">
          <RxPicker
            label="OD"
            sphere={odParsed.sphere}
            cylinder={odParsed.cylinder}
            axis={odParsed.axis}
            add={refraction.addOD}
            arn={refraction.arnOD}
            arp={refraction.arpOD}
            av={refraction.subjAvOD}
            onSphereChange={(v) => onChange({ rxOD: combineRx(v, odParsed.cylinder, odParsed.axis) })}
            onCylinderChange={(v) => onChange({ rxOD: combineRx(odParsed.sphere, v, odParsed.axis) })}
            onAxisChange={(v) => onChange({ rxOD: combineRx(odParsed.sphere, odParsed.cylinder, v) })}
            onAddChange={(v) => onChange({ addOD: v })}
            onArnChange={(v) => onChange({ arnOD: v })}
            onArpChange={(v) => onChange({ arpOD: v })}
            onAvChange={(v) => onChange({ subjAvOD: v })}
          />
          <RxPicker
            label="OS"
            sphere={osParsed.sphere}
            cylinder={osParsed.cylinder}
            axis={osParsed.axis}
            add={refraction.addOS}
            arn={refraction.arnOS}
            arp={refraction.arpOS}
            av={refraction.subjAvOS}
            onSphereChange={(v) => onChange({ rxOS: combineRx(v, osParsed.cylinder, osParsed.axis) })}
            onCylinderChange={(v) => onChange({ rxOS: combineRx(osParsed.sphere, v, osParsed.axis) })}
            onAxisChange={(v) => onChange({ rxOS: combineRx(osParsed.sphere, osParsed.cylinder, v) })}
            onAddChange={(v) => onChange({ addOS: v })}
            onArnChange={(v) => onChange({ arnOS: v })}
            onArpChange={(v) => onChange({ arpOS: v })}
            onAvChange={(v) => onChange({ subjAvOS: v })}
          />
          {/* OU AV inline */}
          <div className="flex items-center gap-2 pl-8">
            <span className="text-sm font-bold">OU</span>
            <span className="text-xs text-muted-foreground">AV</span>
            <div className="flex flex-wrap gap-0.5">
              {VA_COMMON.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onChange({ subjAvOU: refraction.subjAvOU === v ? '' : v })}
                  className={cn(
                    "h-8 px-1.5 text-xs rounded border",
                    refraction.subjAvOU === v 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background border-border hover:bg-muted"
                  )}
                >
                  {v}
                </button>
              ))}
              <DropdownButton
                label="+"
                selectedLabel={VA_OPTIONS.find((o) => o.id === refraction.subjAvOU && !VA_COMMON.includes(o.id))?.label}
              >
                {VA_OPTIONS.filter((o) => !VA_COMMON.includes(o.id)).map((opt) => (
                  <DropdownOption
                    key={opt.id}
                    label={opt.label}
                    selected={refraction.subjAvOU === opt.id}
                    onSelect={() => onChange({ subjAvOU: opt.id })}
                    onDeselect={() => onChange({ subjAvOU: '' })}
                  />
                ))}
              </DropdownButton>
            </div>
          </div>
        </div>
      </div>

      {/* Rx Finale - copies from subjective by default, includes AV */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Rx Finale</Label>
          {finalDiffersFromSubjective && (
            <button
              type="button"
              onClick={copySubjectiveToFinal}
              className="text-xs text-primary hover:underline"
            >
              ← Copier Rx Subjective
            </button>
          )}
        </div>
        <div className="space-y-4">
          <RxPicker
            label="OD"
            sphere={finalOdParsed.sphere}
            cylinder={finalOdParsed.cylinder}
            axis={finalOdParsed.axis}
            add={finalAddOD}
            arn={finalArnOD}
            arp={finalArpOD}
            av={refraction.avOD}
            avLabel="MAV"
            onSphereChange={(v) => onChange({ finalRxOD: combineRx(v, finalOdParsed.cylinder, finalOdParsed.axis) })}
            onCylinderChange={(v) => onChange({ finalRxOD: combineRx(finalOdParsed.sphere, v, finalOdParsed.axis) })}
            onAxisChange={(v) => onChange({ finalRxOD: combineRx(finalOdParsed.sphere, finalOdParsed.cylinder, v) })}
            onAddChange={(v) => onChange({ finalAddOD: v })}
            onArnChange={(v) => onChange({ finalArnOD: v })}
            onArpChange={(v) => onChange({ finalArpOD: v })}
            onAvChange={(v) => onChange({ avOD: v })}
          />
          <RxPicker
            label="OS"
            sphere={finalOsParsed.sphere}
            cylinder={finalOsParsed.cylinder}
            axis={finalOsParsed.axis}
            add={finalAddOS}
            arn={finalArnOS}
            arp={finalArpOS}
            av={refraction.avOS}
            avLabel="MAV"
            onSphereChange={(v) => onChange({ finalRxOS: combineRx(v, finalOsParsed.cylinder, finalOsParsed.axis) })}
            onCylinderChange={(v) => onChange({ finalRxOS: combineRx(finalOsParsed.sphere, v, finalOsParsed.axis) })}
            onAxisChange={(v) => onChange({ finalRxOS: combineRx(finalOsParsed.sphere, finalOsParsed.cylinder, v) })}
            onAddChange={(v) => onChange({ finalAddOS: v })}
            onArnChange={(v) => onChange({ finalArnOS: v })}
            onArpChange={(v) => onChange({ finalArpOS: v })}
            onAvChange={(v) => onChange({ avOS: v })}
          />
          {/* OU MAV inline */}
          <div className="flex items-center gap-2 pl-8">
            <span className="text-sm font-bold">OU</span>
            <span className="text-xs text-muted-foreground">MAV</span>
            <div className="flex flex-wrap gap-0.5">
              {VA_COMMON.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onChange({ avOU: refraction.avOU === v ? '' : v })}
                  className={cn(
                    "h-8 px-1.5 text-xs rounded border",
                    refraction.avOU === v 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background border-border hover:bg-muted"
                  )}
                >
                  {v}
                </button>
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
        {!finalDiffersFromSubjective && (
          <p className="text-xs text-muted-foreground italic">
            Utilise les valeurs de Rx Subjective par défaut
          </p>
        )}
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

        {refraction.cycloUsed && (() => {
          const cycloOdParsed = parseRx(refraction.cycloRxOD);
          const cycloOsParsed = parseRx(refraction.cycloRxOS);
          return (
            <div className="pl-4 border-l-2 border-primary/20 space-y-4">
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
              <div className="space-y-4">
                <RxPicker
                  label="OD"
                  sphere={cycloOdParsed.sphere}
                  cylinder={cycloOdParsed.cylinder}
                  axis={cycloOdParsed.axis}
                  add={refraction.cycloAddOD}
                  arn={refraction.cycloArnOD}
                  arp={refraction.cycloArpOD}
                  av={refraction.cycloAvOD}
                  onSphereChange={(v) => onChange({ cycloRxOD: combineRx(v, cycloOdParsed.cylinder, cycloOdParsed.axis) })}
                  onCylinderChange={(v) => onChange({ cycloRxOD: combineRx(cycloOdParsed.sphere, v, cycloOdParsed.axis) })}
                  onAxisChange={(v) => onChange({ cycloRxOD: combineRx(cycloOdParsed.sphere, cycloOdParsed.cylinder, v) })}
                  onAddChange={(v) => onChange({ cycloAddOD: v })}
                  onArnChange={(v) => onChange({ cycloArnOD: v })}
                  onArpChange={(v) => onChange({ cycloArpOD: v })}
                  onAvChange={(v) => onChange({ cycloAvOD: v })}
                />
                <RxPicker
                  label="OS"
                  sphere={cycloOsParsed.sphere}
                  cylinder={cycloOsParsed.cylinder}
                  axis={cycloOsParsed.axis}
                  add={refraction.cycloAddOS}
                  arn={refraction.cycloArnOS}
                  arp={refraction.cycloArpOS}
                  av={refraction.cycloAvOS}
                  onSphereChange={(v) => onChange({ cycloRxOS: combineRx(v, cycloOsParsed.cylinder, cycloOsParsed.axis) })}
                  onCylinderChange={(v) => onChange({ cycloRxOS: combineRx(cycloOsParsed.sphere, v, cycloOsParsed.axis) })}
                  onAxisChange={(v) => onChange({ cycloRxOS: combineRx(cycloOsParsed.sphere, cycloOsParsed.cylinder, v) })}
                  onAddChange={(v) => onChange({ cycloAddOS: v })}
                  onArnChange={(v) => onChange({ cycloArnOS: v })}
                  onArpChange={(v) => onChange({ cycloArpOS: v })}
                  onAvChange={(v) => onChange({ cycloAvOS: v })}
                />
                {/* OU AV inline */}
                <div className="flex items-center gap-2 pl-8">
                  <span className="text-sm font-bold">OU</span>
                  <span className="text-xs text-muted-foreground">AV</span>
                  <div className="flex flex-wrap gap-0.5">
                    {VA_COMMON.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => onChange({ cycloAvOU: refraction.cycloAvOU === v ? '' : v })}
                        className={cn(
                          "h-8 px-1.5 text-xs rounded border",
                          refraction.cycloAvOU === v 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-background border-border hover:bg-muted"
                        )}
                      >
                        {v}
                      </button>
                    ))}
                    <DropdownButton
                      label="+"
                      selectedLabel={VA_OPTIONS.find((o) => o.id === refraction.cycloAvOU && !VA_COMMON.includes(o.id))?.label}
                    >
                      {VA_OPTIONS.filter((o) => !VA_COMMON.includes(o.id)).map((opt) => (
                        <DropdownOption
                          key={opt.id}
                          label={opt.label}
                          selected={refraction.cycloAvOU === opt.id}
                          onSelect={() => onChange({ cycloAvOU: opt.id })}
                          onDeselect={() => onChange({ cycloAvOU: '' })}
                        />
                      ))}
                    </DropdownButton>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
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
