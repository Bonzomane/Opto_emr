import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LastExamInfo, LastExamPeriod, LAST_EXAM_LABELS, PatientSession } from '@/types/emr';
import { CollapsibleNotes } from './CollapsibleNotes';
import { cn } from '@/lib/utils';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { VisitDisplay } from '@/print/caseHistoryDisplays';

interface LastExamSectionProps {
  lastExamInfo: LastExamInfo;
  onChange: (updates: Partial<LastExamInfo>) => void;
  session?: PatientSession;
}

const LAST_EXAM_PERIODS = Object.entries(LAST_EXAM_LABELS) as [LastExamPeriod, string][];

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
      <SectionHeaderWithPreview
        title="Dernier Examen de la Vue"
        preview={
          <VisitDisplay
            reasonForVisit={session?.reasonForVisit ?? { visitType: null, notes: '' }}
            lastExamInfo={lastExamInfo}
          />
        }
      />

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {LAST_EXAM_PERIODS.map(([period, label]) => (
            <button
              key={period}
              type="button"
              onClick={() => handlePeriodClick(period)}
              className={cn(
                'px-3 py-2 text-xs rounded-md border transition-all duration-200',
                lastExamInfo.lastExamPeriod === period
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/50 border-border text-foreground hover:bg-muted'
              )}
            >
              {label}
            </button>
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
