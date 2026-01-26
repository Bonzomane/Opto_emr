/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from 'react';
import { 
  VisitType, 
  PatientSession,
  PatientInfo,
  ReasonForVisit,
  LastExamInfo,
  CurrentRx,
  VisualNeeds,
  Complaint,
  PersonalOcularHealth,
  PersonalGeneralHealth,
  FamilyOcularHealth,
  FamilyGeneralHealth,
  PreliminaryTests
} from '@/types/emr';
import {
  FileText,
  Glasses,
  Activity,
  Microscope,
  Sun,
  Circle,
  Stethoscope,
  TestTube,
} from 'lucide-react';

// Import case history sub-sections
import { PatientInfoSection } from '@/components/emr/PatientInfoSection';
import { ReasonForVisitSection } from '@/components/emr/ReasonForVisitSection';
import { LastExamSection } from '@/components/emr/LastExamSection';
import { CurrentRxSection } from '@/components/emr/CurrentRxSection';
import { VisualNeedsSection } from '@/components/emr/VisualNeedsSection';
import { ComplaintSection } from '@/components/emr/ComplaintSection';
import { PersonalOcularHealthSection } from '@/components/emr/PersonalOcularHealthSection';
import { PersonalGeneralHealthSection } from '@/components/emr/PersonalGeneralHealthSection';
import { FamilyOcularHealthSection } from '@/components/emr/FamilyOcularHealthSection';
import { FamilyGeneralHealthSection } from '@/components/emr/FamilyGeneralHealthSection';
import { PreliminaryTestsSection } from '@/components/emr/PreliminaryTestsSection';

// ============================================
// EXAM SECTIONS (Sidebar navigation)
// ============================================

export interface ExamSection {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  visibleFor: VisitType[] | 'all';
}

export const EXAM_SECTIONS: ExamSection[] = [
  { id: 'case-history', label: 'Histoire de Cas', icon: FileText, visibleFor: 'all' },
  { id: 'preliminary-tests', label: 'Tests Prélim.', icon: TestTube, visibleFor: 'all' },
  { id: 'binocular-vision', label: 'Vision Bino.', icon: Activity, visibleFor: 'all' },
  { id: 'objective-refraction', label: 'Réfraction Obj.', icon: Glasses, visibleFor: 'all' },
  { id: 'refraction', label: 'Réfraction Subj.', icon: Glasses, visibleFor: 'all' },
  { id: 'anterior-segment', label: 'Segment Antérieur', icon: Microscope, visibleFor: 'all' },
  { id: 'posterior-segment', label: 'Segment Postérieur', icon: Sun, visibleFor: 'all' },
  { id: 'diagnostic-tests', label: 'PIO / CV / OCT', icon: Circle, visibleFor: 'all' },
  { id: 'assessment-plan', label: 'Évaluation & Plan', icon: Stethoscope, visibleFor: 'all' },
];

export function getVisibleSections(visitType: VisitType | null): ExamSection[] {
  return EXAM_SECTIONS.filter((section) => {
    if (section.visibleFor === 'all') return true;
    if (!visitType) return section.id === 'case-history';
    return section.visibleFor.includes(visitType);
  });
}

// ============================================
// CASE HISTORY SUB-SECTIONS
// ============================================

export interface CaseHistorySubSection {
  id: string;
  label: string;
  /** The key in PatientSession that this section manages */
  dataKey: keyof PatientSession;
  /** The component to render for this section */
  component: ComponentType<{
    data: any;
    onChange: (updates: any) => void;
    session: PatientSession;
  }>;
}

// Wrapper components to normalize the prop interface
const PatientInfoWrapper = ({ data, onChange, session }: { data: PatientInfo; onChange: (u: Partial<PatientInfo>) => void; session: PatientSession }) => (
  <PatientInfoSection patientInfo={data} onChange={onChange} session={session} />
);

const ReasonForVisitWrapper = ({ data, onChange, session }: { data: ReasonForVisit; onChange: (u: Partial<ReasonForVisit>) => void; session: PatientSession }) => (
  <ReasonForVisitSection reasonForVisit={data} onChange={onChange} session={session} />
);

