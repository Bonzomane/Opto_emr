import { useState, useEffect, useRef } from 'react';
import { AppHeader } from '@/components/emr/AppHeader';
import { PatientTabs } from '@/components/emr/PatientTabs';
import { ExamSidebar } from '@/components/emr/ExamSidebar';
import { CaseHistorySection } from '@/components/emr/CaseHistorySection';
import { PreliminaryTestsSection } from '@/components/emr/PreliminaryTestsSection';
import { BinocularVisionSection } from '@/components/emr/BinocularVisionSection';
import { ObjectiveRefractionSection } from '@/components/emr/ObjectiveRefractionSection';
import { RefractionSection } from '@/components/emr/RefractionSection';
import { AnteriorSegmentSection } from '@/components/emr/AnteriorSegmentSection';
import { PosteriorSegmentSection } from '@/components/emr/PosteriorSegmentSection';
import { DiagnosticTestsSection } from '@/components/emr/DiagnosticTestsSection';
import { AssessmentPlanSection } from '@/components/emr/AssessmentPlanSection';
import { LivePreviewPanel } from '@/components/emr/LivePreviewPanel';
import { usePatientSessions } from '@/hooks/usePatientSessions';

// Normal exam results for routine examinations
const NORMAL_EXAM_DEFAULTS = {
  preliminaryTests: {
    couleurs: 'normal',
    stereoFormes: 'Normal',
    stereoCercles: 'Normal',
    stereoAnimaux: 'Normal',
    pupillesOD: 'perrla, dpar-',
    pupillesOS: 'perrla, dpar-',
    mouvements: 'souple-complet',
  },
  binocularVision: {
    coverTestVL: 'Ortho',
    coverTestVP: 'Ortho',
    maddoxVP: 'Ortho',
    filtreRougeVL: 'Fusion',
    filtreRougeVP: 'Fusion',
    ppc: 'Au nez',
  },
  anteriorSegment: {
    paupieresOD: 'Saines', paupieresOS: 'Saines',
    conjonctiveOD: 'Claire et lisse', conjonctiveOS: 'Claire et lisse',
    corneeOD: 'Claire', corneeOS: 'Claire',
    chambreAntOD: 'Calme et profonde', chambreAntOS: 'Calme et profonde',
    irisOD: 'Sain', irisOS: 'Sain',
    cristallinOD: 'Clair', cristallinOS: 'Clair',
    anglesOD: '1:1', anglesOS: '1:1',
  },
  posteriorSegment: {
    papilleOD: 'Saine, Distincte, Rosée', papilleOS: 'Saine, Distincte, Rosée',
    cdVertOD: '0.3', cdHorizOD: '0.3',
    cdVertOS: '0.3', cdHorizOS: '0.3',
    maculaOD: 'Saine', maculaOS: 'Saine',
    vaisseauxOD: '2/3-1/3', vaisseauxOS: '2/3-1/3',
    peripherieOD: 'Saine', peripherieOS: 'Saine',
    vitreOD: 'Clair', vitreOS: 'Clair',
  },
  visualFields: {
    type: 'Automatisé',
    machine: 'FDT',
    fiable: '',
    resultOD: 'Fiable, Complet',
    resultOS: 'Fiable, Complet',
  },
  iop: {
    method: 'ncr',
  },
};

