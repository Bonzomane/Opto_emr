import { ObjectiveRefraction } from '@/types/emr';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { ObjectiveRefractionDisplay } from '@/print/sectionDisplays';
import { useState, useEffect } from 'react';

interface ObjectiveRefractionSectionProps {
  objectiveRefraction: ObjectiveRefraction;
  onChange: (updates: Partial<ObjectiveRefraction>) => void;
}

// Individual input box with keyboard activation on click and hover
function RefractionInput({
  value,
  onChange,
  placeholder,
  className = '',
  type = 'power',
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
        onChange(input);
      }
    } else if (type === 'axis') {
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
      className={`h-9 w-16 px-2 text-center text-sm font-mono border border-zinc-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 ${className}`}
    />
  );
}

// Parse a prescription string like "+1.00 -0.50 x 180" into parts
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

const VALID_DECIMALS = ['00', '25', '50', '75'];
const DECIMAL_AUTOCOMPLETE: Record<string, string> = {
  '0': '00', '2': '25', '5': '50', '7': '75'
};

// Auto-complete for sphere and cylinder
function autocompletePower(input: string): string {
  const cleaned = input.replace(/[^\d.+-]/g, '');
  if (!cleaned) return '';

  const sign = cleaned.startsWith('-') ? '-' : cleaned.startsWith('+') ? '+' : '';
  const digits = cleaned.replace(/[^0-9]/g, '');

  if (!digits) return sign;

  if (digits.length === 1) {
    return `${sign}${digits}.00`;
  } else if (digits.length === 2) {
    if (digits[1] === '0') {
      return `${sign}${digits}.00`;
    }
    const decimal = DECIMAL_AUTOCOMPLETE[digits[1]] || digits[1] + '0';
    return `${sign}${digits[0]}.${decimal}`;
  } else if (digits.length === 3) {
    const int = digits[0];
    const dec = digits.slice(1);
    if (VALID_DECIMALS.includes(dec)) {
      return `${sign}${int}.${dec}`;
    }
    const firstDec = digits[1];
    const completedDec = DECIMAL_AUTOCOMPLETE[firstDec] || dec;
    return `${sign}${int}.${completedDec}`;
  }

  return input;
}

// Auto-complete for axis
function autocompleteAxis(input: string): string {
  const cleaned = input.replace(/\D/g, '');
  if (!cleaned) return '';

  const num = parseInt(cleaned, 10);

  if (cleaned.length === 1) {
    if (num === 1) return '180';
    if (num === 9) return '90';
    if (num === 0) return '0';
  } else if (cleaned.length === 2) {
    if (num === 18) return '180';
    if (num === 90) return '90';
  }

  return Math.min(180, num).toString();
}

// Refraction picker for one eye with separate boxes
function RxPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const parsed = parseRx(value);
  const [sphere, setSphere] = useState(parsed.sphere);
  const [cylinder, setCylinder] = useState(parsed.cylinder);
  const [axis, setAxis] = useState(parsed.axis);

  useEffect(() => {
    const parsed = parseRx(value);
    setSphere(parsed.sphere);
    setCylinder(parsed.cylinder);
    setAxis(parsed.axis);
  }, [value]);

  const updateRx = (newSphere: string, newCylinder: string, newAxis: string) => {
    setSphere(newSphere);
    setCylinder(newCylinder);
    setAxis(newAxis);
    onChange(combineRx(newSphere, newCylinder, newAxis));
  };

  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      <div className="flex gap-0.5 items-center">
        <RefractionInput
          value={sphere}
          onChange={(v) => updateRx(v, cylinder, axis)}
          placeholder="0.00"
          type="power"
        />
        <span className="text-sm font-mono text-zinc-500 px-1">/</span>
        <RefractionInput
          value={cylinder}
          onChange={(v) => updateRx(sphere, v, axis)}
          placeholder="0.00"
          type="power"
        />
        <span className="text-sm font-mono text-zinc-500 px-1">x</span>
        <RefractionInput
          value={axis}
          onChange={(v) => updateRx(sphere, cylinder, v)}
          placeholder="180"
          type="axis"
        />
      </div>
    </div>
  );
}

export function ObjectiveRefractionSection({ objectiveRefraction, onChange }: ObjectiveRefractionSectionProps) {
  const setMethod = (method: 'autoref' | 'skiascopy') => {
    // Allow deselection
    if (objectiveRefraction.method === method) {
      onChange({ method: '' });
    } else {
      onChange({ method });
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeaderWithPreview
        title="Réfraction Objective"
        preview={<ObjectiveRefractionDisplay obj={objectiveRefraction} />}
      />
      {/* Method Selection */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Méthode</label>
        <div className="flex gap-2">
          <QuickSelectButton
            label="Autoréfracteur"
            selected={objectiveRefraction.method === 'autoref'}
            onClick={() => setMethod('autoref')}
            selectedClassName="bg-zinc-900 text-white border-zinc-900"
            unselectedClassName="bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400"
          />
          <QuickSelectButton
            label="Skiascopie"
            selected={objectiveRefraction.method === 'skiascopy'}
            onClick={() => setMethod('skiascopy')}
            selectedClassName="bg-zinc-900 text-white border-zinc-900"
            unselectedClassName="bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400"
          />
        </div>
      </div>

      {/* Autoref shows "printed and joined" message */}
      {objectiveRefraction.method === 'autoref' && (
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded text-sm text-zinc-600 italic">
          Résultats imprimés et joints à l'examen
        </div>
      )}

      {/* Skiascopy shows input fields for manual entry */}
      {objectiveRefraction.method === 'skiascopy' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <RxPicker
              label="OD"
              value={objectiveRefraction.rxOD}
              onChange={(v) => onChange({ rxOD: v })}
            />
            <RxPicker
              label="OS"
              value={objectiveRefraction.rxOS}
              onChange={(v) => onChange({ rxOS: v })}
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <CollapsibleNotes
        value={objectiveRefraction.notes}
        onChange={(notes) => onChange({ notes })}
        placeholder="Notes sur la réfraction objective..."
      />
    </div>
  );
}
