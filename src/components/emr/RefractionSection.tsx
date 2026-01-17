import { RefractionData, CYCLO_AGENTS } from '@/types/emr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';
import { useEffect, useState } from 'react';

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

type SignValue = '+' | '-';

const VALID_DECIMALS = ['00', '25', '50', '75'];

// Auto-complete partial decimal: typing just the first digit completes the pattern
const DECIMAL_AUTOCOMPLETE: Record<string, string> = {
  '0': '00', '2': '25', '5': '50', '7': '75'
};

function inferSign(value: string, fallback: SignValue): SignValue {
  if (value.includes('-')) return '-';
  if (value.includes('+')) return '+';
  return fallback;
}

// Map of which digit completes a partial decimal (e.g., "2" needs "5" to become "25")
const DECIMAL_COMPLETERS: Record<string, string> = {
  '0': '0', '2': '5', '5': '0', '7': '5'
};

/**
 * Extract the first power value from a digit string.
 * Recognizes .00, .25, .50, .75 as valid decimal endings.
 * Auto-completes partial decimals (0→00, 2→25, 5→50, 7→75) only when
 * followed by a digit that can't complete the pattern.
 * Returns { power, remaining } where power is formatted (e.g. "1.25") and remaining is leftover digits.
 */
function extractPower(digits: string): { power: string; remaining: string } {
  if (!digits) return { power: '', remaining: '' };

  // Scan for valid decimal endings (00, 25, 50, 75)
  for (let i = 2; i <= digits.length; i++) {
    const decimal = digits.slice(i - 2, i);
    if (VALID_DECIMALS.includes(decimal)) {
      const integer = digits.slice(0, i - 2) || '0';
      const intValue = parseInt(integer, 10);
      const nextChar = digits[i];

      // If next char is '0', it might extend the integer (e.g., 1000 = 10.00)
      // If next char is non-zero or undefined, we found a boundary
      if (nextChar === undefined || nextChar !== '0') {
        return { power: `${intValue}.${decimal}`, remaining: digits.slice(i) };
      }
    }
  }

  // No complete decimal found - check for partial decimal with following digit
  // Only auto-complete if the NEXT digit proves the partial is done
  for (let i = 1; i < digits.length; i++) {
    const partialDigit = digits[i - 1];
    const nextDigit = digits[i];
    
    if (DECIMAL_AUTOCOMPLETE[partialDigit]) {
      const completer = DECIMAL_COMPLETERS[partialDigit];
      // If next digit is NOT the completer, auto-complete here
      if (nextDigit !== completer) {
        const decimal = DECIMAL_AUTOCOMPLETE[partialDigit];
        const integer = digits.slice(0, i - 1) || '0';
        const intValue = parseInt(integer, 10);
        return { power: `${intValue}.${decimal}`, remaining: digits.slice(i) };
      }
    }
  }

  // No valid decimal found - return digits as incomplete integer
  return { power: digits, remaining: '' };
}

/**
 * Parse packed digit input into formatted Rx string.
 * Examples:
 *   "125" → "-1.25"
 *   "1025" → "-10.25"
 *   "100" → "-1.00"
 *   "1000" → "-10.00"
 *   "1001" → "-1.00 -1" (incomplete cyl)
 *   "500100180" → "-5.00 -1.00 x 180"
 */
