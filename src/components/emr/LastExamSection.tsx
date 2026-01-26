import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LastExamInfo, LastExamPeriod, PatientSession } from '@/types/emr';
import { LABELS } from '@/constants/labels';
import { CollapsibleNotes } from './CollapsibleNotes';
import { SectionHeader } from './SectionHeader';
import { QuickSelectButton } from './QuickSelectButton';

interface LastExamSectionProps {
  lastExamInfo: LastExamInfo;
  onChange: (updates: Partial<LastExamInfo>) => void;
  session?: PatientSession;
}

const LAST_EXAM_PERIODS = Object.entries(LABELS.lastExam) as [LastExamPeriod, string][];

export function LastExamSection({ lastExamInfo, onChange, session }: LastExamSectionProps) {
  const handlePeriodClick = (period: LastExamPeriod) => {
    if (lastExamInfo.lastExamPeriod === period) {
      onChange({ lastExamPeriod: null });
    } else {
      onChange({ lastExamPeriod: period });
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Dernier Examen de la Vue" />

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {LAST_EXAM_PERIODS.map(([period, label]) => (
            <QuickSelectButton
              key={period}
              label={label}
              selected={lastExamInfo.lastExamPeriod === period}
              onClick={() => handlePeriodClick(period)}
              size="md"
            />
          ))}
        </div>

        <div className="max-w-[200px]">
          <Label htmlFor="previous-examiner" className="text-xs text-muted-foreground">
            Examinateur précédent
          </Label>
          <Input
            id="previous-examiner"
            value={lastExamInfo.previousExaminer}
            onChange={(e) => onChange({ previousExaminer: e.target.value })}
            placeholder="Nom"
            className="h-9 text-sm mt-1"
          />
        </div>
      </div>

      <CollapsibleNotes
        id="last-exam-notes"
        value={lastExamInfo.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes additionnelles..."
      />
    </div>
  );
}
