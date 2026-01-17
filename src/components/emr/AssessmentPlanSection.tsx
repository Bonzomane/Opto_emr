import { AssessmentPlan, RefractionData } from '@/types/emr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CollapsibleNotes } from './CollapsibleNotes';
import { cn } from '@/lib/utils';
import { parseRxNumbers } from '@/lib/rxFormat';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { AssessmentPlanDisplay } from '@/print/sectionDisplays';

interface AssessmentPlanSectionProps {
  assessmentPlan: AssessmentPlan;
  onChange: (updates: Partial<AssessmentPlan>) => void;
  refraction?: RefractionData;
}

// Generate automatic diagnosis based on refraction
function generateAutoDiagnosis(refraction: RefractionData): string[] {
  const diagnoses: string[] = [];
  
  const rxOD = parseRxNumbers(refraction.rxOD);
  const rxOS = parseRxNumbers(refraction.rxOS);
  const addOD = parseFloat(refraction.addOD) || 0;
  const addOS = parseFloat(refraction.addOS) || 0;
  
  // Check for myopia (negative sphere)
  const myopiaOD = rxOD.sph !== null && rxOD.sph < -0.25;
  const myopiaOS = rxOS.sph !== null && rxOS.sph < -0.25;
  if (myopiaOD || myopiaOS) {
    const eyes = myopiaOD && myopiaOS ? 'OU' : myopiaOD ? 'OD' : 'OS';
    const severity = getSeverity(Math.min(rxOD.sph ?? 0, rxOS.sph ?? 0), 'myopia');
    diagnoses.push(`Myopie ${severity} ${eyes}`);
  }
  
  // Check for hyperopia (positive sphere)
  const hyperOD = rxOD.sph !== null && rxOD.sph > 0.25;
  const hyperOS = rxOS.sph !== null && rxOS.sph > 0.25;
  if (hyperOD || hyperOS) {
    const eyes = hyperOD && hyperOS ? 'OU' : hyperOD ? 'OD' : 'OS';
    const severity = getSeverity(Math.max(rxOD.sph ?? 0, rxOS.sph ?? 0), 'hyperopia');
    diagnoses.push(`Hypermétropie ${severity} ${eyes}`);
  }
  
  // Check for astigmatism (cylinder present)
  const astigOD = rxOD.cyl !== null && Math.abs(rxOD.cyl) > 0.25;
  const astigOS = rxOS.cyl !== null && Math.abs(rxOS.cyl) > 0.25;
  if (astigOD || astigOS) {
    const eyes = astigOD && astigOS ? 'OU' : astigOD ? 'OD' : 'OS';
    const severity = getSeverity(Math.max(Math.abs(rxOD.cyl ?? 0), Math.abs(rxOS.cyl ?? 0)), 'astigmatism');
    diagnoses.push(`Astigmatisme ${severity} ${eyes}`);
  }
  
  // Check for presbyopia (addition present)
  if (addOD > 0.5 || addOS > 0.5) {
    diagnoses.push('Presbytie');
  }
  
  // Emmetropia if no significant error
  if (diagnoses.length === 0) {
    diagnoses.push('Emmétropie');
  }
  
  return diagnoses;
}

function getSeverity(value: number, type: 'myopia' | 'hyperopia' | 'astigmatism'): string {
  const absVal = Math.abs(value);
  if (type === 'myopia') {
    if (absVal <= 3) return 'légère';
    if (absVal <= 6) return 'modérée';
    return 'forte';
  } else if (type === 'hyperopia') {
    if (absVal <= 2) return 'légère';
    if (absVal <= 5) return 'modérée';
    return 'forte';
  } else { // astigmatism
    if (absVal <= 1) return 'léger';
    if (absVal <= 2) return 'modéré';
    return 'fort';
  }
}

// Quick tag button component
function QuickTag({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 text-xs rounded border bg-muted/50 border-border text-foreground hover:bg-muted transition-colors"
    >
      {label}
    </button>
  );
}

// Common treatment plan options
const PLAN_TAGS = [
  'Nouvelle Rx lunettes',
  'Rx progressives',
  'Rx SV VL',
  'Rx SV VP',
  'Rx contrôle myopie',
  'Port constant',
  'LC souples',
  'Larmes artificielles PRN',
  'Compresses chaudes BID',
  'Hygiène palpébrale',
  'Référence ophtalmo',
  'Pas de changement Rx',
  'Étiologie expliquée',
  'Explications hygiène visuelle données',
];

// Common follow-up intervals
const FOLLOWUP_TAGS = [
  '1 an',
  '2 ans',
  '6 mois',
  '3 mois',
  '1 mois',
  'PRN',
  'Post-op 1 sem',
];

export function AssessmentPlanSection({ assessmentPlan, onChange, refraction }: AssessmentPlanSectionProps) {
  const handleAutoDiagnosis = () => {
    if (!refraction) return;
    const autoDiagnoses = generateAutoDiagnosis(refraction);
    const existingDiagnosis = assessmentPlan.diagnosis.trim();
    const newDiagnosis = existingDiagnosis 
      ? `${autoDiagnoses.join('\n')}\n${existingDiagnosis}`
      : autoDiagnoses.join('\n');
    onChange({ diagnosis: newDiagnosis });
  };
  return (
    <div className="space-y-6">
      <SectionHeaderWithPreview
        title="Évaluation et Plan"
        preview={
          <AssessmentPlanDisplay
            diagnosis={assessmentPlan.diagnosis}
            plan={assessmentPlan.plan}
            nextVisit={assessmentPlan.nextVisit}
            notes={assessmentPlan.notes}
          />
        }
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Diagnostic</Label>
          {refraction && (
            <button
              type="button"
              onClick={handleAutoDiagnosis}
              className={cn(
                'px-3 py-1 text-xs rounded border transition-colors',
                'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
              )}
            >
              Auto Dx (Rx)
            </button>
          )}
        </div>
        <Textarea
          value={assessmentPlan.diagnosis}
          onChange={(e) => onChange({ diagnosis: e.target.value })}
          placeholder="Myopie, astigmatisme, presbytie...&#10;Sécheresse oculaire légère...&#10;Cataracte débutante OS..."
          className="min-h-[100px] text-sm"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Plan de Traitement</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {PLAN_TAGS.map((tag) => (
            <QuickTag 
              key={tag} 
              label={tag} 
              onClick={() => {
                const current = assessmentPlan.plan.trim();
                const newPlan = current ? `${current}\n${tag}` : tag;
                onChange({ plan: newPlan });
              }} 
            />
          ))}
        </div>
        <Textarea
          value={assessmentPlan.plan}
          onChange={(e) => onChange({ plan: e.target.value })}
          placeholder="Nouvelle Rx lunettes progressives...&#10;Larmes artificielles QID...&#10;Référence ophtalmo pour cataracte..."
          className="min-h-[100px] text-sm"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Prochaine Visite</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {FOLLOWUP_TAGS.map((tag) => (
            <QuickTag 
              key={tag} 
              label={tag} 
              onClick={() => onChange({ nextVisit: tag })} 
            />
          ))}
        </div>
        <Input
          value={assessmentPlan.nextVisit}
          onChange={(e) => onChange({ nextVisit: e.target.value })}
          placeholder="1 an / 6 mois / PRN..."
        />
      </div>

      <CollapsibleNotes
        id="assessment-plan-notes"
        value={assessmentPlan.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes supplémentaires..."
      />
    </div>
  );
}