function formatPackedRx(digits: string, sphSign: SignValue): string {
  const cleaned = digits.replace(/\D/g, '');
  if (!cleaned) return '';

  // Cylinder is always negative in minus cylinder notation
  const cylSign: SignValue = '-';

  // Extract sphere (no limit)
  const { power: sph, remaining: afterSph } = extractPower(cleaned);
  if (!afterSph) {
    return sph ? `${sphSign}${sph}` : '';
  }

  // Cylinder: max 3 digits (so max is 9.75)
  // Take only first 3 digits for cylinder, rest goes to axis
  const cylDigits = afterSph.slice(0, 3);
  const { power: cyl, remaining: cylRemainder } = extractPower(cylDigits);
  
  // Axis = any unused cylinder digits + everything after first 3
  const axis = cylRemainder + afterSph.slice(3);

  if (sph && cyl && axis) {
    return `${sphSign}${sph} / ${cylSign}${cyl} x ${axis}`;
  }
  if (sph && cyl) {
    return `${sphSign}${sph} / ${cylSign}${cyl}`;
  }
  if (sph && afterSph) {
    // Incomplete cylinder (e.g., "1001" → "-1.00 / -1")
    return `${sphSign}${sph} / ${cylSign}${afterSph}`;
  }
  return sph ? `${sphSign}${sph}` : '';
}

/**
 * Parse packed digit input for addition (same logic but simpler - just one power).
 */
function formatPackedAdd(digits: string, sign: SignValue): string {
  const cleaned = digits.replace(/\D/g, '');
  if (!cleaned) return '';
  
  const { power } = extractPower(cleaned);
  return power ? `${sign}${power}` : '';
}

