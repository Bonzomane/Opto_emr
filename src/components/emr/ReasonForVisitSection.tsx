import { ReasonForVisit, VisitType, PatientSession } from '@/types/emr';
import { LABELS } from '@/constants/labels';
import { DropdownButton, DropdownOption } from './DropdownButton';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeader } from './SectionHeader';

interface ReasonForVisitSectionProps {
  reasonForVisit: ReasonForVisit;
  onChange: (updates: Partial<ReasonForVisit>) => void;
  session?: PatientSession;
}

// Common types - shown as simple buttons
const COMMON_TYPES: VisitType[] = ['routine', 'follow-up', 'emergency', 'specific-complaint'];

// Grouped types - shown in dropdowns
const LENTILLES_TYPES: VisitType[] = ['contact-lens-fitting', 'contact-lens-verification'];
const CHIRURGIE_TYPES: VisitType[] = ['pre-operative', 'post-operative'];
const SPECIALISE_TYPES: VisitType[] = ['pediatric', 'low-vision', 'binocular-vision', 'dry-eye'];
const AUTRES_TYPES: VisitType[] = ['visual-field-only', 'glasses-verification'];

export function ReasonForVisitSection({ reasonForVisit, onChange, session }: ReasonForVisitSectionProps) {
  const selected = reasonForVisit.visitType;

  const getGroupLabel = (types: VisitType[]): string | undefined => {
    if (selected && types.includes(selected)) {
      return LABELS.visitType[selected];
    }
    return undefined;
  };

  const handleSelect = (type: VisitType) => {
    onChange({ visitType: type });
  };

  const handleDeselect = () => {
    onChange({ visitType: null });
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Raison de la Visite" />

      <div className="flex flex-wrap gap-2">
        {/* Common types as simple buttons */}
        {COMMON_TYPES.map((type) => (
          <QuickSelectButton
            key={type}
            label={LABELS.visitType[type]}
            selected={selected === type}
            onClick={() => selected === type ? handleDeselect() : handleSelect(type)}
            size="md"
          />
        ))}

        {/* Lentilles dropdown */}
        <DropdownButton
          label="Lentilles"
          selectedLabel={getGroupLabel(LENTILLES_TYPES)}
        >
          {LENTILLES_TYPES.map((type) => (
            <DropdownOption
              key={type}
              label={LABELS.visitType[type]}
              selected={selected === type}
              onSelect={() => handleSelect(type)}
              onDeselect={handleDeselect}
            />
          ))}
        </DropdownButton>

        {/* Chirurgie dropdown */}
        <DropdownButton
          label="Chirurgie"
          selectedLabel={getGroupLabel(CHIRURGIE_TYPES)}
        >
          {CHIRURGIE_TYPES.map((type) => (
            <DropdownOption
              key={type}
              label={LABELS.visitType[type]}
              selected={selected === type}
              onSelect={() => handleSelect(type)}
              onDeselect={handleDeselect}
            />
          ))}
        </DropdownButton>

        {/* Spécialisé dropdown */}
        <DropdownButton
          label="Spécialisé"
          selectedLabel={getGroupLabel(SPECIALISE_TYPES)}
        >
          {SPECIALISE_TYPES.map((type) => (
            <DropdownOption
              key={type}
              label={LABELS.visitType[type]}
              selected={selected === type}
              onSelect={() => handleSelect(type)}
              onDeselect={handleDeselect}
            />
          ))}
        </DropdownButton>

        {/* Autres dropdown */}
        <DropdownButton
          label="Autres"
          selectedLabel={getGroupLabel(AUTRES_TYPES)}
        >
          {AUTRES_TYPES.map((type) => (
            <DropdownOption
              key={type}
              label={LABELS.visitType[type]}
              selected={selected === type}
              onSelect={() => handleSelect(type)}
              onDeselect={handleDeselect}
            />
          ))}
        </DropdownButton>
      </div>

      <CollapsibleNotes
        id="reason-for-visit-notes"
        value={reasonForVisit.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes additionnelles..."
      />
    </div>
  );
}