const Index = () => {
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    addSession,
    closeSession,
    updateSessionField,
    clearAllSessions,
  } = usePatientSessions();
  
  // Track previous visit type to detect changes
  const prevVisitTypeRef = useRef(activeSession.reasonForVisit.visitType);
  
  // Auto-fill normal results when "routine" is selected
  useEffect(() => {
    const currentVisitType = activeSession.reasonForVisit.visitType;
    const prevVisitType = prevVisitTypeRef.current;
    
    // Only auto-fill when changing TO routine (not on initial load if already routine)
    if (currentVisitType === 'routine' && prevVisitType !== 'routine') {
      // Ask for confirmation
      if (window.confirm('Voulez-vous remplir automatiquement les résultats normaux pour un examen de routine?\n\n(Réfraction et acuité visuelle non inclus)')) {
        Object.entries(NORMAL_EXAM_DEFAULTS).forEach(([field, values]) => {
          updateSessionField(activeSessionId, field as keyof typeof NORMAL_EXAM_DEFAULTS, values);
        });
      }
    }
    
    prevVisitTypeRef.current = currentVisitType;
  }, [activeSession.reasonForVisit.visitType, activeSessionId, updateSessionField]);

  const [activeSection, setActiveSection] = useState('case-history');

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader 
        patientName={activeSession.patientInfo.name} 
        session={activeSession}
        activeSection={activeSection}
        onClearAll={clearAllSessions}
      />
      <PatientTabs
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onAddSession={addSession}
        onCloseSession={closeSession}
      />
      <div className="flex flex-1 overflow-hidden">
        <ExamSidebar
          visitType={activeSession.reasonForVisit.visitType}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
        />
        <main className="flex-1 overflow-hidden p-4">
          <div className="h-full">
            {activeSection === 'case-history' && (
              <CaseHistorySection
                session={activeSession}
                onUpdateField={(field, updates) => updateSessionField(activeSessionId, field, updates)}
              />
            )}

            {activeSection === 'preliminary-tests' && (
              <div className="h-full overflow-y-auto pr-2">
                <PreliminaryTestsSection
                  preliminaryTests={activeSession.preliminaryTests}
                  onChange={(updates) => updateSessionField(activeSessionId, 'preliminaryTests', updates)}
                />
              </div>
            )}

            {activeSection === 'binocular-vision' && (
              <div className="h-full overflow-y-auto pr-2">
                <BinocularVisionSection
                  binocularVision={activeSession.binocularVision}
                  onChange={(updates) => updateSessionField(activeSessionId, 'binocularVision', updates)}
                />
              </div>
            )}

            {activeSection === 'objective-refraction' && (
              <div className="h-full overflow-y-auto pr-2">
                <ObjectiveRefractionSection
                  objectiveRefraction={activeSession.objectiveRefraction}
                  onChange={(updates) => updateSessionField(activeSessionId, 'objectiveRefraction', updates)}
                />
              </div>
            )}

            {activeSection === 'refraction' && (
              <div className="h-full overflow-y-auto pr-2">
                <RefractionSection
                  refraction={activeSession.refraction}
                  onChange={(updates) => updateSessionField(activeSessionId, 'refraction', updates)}
                />
              </div>
            )}

            {activeSection === 'anterior-segment' && (
              <div className="h-full overflow-y-auto pr-2">
                <AnteriorSegmentSection
                  anteriorSegment={activeSession.anteriorSegment}
                  onChange={(updates) => updateSessionField(activeSessionId, 'anteriorSegment', updates)}
                />
              </div>
            )}

            {activeSection === 'posterior-segment' && (
              <div className="h-full overflow-y-auto pr-2">
                <PosteriorSegmentSection
                  posteriorSegment={activeSession.posteriorSegment}
                  onChange={(updates) => updateSessionField(activeSessionId, 'posteriorSegment', updates)}
                />
              </div>
            )}

            {activeSection === 'diagnostic-tests' && (
              <div className="h-full overflow-y-auto pr-2">
                <DiagnosticTestsSection
                  iop={activeSession.iop}
                  drops={activeSession.drops}
                  visualFields={activeSession.visualFields}
                  oct={activeSession.oct}
                  onIOPChange={(updates) => updateSessionField(activeSessionId, 'iop', updates)}
                  onDropsChange={(updates) => updateSessionField(activeSessionId, 'drops', updates)}
                  onVisualFieldsChange={(updates) => updateSessionField(activeSessionId, 'visualFields', updates)}
                  onOCTChange={(updates) => updateSessionField(activeSessionId, 'oct', updates)}
                />
              </div>
            )}

            {activeSection === 'assessment-plan' && (
              <div className="h-full overflow-y-auto pr-2">
                <AssessmentPlanSection
                  assessmentPlan={activeSession.assessmentPlan}
                  onChange={(updates) => updateSessionField(activeSessionId, 'assessmentPlan', updates)}
                  refraction={activeSession.refraction}
                />
              </div>
            )}

            {!['case-history', 'preliminary-tests', 'binocular-vision', 'visual-acuity', 'refraction', 'anterior-segment', 'posterior-segment', 'iop', 'assessment-plan'].includes(activeSection) && (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-md">
                <p className="text-sm">
                  Section "{activeSection}" à venir.
                </p>
                <p className="text-xs mt-1">
                  Cette section sera disponible dans une future mise à jour.
                </p>
              </div>
            )}
          </div>
        </main>
        
        {/* Live Preview Panel */}
        <LivePreviewPanel
          session={activeSession}
          activeSection={activeSection}
          className="w-72 shrink-0"
        />
      </div>
    </div>
  );
};

export default Index;
