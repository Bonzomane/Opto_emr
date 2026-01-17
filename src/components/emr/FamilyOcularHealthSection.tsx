import { Label } from '@/components/ui/label';
import { FamilyOcularHealth, PatientSession } from '@/types/emr';
import { ConditionGrid } from './ConditionGrid';
import { CollapsibleNotes } from './CollapsibleNotes';
import { FAMILY_OCULAR_CONDITIONS } from '@/data/medicalDefinitions';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { FamilyHistoryDisplay } from '@/print/caseHistoryDisplays';

interface FamilyOcularHealthSectionProps {
  familyOcularHealth: FamilyOcularHealth;
  onChange: (updates: Partial<FamilyOcularHealth>) => void;
  session?: PatientSession;
}

export function FamilyOcularHealthSection({ familyOcularHealth, onChange, session }: FamilyOcularHealthSectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeaderWithPreview
        title="Santé Oculaire Familiale"
        preview={
          <FamilyHistoryDisplay
            familyOcularHealth={familyOcularHealth}
            familyGeneralHealth={session?.familyGeneralHealth ?? { conditions: [], notes: '' }}
          />
        }
      />

      <div>
        <Label className="text-sm font-medium">Antécédents Oculaires Familiaux</Label>
        <div className="mt-2">
          <ConditionGrid
            definitions={FAMILY_OCULAR_CONDITIONS}
            items={familyOcularHealth.conditions}
            onChange={(conditions) => onChange({ conditions })}
          />
        </div>
      </div>

      <CollapsibleNotes
        id="family-ocular-notes"
        value={familyOcularHealth.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Préciser les détails..."
      />
    </div>
  );
}
