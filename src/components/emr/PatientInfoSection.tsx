import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PatientInfo, PatientSession } from '@/types/emr';
import { CollapsibleNotes } from './CollapsibleNotes';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { Empty } from '@/print/previewComponents';

interface PatientInfoSectionProps {
  patientInfo: PatientInfo;
  onChange: (updates: Partial<PatientInfo>) => void;
  session?: PatientSession;
}

export function PatientInfoSection({ patientInfo, onChange }: PatientInfoSectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeaderWithPreview title="Information du Patient" preview={<Empty />} />
      <div className="grid gap-2">
        <div className="space-y-1">
          <Label htmlFor="patient-name" className="text-xs text-muted-foreground">
            Nom du Patient
          </Label>
          <Input
            id="patient-name"
            value={patientInfo.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Entrer le nom du patient"
            className="h-8 text-sm"
          />
        </div>
      </div>

      <CollapsibleNotes
        id="patient-info-notes"
        value={patientInfo.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes additionnelles..."
      />
    </div>
  );
}
