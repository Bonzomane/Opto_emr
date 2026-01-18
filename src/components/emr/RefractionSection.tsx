import { RefractionData, CYCLO_AGENTS } from '@/types/emr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';
import { cn } from '@/lib/utils';
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

type RxField = 'sphere' | 'cylinder' | 'axis' | 'add' | 'vertex' | 'prism';

const MAX_POWER_DIGITS = 4;
const MAX_AXIS_DIGITS = 3;
const MAX_OPTION_DIGITS = 3;

function appendDigits(current: string, digit: string, max: number) {
  if (current.length >= max) return current;
  return `${current}${digit}`;
}

function backspaceDigits(current: string) {
  if (!current) return '';
  return current.slice(0, -1);
}

// Full Rx input for one eye with numpad
function RxPicker({
  label,
  value,
  add,
  vertex,
  prism,
  onChange,
  onAddChange,
  onVertexChange,
  onPrismChange,
}: {
  label: string;
  value: string;
  add: string;
  vertex: string;
  prism: string;
  onChange: (v: string) => void;
  onAddChange: (v: string) => void;
  onVertexChange: (v: string) => void;
  onPrismChange: (v: string) => void;
}) {
  const parsed = parseRx(value);
  const [rxSign, setRxSign] = useState<SignValue>(() => inferSign(value, '-'));
  const [cylSign, setCylSign] = useState<SignValue>(() => inferSign(parsed.cylinder, '-'));
  const [addSign, setAddSign] = useState<SignValue>(() => inferSign(add, '+'));
  const [activeField, setActiveField] = useState<RxField | null>(null);
  const [showExtras, setShowExtras] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [sphere, setSphere] = useState(parsed.sphere);
  const [cylinder, setCylinder] = useState(parsed.cylinder);
  const [axis, setAxis] = useState(parsed.axis);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e822b818-e18f-42e8-b5f3-ca56de2f191f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RefractionSection.tsx:useEffect[value]',message:'useEffect syncing from props',data:{propValue:value,parsedSphere:parseRx(value).sphere},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const parsed = parseRx(value);
    setSphere(parsed.sphere);
    setCylinder(parsed.cylinder);
    setAxis(parsed.axis);
    setRxSign((current) => inferSign(value, current));
    setCylSign((current) => inferSign(parsed.cylinder, current));
  }, [value]);

  useEffect(() => {
    setAddSign((current) => inferSign(add, current));
  }, [add]);

  useEffect(() => {
    if (!showExtras && (activeField === 'vertex' || activeField === 'prism')) {
      setActiveField(null);
    }
  }, [showExtras, activeField]);

  const handleFieldClick = (field: RxField) => {
    if (activeField === field && isLocked) {
      // Clicking same field when locked = unlock and close
      setIsLocked(false);
      setActiveField(null);
    } else {
      // Lock to this field
      setIsLocked(true);
      setActiveField(field);
    }
  };

  const handleFieldHover = (field: RxField) => {
    if (!isLocked) {
      setActiveField(field);
    }
  };

  const handleFieldLeave = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e822b818-e18f-42e8-b5f3-ca56de2f191f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RefractionSection.tsx:handleFieldLeave',message:'handleFieldLeave called',data:{isLocked,activeField},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (!isLocked) {
      setActiveField(null);
    }
  };

  const updateRx = (newSphere: string, newCylinder: string, newAxis: string) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e822b818-e18f-42e8-b5f3-ca56de2f191f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RefractionSection.tsx:updateRx',message:'updateRx called',data:{newSphere,newCylinder,newAxis,combined:combineRx(newSphere,newCylinder,newAxis)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    setSphere(newSphere);
    setCylinder(newCylinder);
    setAxis(newAxis);
    onChange(combineRx(newSphere, newCylinder, newAxis));
  };

  const applyPowerDigits = (current: string, sign: SignValue, digit: string) => {
    const digits = current.replace(/\D/g, '');
    const nextDigits = appendDigits(digits, digit, MAX_POWER_DIGITS);
    if (!nextDigits) return '';
    const result = autocompletePower(`${sign}${nextDigits}`);
    return result;
  };

  const backspacePowerDigits = (current: string, sign: SignValue) => {
    const digits = current.replace(/\D/g, '');
    const nextDigits = backspaceDigits(digits);
    return nextDigits ? autocompletePower(`${sign}${nextDigits}`) : '';
  };

  const applyAxisDigits = (current: string, digit: string) => {
    const digits = current.replace(/\D/g, '');
    const nextDigits = appendDigits(digits, digit, MAX_AXIS_DIGITS);
    return nextDigits ? autocompleteAxis(nextDigits) : '';
  };

  const backspaceAxisDigits = (current: string) => {
    const digits = current.replace(/\D/g, '');
    const nextDigits = backspaceDigits(digits);
    return nextDigits ? autocompleteAxis(nextDigits) : '';
  };

  const applyOptionDigits = (current: string, digit: string) => {
    const digits = current.replace(/\D/g, '');
    const nextDigits = appendDigits(digits, digit, MAX_OPTION_DIGITS);
    return nextDigits || '';
  };

  const backspaceOptionDigits = (current: string) => {
    const digits = current.replace(/\D/g, '');
    return backspaceDigits(digits);
  };

  const toggleSign = (field: 'sphere' | 'cylinder' | 'add') => {
    if (field === 'sphere') {
      const next = rxSign === '-' ? '+' : '-';
      setRxSign(next);
      if (sphere) {
        const digits = sphere.replace(/\D/g, '');
        updateRx(autocompletePower(`${next}${digits}`), cylinder, axis);
      }
      return;
    }
    if (field === 'cylinder') {
      const next = cylSign === '-' ? '+' : '-';
      setCylSign(next);
      if (cylinder) {
        const digits = cylinder.replace(/\D/g, '');
        updateRx(sphere, autocompletePower(`${next}${digits}`), axis);
      }
      return;
    }
    const next = addSign === '-' ? '+' : '-';
    setAddSign(next);
    if (add) {
      const digits = add.replace(/\D/g, '');
      onAddChange(autocompletePower(`${next}${digits}`));
    }
  };

  const appendDigit = (digit: number) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e822b818-e18f-42e8-b5f3-ca56de2f191f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RefractionSection.tsx:appendDigit',message:'appendDigit called',data:{digit,activeField,sphere,cylinder,axis},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (!activeField) return;
    const nextDigit = String(digit);
    switch (activeField) {
      case 'sphere':
        // #region agent log
        const newSphereValue = applyPowerDigits(sphere, rxSign, nextDigit);
        fetch('http://127.0.0.1:7242/ingest/e822b818-e18f-42e8-b5f3-ca56de2f191f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RefractionSection.tsx:appendDigit:sphere',message:'sphere applyPowerDigits result',data:{currentSphere:sphere,rxSign,nextDigit,newSphereValue},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        updateRx(newSphereValue, cylinder, axis);
        break;
      case 'cylinder':
        updateRx(sphere, applyPowerDigits(cylinder, cylSign, nextDigit), axis);
        break;
      case 'axis':
        updateRx(sphere, cylinder, applyAxisDigits(axis, nextDigit));
        break;
      case 'add':
        onAddChange(applyPowerDigits(add, addSign, nextDigit));
        break;
      case 'vertex':
        onVertexChange(applyOptionDigits(vertex, nextDigit));
        break;
      case 'prism':
        onPrismChange(applyOptionDigits(prism, nextDigit));
        break;
    }
  };

  const backspaceActive = () => {
    if (!activeField) return;
    switch (activeField) {
      case 'sphere':
        updateRx(backspacePowerDigits(sphere, rxSign), cylinder, axis);
        break;
      case 'cylinder':
        updateRx(sphere, backspacePowerDigits(cylinder, cylSign), axis);
        break;
      case 'axis':
        updateRx(sphere, cylinder, backspaceAxisDigits(axis));
        break;
      case 'add':
        onAddChange(backspacePowerDigits(add, addSign));
        break;
      case 'vertex':
        onVertexChange(backspaceOptionDigits(vertex));
        break;
      case 'prism':
        onPrismChange(backspaceOptionDigits(prism));
        break;
    }
  };

  const clearActive = () => {
    if (!activeField) return;
    switch (activeField) {
      case 'sphere':
        updateRx('', cylinder, axis);
        break;
      case 'cylinder':
        updateRx(sphere, '', axis);
        break;
      case 'axis':
        updateRx(sphere, cylinder, '');
        break;
      case 'add':
        onAddChange('');
        break;
      case 'vertex':
        onVertexChange('');
        break;
      case 'prism':
        onPrismChange('');
        break;
    }
  };

  const fieldButtonClass = (field: RxField) =>
    cn(
      'h-8 min-w-[60px] rounded border px-2 text-sm font-mono',
      activeField === field
        ? 'border-primary ring-1 ring-primary bg-primary/5'
        : 'border-border bg-background'
    );

  return (
    <div className="space-y-2">
      <span className="text-sm font-bold">{label}</span>

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/20 px-2 py-2">
          <button
            type="button"
            onClick={() => toggleSign('sphere')}
            className="h-7 w-8 rounded border border-border bg-white text-sm font-mono hover:bg-muted"
          >
            {rxSign}
          </button>
          <button
            type="button"
            onClick={() => handleFieldClick('sphere')}
            onMouseEnter={() => handleFieldHover('sphere')}
            onMouseLeave={handleFieldLeave}
            className={fieldButtonClass('sphere')}
          >
            {sphere || '0.00'}
          </button>

          <span className="text-xs text-muted-foreground">/</span>

          <button
            type="button"
            onClick={() => toggleSign('cylinder')}
            className="h-7 w-8 rounded border border-border bg-white text-sm font-mono hover:bg-muted"
          >
            {cylSign}
          </button>
          <button
            type="button"
            onClick={() => handleFieldClick('cylinder')}
            onMouseEnter={() => handleFieldHover('cylinder')}
            onMouseLeave={handleFieldLeave}
            className={fieldButtonClass('cylinder')}
          >
            {cylinder || '0.00'}
          </button>

          <span className="text-xs text-muted-foreground">x</span>

          <button
            type="button"
            onClick={() => handleFieldClick('axis')}
            onMouseEnter={() => handleFieldHover('axis')}
            onMouseLeave={handleFieldLeave}
            className={fieldButtonClass('axis')}
          >
            {axis || '180'}
          </button>

          <span className="text-xs text-muted-foreground">ADD</span>
          <button
            type="button"
            onClick={() => toggleSign('add')}
            className="h-7 w-8 rounded border border-border bg-white text-sm font-mono hover:bg-muted"
          >
            {addSign}
          </button>
          <button
            type="button"
            onClick={() => handleFieldClick('add')}
            onMouseEnter={() => handleFieldHover('add')}
            onMouseLeave={handleFieldLeave}
            className={fieldButtonClass('add')}
          >
            {add || '0.00'}
          </button>

          {showExtras && (
            <>
              <span className="text-xs text-muted-foreground">VTX</span>
              <button
                type="button"
                onClick={() => handleFieldClick('vertex')}
                onMouseEnter={() => handleFieldHover('vertex')}
                onMouseLeave={handleFieldLeave}
                className={fieldButtonClass('vertex')}
              >
                {vertex || '--'}
              </button>

              <span className="text-xs text-muted-foreground">PR</span>
              <button
                type="button"
                onClick={() => handleFieldClick('prism')}
                onMouseEnter={() => handleFieldHover('prism')}
                onMouseLeave={handleFieldLeave}
                className={fieldButtonClass('prism')}
              >
                {prism || '--'}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowExtras((prev) => !prev)}
            className="ml-auto h-7 rounded border border-border bg-white px-2 text-xs text-muted-foreground hover:bg-muted"
          >
            {showExtras ? 'Options -' : 'Options +'}
          </button>
        </div>

        {activeField && (
          <div 
            className="absolute left-0 top-full mt-1 z-50 rounded-md border border-border bg-white p-2"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            onMouseEnter={() => { if (!isLocked) setActiveField(activeField); }}
            onMouseLeave={handleFieldLeave}
          >
            <div className="text-[10px] text-muted-foreground mb-1 text-center uppercase font-medium flex items-center justify-center gap-1">
              <span>{activeField === 'sphere' ? 'Sphère' : activeField === 'cylinder' ? 'Cylindre' : activeField === 'axis' ? 'Axe' : activeField === 'add' ? 'Addition' : activeField === 'vertex' ? 'Vertex' : 'Prisme'}</span>
              {isLocked && <span className="text-primary">🔒</span>}
            </div>
            <div className="flex gap-px">
              <div className="grid grid-cols-3 gap-px">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); appendDigit(num); }}
                    className="w-6 h-6 text-xs font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200"
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="grid grid-rows-3 gap-px ml-px">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); backspaceActive(); }}
                  className="w-6 h-6 text-xs font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200"
                  aria-label="Retour"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); appendDigit(0); }}
                  className="w-6 h-6 text-xs font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200"
                >
                  0
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); clearActive(); }}
                  className="w-6 h-6 text-xs font-medium rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200"
                >
                  C
                </button>
              </div>
            </div>
          </div>
        )}
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
            vertex={refraction.vertexOD}
            prism={refraction.prismOD}
            onChange={(v) => onChange({ rxOD: v })}
            onAddChange={(v) => onChange({ addOD: v })}
            onVertexChange={(v) => onChange({ vertexOD: v })}
            onPrismChange={(v) => onChange({ prismOD: v })}
          />
          <RxPicker
            label="OS"
            value={refraction.rxOS}
            add={refraction.addOS}
            vertex={refraction.vertexOS}
            prism={refraction.prismOS}
            onChange={(v) => onChange({ rxOS: v })}
            onAddChange={(v) => onChange({ addOS: v })}
            onVertexChange={(v) => onChange({ vertexOS: v })}
            onPrismChange={(v) => onChange({ prismOS: v })}
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
