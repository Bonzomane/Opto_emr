import { Label } from '@/components/ui/label';
import { PersonalOcularHealth, PatientSession } from '@/types/emr';
import { ConditionGrid } from './ConditionGrid';
import { CollapsibleNotes } from './CollapsibleNotes';
import { OCULAR_CONDITIONS, OCULAR_SURGERIES } from '@/data/medicalDefinitions';
import { SectionHeader } from './SectionHeader';

interface PersonalOcularHealthSectionProps {
  personalOcularHealth: PersonalOcularHealth;
  onChange: (updates: Partial<PersonalOcularHealth>) => void;
  session?: PatientSession;
}

export function PersonalOcularHealthSection({ personalOcularHealth, onChange }: PersonalOcularHealthSectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Santé Oculaire Personnelle" />

      <div>
        <Label className="text-sm font-medium">Conditions Oculaires</Label>
        <div className="mt-2">
          <ConditionGrid
            definitions={OCULAR_CONDITIONS}
            items={personalOcularHealth.conditions}
            onChange={(conditions) => onChange({ conditions })}
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Chirurgies Oculaires</Label>
        <div className="mt-2">
          <ConditionGrid
            definitions={OCULAR_SURGERIES}
            items={personalOcularHealth.surgeries}
            onChange={(surgeries) => onChange({ surgeries })}
          />
        </div>
      </div>

      <CollapsibleNotes
        id="ocular-notes"
        value={personalOcularHealth.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Autres détails..."
      />
    </div>
  );
}