// Individual input box with keyboard activation on click and hover
function RefractionInput({
  value,
  onChange,
  placeholder,
  className = '',
  type = 'power', // 'power' for sphere/cylinder, 'axis' for axis
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'power' | 'axis';
}) {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [lastValue, setLastValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digits = input.replace(/[^0-9+-]/g, '');

    // Check if this is a deletion (backspace/delete)
    const isDeletion = input.length < lastValue.length;
    setLastValue(input);

    if (type === 'power') {
      // Real-time autocomplete for power values
      const sign = input.startsWith('-') ? '-' : input.startsWith('+') ? '+' : '';
      const justDigits = digits.replace(/[+-]/g, '');

      if (!justDigits) {
        onChange(sign);
        return;
      }

      // If deleting, just show what's there without autocomplete
      if (isDeletion) {
        onChange(input);
        return;
      }

      const len = justDigits.length;

      if (len === 1) {
        // "1" -> "1.00"
        onChange(`${sign}${justDigits}.00`);
      } else if (len === 2) {
        // "12" -> "1.25", "10" -> "1.00", "50" -> "5.00"
        const firstDigit = justDigits[0];
        const secondDigit = justDigits[1];

        // Check if second digit completes a decimal (0, 2, 5, 7)
        if (DECIMAL_AUTOCOMPLETE[secondDigit]) {
          const decimal = DECIMAL_AUTOCOMPLETE[secondDigit];
          onChange(`${sign}${firstDigit}.${decimal}`);
        } else {
          // Not a valid decimal starter, treat as two-digit integer
          onChange(`${sign}${justDigits}.00`);
        }
      } else if (len === 3) {
        // "125" -> "1.25", "100" -> "1.00", "500" -> "5.00"
        const int = justDigits[0];
        const dec = justDigits.slice(1);
        if (VALID_DECIMALS.includes(dec)) {
          onChange(`${sign}${int}.${dec}`);
        } else {
          // Try autocomplete on second digit
          const decimal = DECIMAL_AUTOCOMPLETE[justDigits[1]] || dec;
          onChange(`${sign}${int}.${decimal}`);
        }
      } else if (len === 4) {
        // "1000" -> "10.00", "1200" -> "12.00", "1025" -> "10.25"
        const int = justDigits.slice(0, 2);
        const dec = justDigits.slice(2);
        if (VALID_DECIMALS.includes(dec)) {
          onChange(`${sign}${int}.${dec}`);
        } else {
          // Try autocomplete on third digit
          const decimal = DECIMAL_AUTOCOMPLETE[justDigits[2]] || dec;
          onChange(`${sign}${int}.${decimal}`);
        }
      } else {
        // More than 4 digits - use extractPower logic
        const { power } = extractPower(justDigits);
        onChange(`${sign}${power}`);
      }
    } else if (type === 'axis') {
      // Real-time autocomplete for axis values
      if (!digits) {
        onChange('');
        return;
      }

      // If deleting, just show what's there without autocomplete
      if (isDeletion) {
        onChange(input);
        return;
      }

      const len = digits.length;
      const num = parseInt(digits, 10);

      if (len === 1) {
        // "1" -> "180", "9" -> "90"
        if (num === 1) {
          onChange('180');
        } else if (num === 9) {
          onChange('90');
        } else if (num === 0) {
          onChange('0');
        } else {
          onChange(digits);
        }
      } else if (len === 2) {
        // "18" -> "180", "90" -> "90"
        if (num === 18) {
          onChange('180');
        } else if (num === 90) {
          onChange('90');
        } else {
          onChange(Math.min(180, num).toString());
        }
      } else if (len === 3) {
        // "180" is complete
        onChange(Math.min(180, num).toString());
      } else {
        onChange(Math.min(180, num).toString());
      }
    }
  };

  return (
    <input
      ref={setInputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onClick={() => inputRef?.focus()}
      onMouseEnter={() => inputRef?.focus()}
      placeholder={placeholder}
      className={`h-9 w-16 px-2 text-center text-sm font-mono border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    />
  );
}

// Parse a prescription string like "-1.25 / -0.50 x 180" into parts
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

// Auto-complete for sphere and cylinder (e.g., "1" -> "1.00", "125" -> "1.25")
function autocompletePower(input: string): string {
  const cleaned = input.replace(/[^\d.+-]/g, '');
  if (!cleaned) return '';

  // Extract sign
  const sign = cleaned.startsWith('-') ? '-' : cleaned.startsWith('+') ? '+' : '';
  const digits = cleaned.replace(/[^0-9]/g, '');

  if (!digits) return sign;

  // Parse based on length
  if (digits.length === 1) {
    // Single digit: "1" -> "1.00"
    return `${sign}${digits}.00`;
  } else if (digits.length === 2) {
    // Two digits: "10" -> "10.00", "12" -> "1.25"
    if (digits[1] === '0') {
      return `${sign}${digits}.00`;
    }
    const decimal = DECIMAL_AUTOCOMPLETE[digits[1]] || digits[1] + '0';
    return `${sign}${digits[0]}.${decimal}`;
  } else if (digits.length === 3) {
    // Three digits: "125" -> "1.25", "100" -> "1.00"
    const int = digits[0];
    const dec = digits.slice(1);
    if (VALID_DECIMALS.includes(dec)) {
      return `${sign}${int}.${dec}`;
    }
    // Try to autocomplete: "127" -> "1.25" (ignore the 7)
    const firstDec = digits[1];
    const completedDec = DECIMAL_AUTOCOMPLETE[firstDec] || dec;
    return `${sign}${int}.${completedDec}`;
  } else {
    // Four+ digits: "1025" -> "10.25"
    const { power } = extractPower(digits);
    return `${sign}${power}`;
  }
}

// Auto-complete for axis (e.g., "1" -> "180", "9" -> "90")
function autocompleteAxis(input: string): string {
  const cleaned = input.replace(/\D/g, '');
  if (!cleaned) return '';

  const num = parseInt(cleaned, 10);

  // Common axis values
  if (cleaned.length === 1) {
    if (num === 1) return '180';
    if (num === 9) return '90';
    if (num === 0) return '0';
  } else if (cleaned.length === 2) {
    if (num === 18) return '180';
    if (num === 90) return '90';
  }

  // Otherwise return as-is, but clamp to 0-180
  return Math.min(180, num).toString();
}

// Full Rx input for one eye with separate boxes
function RxPicker({
  label,
  value,
  add,
  onChange,
  onAddChange,
}: {
  label: string;
  value: string;
  add: string;
  onChange: (v: string) => void;
  onAddChange: (v: string) => void;
}) {
  const [rxSign, setRxSign] = useState<SignValue>(() => inferSign(value, '-'));
  const [addSign, setAddSign] = useState<SignValue>(() => inferSign(add, '+'));

  const parsed = parseRx(value);
  const [sphere, setSphere] = useState(parsed.sphere);
  const [cylinder, setCylinder] = useState(parsed.cylinder);
  const [axis, setAxis] = useState(parsed.axis);

  useEffect(() => {
    const parsed = parseRx(value);
    setSphere(parsed.sphere);
    setCylinder(parsed.cylinder);
    setAxis(parsed.axis);
    setRxSign((current) => inferSign(value, current));
  }, [value]);

  useEffect(() => {
    setAddSign((current) => inferSign(add, current));
  }, [add]);

  const updateRx = (newSphere: string, newCylinder: string, newAxis: string) => {
    setSphere(newSphere);
    setCylinder(newCylinder);
    setAxis(newAxis);
    onChange(combineRx(newSphere, newCylinder, newAxis));
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-bold">{label}</span>

      <div className="grid gap-2 md:grid-cols-[1fr_140px]">
        <div className="flex gap-0.5 items-center">
          <button
            type="button"
            onClick={() => {
              const next = rxSign === '-' ? '+' : '-';
              setRxSign(next);
              if (sphere) {
                const newSphere = sphere.startsWith('-') || sphere.startsWith('+')
                  ? next + sphere.slice(1)
                  : next + sphere;
                updateRx(newSphere, cylinder, axis);
              }
            }}
            className="h-9 w-10 rounded border border-border bg-muted/40 text-sm font-mono hover:bg-muted mr-1"
          >
            {rxSign}
          </button>
          <RefractionInput
            value={sphere}
            onChange={(v) => updateRx(v, cylinder, axis)}
            placeholder="0.00"
            type="power"
          />
          <span className="text-sm font-mono text-muted-foreground px-1">/</span>
          <RefractionInput
            value={cylinder}
            onChange={(v) => updateRx(sphere, v, axis)}
            placeholder="0.00"
            type="power"
          />
          <span className="text-sm font-mono text-muted-foreground px-1">x</span>
          <RefractionInput
            value={axis}
            onChange={(v) => updateRx(sphere, cylinder, v)}
            placeholder="180"
            type="axis"
          />
        </div>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => {
              const next = addSign === '-' ? '+' : '-';
              setAddSign(next);
              if (add) {
                const newAdd = add.startsWith('-') || add.startsWith('+')
                  ? next + add.slice(1)
                  : next + add;
                onAddChange(newAdd);
              }
            }}
            className="h-9 w-10 rounded border border-border bg-muted/40 text-sm font-mono hover:bg-muted"
          >
            {addSign}
          </button>
          <Input
            type="text"
            value={add}
            onChange={(e) => {
              onAddChange(e.target.value);
            }}
            onFocus={(e) => {
              if (add) {
                const completed = autocompletePower(add);
                onAddChange(completed);
              }
            }}
            placeholder="Add"
            className="h-9 text-sm font-mono"
          />
        </div>
      </div>
    </div>
  );
}

export function RefractionSection({ refraction, onChange }: RefractionSectionProps) {
  const handleVASelect = (field: keyof RefractionData, value: string) => {
    const current = refraction[field];
    onChange({ [field]: current === value ? '' : value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Réfraction" />

      {/* Rx Finale */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Rx Subjective Finale</Label>
        <div className="space-y-3">
          <RxPicker
            label="OD"
            value={refraction.rxOD}
            add={refraction.addOD}
            onChange={(v) => onChange({ rxOD: v })}
            onAddChange={(v) => onChange({ addOD: v })}
          />
          <RxPicker
            label="OS"
            value={refraction.rxOS}
            add={refraction.addOS}
            onChange={(v) => onChange({ rxOS: v })}
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
