import React from 'react';
import { PatientSession } from '@/types/emr';
import { cn } from '@/lib/utils';
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
  AssessmentPlanDisplay,
} from '@/print/sectionDisplays';
import {
  ComplaintDisplay,
  CurrentRxDisplay,
  FamilyHistoryDisplay,
  PersonalGeneralHealthDisplay,
  PersonalOcularHealthDisplay,
  VisitDisplay,
  VisualNeedsDisplay,
} from '@/print/caseHistoryDisplays';

interface LivePreviewPanelProps {
  session: PatientSession;
  activeSection: string;
  className?: string;
}

// Section title mapping
const SECTION_TITLES: Record<string, string> = {
  'case-history': 'Histoire de Cas',
  'preliminary-tests': 'Tests Préliminaires',
  'binocular-vision': 'Vision Binoculaire',
  'objective-refraction': 'Réfraction Objective',
  'refraction': 'Réfraction Subjective',
  'anterior-segment': 'Segment Antérieur',
  'posterior-segment': 'Segment Postérieur',
  'diagnostic-tests': 'Tests Diagnostiques',
  'assessment-plan': 'Évaluation & Plan',
};

export function LivePreviewPanel({ session, activeSection, className }: LivePreviewPanelProps) {
  const renderPreview = () => {
    switch (activeSection) {
      case 'case-history':
        return (
          <div className="space-y-4">
            <PreviewSection title="Visite">
              <VisitDisplay 
                reasonForVisit={session.reasonForVisit} 
                lastExamInfo={session.lastExamInfo} 
              />
            </PreviewSection>
            <PreviewSection title="Rx Actuelle">
              <CurrentRxDisplay currentRx={session.currentRx} />
            </PreviewSection>
            <PreviewSection title="Besoins Visuels">
              <VisualNeedsDisplay visualNeeds={session.visualNeeds} />
            </PreviewSection>
            <PreviewSection title="Plainte">
              <ComplaintDisplay complaint={session.complaint} />
            </PreviewSection>
            <PreviewSection title="Santé Oculaire Perso.">
              <PersonalOcularHealthDisplay personalOcularHealth={session.personalOcularHealth} />
            </PreviewSection>
            <PreviewSection title="Santé Générale Perso.">
              <PersonalGeneralHealthDisplay personalGeneralHealth={session.personalGeneralHealth} />
            </PreviewSection>
            <PreviewSection title="Antécédents Familiaux">
              <FamilyHistoryDisplay 
                familyOcularHealth={session.familyOcularHealth} 
                familyGeneralHealth={session.familyGeneralHealth} 
              />
            </PreviewSection>
          </div>
        );

      case 'preliminary-tests':
        return <PrelimTestsDisplay tests={session.preliminaryTests} />;

      case 'binocular-vision':
        return <BinoDisplay bino={session.binocularVision} />;

      case 'objective-refraction':
        return <ObjectiveRefractionDisplay obj={session.objectiveRefraction} />;

      case 'refraction':
        return <RefractionDisplay rx={session.refraction} />;

      case 'anterior-segment':
        return <SegmentDisplay data={session.anteriorSegment} />;

      case 'posterior-segment':
        return <SegmentDisplay data={session.posteriorSegment} />;

      case 'diagnostic-tests':
        return (
          <div className="space-y-4">
            <PreviewSection title="PIO">
              <IOPDisplay iop={session.iop} />
            </PreviewSection>
            <PreviewSection title="Gouttes">
              <DropsDisplay drops={session.drops} />
            </PreviewSection>
            <PreviewSection title="Champs Visuels">
              <VisualFieldsDisplay vf={session.visualFields} />
            </PreviewSection>
            <PreviewSection title="OCT">
              <OCTDisplay oct={session.oct} />
            </PreviewSection>
          </div>
        );

      case 'assessment-plan':
        return (
          <AssessmentPlanDisplay
            diagnosis={session.assessmentPlan.diagnosis}
            plan={session.assessmentPlan.plan}
            nextVisit={session.assessmentPlan.nextVisit}
            notes={session.assessmentPlan.notes}
          />
        );

      default:
        return (
          <p className="text-zinc-400 text-xs italic">
            Sélectionnez une section pour voir l'aperçu.
          </p>
        );
    }
  };

  const sectionTitle = SECTION_TITLES[activeSection] || 'Aperçu';

  return (
    <div className={cn('flex flex-col h-full bg-zinc-50 border-l border-zinc-200', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-200 bg-white">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Aperçu Impression
        </h3>
        <p className="text-sm font-medium text-zinc-800 mt-0.5">{sectionTitle}</p>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
          <div className="text-[10px] leading-relaxed">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for sub-sections within the preview
function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-zinc-100 pb-2 last:border-0 last:pb-0">
      <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
        {title}
      </span>
      {children}
    </div>
  );
}