const LastExamWrapper = ({ data, onChange, session }: { data: LastExamInfo; onChange: (u: Partial<LastExamInfo>) => void; session: PatientSession }) => (
  <LastExamSection lastExamInfo={data} onChange={onChange} session={session} />
);

const CurrentRxWrapper = ({ data, onChange, session }: { data: CurrentRx; onChange: (u: Partial<CurrentRx>) => void; session: PatientSession }) => (
  <CurrentRxSection currentRx={data} onChange={onChange} session={session} />
);

const VisualNeedsWrapper = ({ data, onChange, session }: { data: VisualNeeds; onChange: (u: Partial<VisualNeeds>) => void; session: PatientSession }) => (
  <VisualNeedsSection visualNeeds={data} onChange={onChange} session={session} />
);

const ComplaintWrapper = ({ data, onChange, session }: { data: Complaint; onChange: (u: Partial<Complaint>) => void; session: PatientSession }) => (
  <ComplaintSection complaint={data} onChange={onChange} session={session} />
);

const PersonalOcularHealthWrapper = ({ data, onChange, session }: { data: PersonalOcularHealth; onChange: (u: Partial<PersonalOcularHealth>) => void; session: PatientSession }) => (
  <PersonalOcularHealthSection personalOcularHealth={data} onChange={onChange} session={session} />
);

const PersonalGeneralHealthWrapper = ({ data, onChange, session }: { data: PersonalGeneralHealth; onChange: (u: Partial<PersonalGeneralHealth>) => void; session: PatientSession }) => (
  <PersonalGeneralHealthSection personalGeneralHealth={data} onChange={onChange} session={session} />
);

const FamilyOcularHealthWrapper = ({ data, onChange, session }: { data: FamilyOcularHealth; onChange: (u: Partial<FamilyOcularHealth>) => void; session: PatientSession }) => (
  <FamilyOcularHealthSection familyOcularHealth={data} onChange={onChange} session={session} />
);

const FamilyGeneralHealthWrapper = ({ data, onChange, session }: { data: FamilyGeneralHealth; onChange: (u: Partial<FamilyGeneralHealth>) => void; session: PatientSession }) => (
  <FamilyGeneralHealthSection familyGeneralHealth={data} onChange={onChange} session={session} />
);

const PreliminaryTestsWrapper = ({ data, onChange, session }: { data: PreliminaryTests; onChange: (u: Partial<PreliminaryTests>) => void; session: PatientSession }) => (
  <PreliminaryTestsSection preliminaryTests={data} onChange={onChange} session={session} />
);

export const CASE_HISTORY_SECTIONS: CaseHistorySubSection[] = [
  { id: 'patient-info', label: 'Patient', dataKey: 'patientInfo', component: PatientInfoWrapper },
  { id: 'reason-for-visit', label: 'Raison', dataKey: 'reasonForVisit', component: ReasonForVisitWrapper },
  { id: 'last-exam', label: 'Dernier Examen', dataKey: 'lastExamInfo', component: LastExamWrapper },
  { id: 'current-rx', label: 'RX Actuel', dataKey: 'currentRx', component: CurrentRxWrapper },
  { id: 'visual-needs', label: 'Besoin Visuel', dataKey: 'visualNeeds', component: VisualNeedsWrapper },
  { id: 'complaint', label: 'Plainte', dataKey: 'complaint', component: ComplaintWrapper },
  { id: 'personal-ocular', label: 'Santé Oculaire', dataKey: 'personalOcularHealth', component: PersonalOcularHealthWrapper },
  { id: 'personal-general', label: 'Santé Générale', dataKey: 'personalGeneralHealth', component: PersonalGeneralHealthWrapper },
  { id: 'family-ocular', label: 'Fam. Oculaire', dataKey: 'familyOcularHealth', component: FamilyOcularHealthWrapper },
  { id: 'family-general', label: 'Fam. Générale', dataKey: 'familyGeneralHealth', component: FamilyGeneralHealthWrapper },
];
