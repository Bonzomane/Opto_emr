import { Label } from '@/components/ui/label';
import { FamilyGeneralHealth, PatientSession } from '@/types/emr';
import { ConditionGrid } from './ConditionGrid';
import { CollapsibleNotes } from './CollapsibleNotes';
import { FAMILY_GENERAL_CONDITIONS } from '@/data/medicalDefinitions';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { FamilyHistoryDisplay } from '@/print/caseHistoryDisplays';

interface FamilyGeneralHealthSectionProps {
  familyGeneralHealth: FamilyGeneralHealth;
  onChange: (updates: Partial<FamilyGeneralHealth>) => void;
  session?: PatientSession;
}

export function FamilyGeneralHealthSection({ familyGeneralHealth, onChange, session }: FamilyGeneralHealthSectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeaderWithPreview
        title="Santé Générale Familiale"
        preview={
          <FamilyHistoryDisplay
            familyOcularHealth={session?.familyOcularHealth ?? { conditions: [], notes: '' }}
            familyGeneralHealth={familyGeneralHealth}
          />
        }
      />

      <div>
        <Label className="text-sm font-medium">Antécédents Médicaux Familiaux</Label>
        <div className="mt-2">
          <ConditionGrid
            definitions={FAMILY_GENERAL_CONDITIONS}
            items={familyGeneralHealth.conditions}
            onChange={(conditions) => onChange({ conditions })}
          />
        </div>
      </div>

      <CollapsibleNotes
        id="family-general-notes"
        value={familyGeneralHealth.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Préciser les détails..."
      />
    </div>
  );
}
