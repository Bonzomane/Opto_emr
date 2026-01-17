import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Complaint, PatientSession } from '@/types/emr';
import { ConditionGrid } from './ConditionGrid';
import { CollapsibleNotes } from './CollapsibleNotes';
import { SYMPTOMS } from '@/data/medicalDefinitions';
import { SectionHeader } from './SectionHeader';

interface ComplaintSectionProps {
  complaint: Complaint;
  onChange: (updates: Partial<Complaint>) => void;
  session?: PatientSession;
}

export function ComplaintSection({ complaint, onChange }: ComplaintSectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Plaintes" />

      <div className="space-y-1">
        <Label htmlFor="chief-complaint" className="text-xs text-muted-foreground">
          Description
        </Label>
        <Textarea
          id="chief-complaint"
          value={complaint.chiefComplaint}
          onChange={(e) => onChange({ chiefComplaint: e.target.value })}
          placeholder="Décrire la plainte principale du patient..."
          className="h-16 text-sm"
        />
      </div>

      <div>
        <ConditionGrid
          definitions={SYMPTOMS}
          items={complaint.symptoms}
          onChange={(symptoms) => onChange({ symptoms })}
        />
      </div>

      <CollapsibleNotes
        id="complaint-notes"
        value={complaint.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Autres détails..."
      />
    </div>
  );
}
