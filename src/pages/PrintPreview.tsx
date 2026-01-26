import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  PatientSession
} from '@/types/emr';
 
import {
  BinoDisplay,
  DropsDisplay,
  IOPDisplay,
  ObjectiveRefractionDisplay,
  OCTDisplay,
  PrelimTestsDisplay,
  RefractionDisplay,
  SegmentDisplay,
  VisualFieldsDisplay,
} from '@/print/sectionDisplays';
import {
  AllergiesDisplay,
  ComplaintDisplay,
  CurrentRxDisplay,
  FamilyHistoryDisplay,
  PersonalGeneralHealthDisplay,
  PersonalOcularHealthDisplay,
  VisitDisplay,
  VisualNeedsDisplay,
} from '@/print/caseHistoryDisplays';
import { Empty, Note } from '@/print/previewComponents';

export default function PrintPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session as PatientSession | undefined;

  const handleBack = () => {
    navigate(-1); // Go back to previous page (preserves section state)
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500">Aucune donnée patient à prévisualiser.</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au DME
        </Button>
      </div>
    );
  }

  const { 
    reasonForVisit, 
    lastExamInfo, 
    currentRx, 
    visualNeeds,
    complaint, 
    personalOcularHealth, 
    personalGeneralHealth, 
    familyOcularHealth, 
    familyGeneralHealth,
    preliminaryTests,
    binocularVision,
    objectiveRefraction,
    refraction,
    anteriorSegment,
    posteriorSegment,
    iop,
    drops,
    visualFields,
    oct,
    assessmentPlan,
  } = session;

  const hasRx = !currentRx.hasNoRx;

  return (
    <div className="min-h-screen bg-zinc-300 print:bg-white">
      {/* Toolbar */}
      <div className="print:hidden bg-white border-b border-zinc-200 px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />Retour
        </Button>
        <Button onClick={() => window.print()} size="sm">
          <Printer className="h-4 w-4 mr-2" />Imprimer
        </Button>
      </div>

      {/* Page */}
      <div className="flex justify-center p-4 print:p-0">
        <div className="print-page bg-white w-[8.5in] min-h-[11in] shadow-lg print:shadow-none p-6 print:p-4 text-[11px] leading-tight">
          
          {/* Header Row with Sticker Space */}
          <div className="flex justify-between items-start border-b border-zinc-300 pb-2 mb-3">
            <div className="pt-2">
              <h1 className="text-sm font-bold uppercase tracking-wide">Histoire de Cas</h1>
              <div className="text-[10px] text-zinc-500 mt-1">
                {new Date().toLocaleDateString('fr-CA')}
              </div>
            </div>
            {/* Patient Sticker Space */}
            <div className="w-[200px] h-[70px] border border-dashed border-zinc-300 rounded flex items-center justify-center text-[9px] text-zinc-400 print:border-zinc-200">
              Étiquette patient
            </div>
          </div>

          {/* Content Grid - 4 columns for compact case history */}
          <div className="grid grid-cols-4 gap-x-3 gap-y-1 text-[10px]">
            
            {/* === COLUMN 1 === */}
            <div className="space-y-1">
              <Section title="Visite">
                <VisitDisplay reasonForVisit={reasonForVisit} lastExamInfo={lastExamInfo} />
              </Section>
              
              <Section title="Rx Actuel">
                <CurrentRxDisplay currentRx={currentRx} />
                {currentRx.notes && <Note text={currentRx.notes} />}
              </Section>

              <Section title="Plainte">
                <ComplaintDisplay complaint={complaint} />
              </Section>
            </div>

            {/* === COLUMN 2 === */}
            <div className="space-y-1">
              <Section title="Santé Oculaire">
                <PersonalOcularHealthDisplay personalOcularHealth={personalOcularHealth} />
              </Section>

              <Section title="Allergies">
                <AllergiesDisplay personalGeneralHealth={personalGeneralHealth} />
              </Section>
            </div>

            {/* === COLUMN 3 === */}
            <div className="space-y-1">
              <Section title="Santé Générale">
                <PersonalGeneralHealthDisplay personalGeneralHealth={personalGeneralHealth} />
              </Section>
            </div>

            {/* === COLUMN 4 === */}
            <div className="space-y-1">
              <Section title="ATCD Familiaux">
                <FamilyHistoryDisplay
                  familyOcularHealth={familyOcularHealth}
                  familyGeneralHealth={familyGeneralHealth}
                />
              </Section>

              {(visualNeeds?.needs || visualNeeds?.notes) && (
                <Section title="Besoin Visuel">
                  <VisualNeedsDisplay visualNeeds={visualNeeds} />
                </Section>
              )}
            </div>
          </div>

          {/* ========== EXAMEN ========== */}
          <div className="mt-4 pt-2 border-t-2 border-zinc-400">
            <h2 className="text-sm font-bold uppercase tracking-wide mb-2">Examen</h2>
            
            {/* Exam content: 4 columns with segments stacked on the right */}
            <div className="grid grid-cols-4 gap-x-3 gap-y-2">
              {/* Column 1: Tests Prélim */}
              <Section title="Tests Prélim.">
                {preliminaryTests ? <PrelimTestsDisplay tests={preliminaryTests} /> : <Empty />}
              </Section>

              {/* Column 2: Vision Bino + PIO/Gouttes */}
              <div className="space-y-2">
                <Section title="Vision Bino.">
                  {binocularVision ? <BinoDisplay bino={binocularVision} /> : <Empty />}
                </Section>
                <Section title="PIO">
                  {iop ? <IOPDisplay iop={iop} /> : <Empty />}
                </Section>
                {drops && (drops.dilpiUsed || drops.fluorescein || drops.anesthetic) && (
                  <Section title="Gouttes">
                    <DropsDisplay drops={drops} />
                  </Section>
                )}
                <Section title="CV">
                  {visualFields ? <VisualFieldsDisplay vf={visualFields} /> : <Empty />}
                </Section>
                {oct && (oct.type || oct.machine || oct.resultOD || oct.resultOS) && (
                  <Section title="OCT">
                    <OCTDisplay oct={oct} />
                  </Section>
                )}
              </div>

              {/* Column 3: Réfractions */}
              <div className="space-y-2">
                <Section title="Réfraction Obj.">
                  {objectiveRefraction ? <ObjectiveRefractionDisplay obj={objectiveRefraction} /> : <Empty />}
                </Section>
                <Section title="Réfraction">
                  {refraction ? <RefractionDisplay rx={refraction} /> : <Empty />}
                </Section>
              </div>

              {/* Column 4: Segments stacked */}
              <div className="space-y-2">
                <Section title="Segment Antérieur">
                  {anteriorSegment ? <SegmentDisplay data={anteriorSegment} /> : <Empty />}
                </Section>
                <Section title="Segment Postérieur">
                  {posteriorSegment ? <SegmentDisplay data={posteriorSegment} /> : <Empty />}
                </Section>
              </div>
            </div>
          </div>

          {/* ========== ÉVALUATION & PLAN ========== */}
          <div className="mt-5 pt-3 border-t-2 border-zinc-400">
            <h2 className="text-sm font-bold uppercase tracking-wide mb-3">Évaluation & Plan</h2>
            
            <div className="grid grid-cols-3 gap-x-6">
              {/* Diagnosis */}
              <Section title="Diagnostic">
                {assessmentPlan?.diagnosis ? (
                  <p className="text-[10px] whitespace-pre-line">{assessmentPlan.diagnosis}</p>
                ) : <Empty />}
              </Section>

              {/* Plan */}
              <Section title="Plan">
                {assessmentPlan?.plan ? (
                  <p className="text-[10px] whitespace-pre-line">{assessmentPlan.plan}</p>
                ) : <Empty />}
              </Section>

              {/* Next Visit */}
              <Section title="Suivi">
                {assessmentPlan?.nextVisit ? (
                  <p className="text-[10px]">{assessmentPlan.nextVisit}</p>
                ) : <Empty />}
                {assessmentPlan?.notes && <Note text={assessmentPlan.notes} />}
              </Section>
            </div>
          </div>

          {/* Footer */}
          <div className="print-footer mt-8 pt-4 border-t border-zinc-200 flex justify-end">
            <p className="text-[10px] text-zinc-500">
              <span className="font-medium text-zinc-700">Dr. Derdour Noreddine</span>, O.D. (322512)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Compact Sub-components
// ============================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 border-b border-zinc-200 pb-0.5 mb-1">
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}


