// Types DME pour Application d'Examen Optométrique

export type VisitType =
  | 'routine'
  | 'follow-up'
  | 'contact-lens-fitting'
  | 'contact-lens-verification'
  | 'emergency'
  | 'specific-complaint'
  | 'pediatric'
  | 'pre-operative'
  | 'post-operative'
  | 'low-vision'
  | 'binocular-vision'
  | 'dry-eye'
  | 'visual-field-only'
  | 'glasses-verification';

export type LastExamPeriod =
  | 'first'
  | 'less-than-6-months'
  | '6-to-12-months'
  | '1-to-2-years'
  | 'more-than-2-years'
  | 'unknown';

export interface PatientInfo {
  name: string;
  notes: string;
}

export interface ReasonForVisit {
  visitType: VisitType | null;
  notes: string;
}

export interface LastExamInfo {
  lastExamPeriod: LastExamPeriod | null;
  lastExamDate: string | null;
  previousExaminer: string;
  notes: string;
}

export interface CurrentRx {
  hasNoRx: boolean;
  /** Comma-separated values like "type:lunettes,vision:bonne,etat:bon" */
  etat: string;
  notes: string;
}

// Labels for parsing stored Rx data in print preview
export const RX_FIELD_LABELS: Record<string, Record<string, string>> = {
  type: {
    'sv-vl': 'SV VL',
    'sv-vp': 'SV VP',
    'progressif': 'Progressif',
    'degressif': 'Dégressif',
    'ctrl-myopie': 'Ctrl. Myopie',
    'lc': 'LC',
  },
  visionVL: {
    'bonne': 'Bonne',
    'moyenne': 'Moyenne',
    'mauvaise': 'Mauvaise',
  },
  visionVP: {
    'bonne': 'Bonne',
    'moyenne': 'Moyenne',
    'mauvaise': 'Mauvaise',
  },
  condition: {
    'bon': 'Bon état',
    'use': 'Usé',
    'raye': 'Rayé',
    'casse': 'Cassé',
  },
};

export interface Complaint {
  chiefComplaint: string;
  symptoms: string[]; // Using tristate system
  notes: string;
}

export interface VisualNeeds {
  /** Comma-separated values like "travail:bureau,ecran:4-8h" */
  needs: string;
  notes: string;
}

// ============================================
// TESTS PRÉLIMINAIRES
// ============================================

// ============================================
// ACUITÉ VISUELLE
// ============================================

export interface VisualAcuityData {
  // Sans correction
  scOD: string;
  scOS: string;
  scOU: string;
  
  // Avec correction (lunettes habituelles)
  avecOD: string;
  avecOS: string;
  avecOU: string;
  
  // Trou sténopéique
  phOD: string;
  phOS: string;
  
  notes: string;
}

// ============================================
// RÉFRACTION OBJECTIVE
// ============================================

export interface ObjectiveRefraction {
  method: 'autoref' | 'skiascopy' | ''; // autoref par défaut
  rxOD: string;
  rxOS: string;
  notes: string;
}

export const OBJECTIVE_REFRACTION_METHODS = ['Autoréfracteur', 'Skiascopie'] as const;

// ============================================
// RÉFRACTION
// ============================================

export interface RefractionData {
  // Réfraction subjective finale
  rxOD: string; // e.g., "-2.00 -0.50 x 180"
  rxOS: string;
  addOD: string;
  addOS: string;
  
  // AV avec Rx finale
  avOD: string;
  avOS: string;
  avOU: string;
  
  // Distance pupillaire
  dpVL: string;
  dpVP: string;

  // Cycloplégie
  cycloUsed: boolean;
  cycloRxOD: string;
  cycloRxOS: string;
  cycloAgent: string; // cyclopentolate, tropicamide, atropine
  
  notes: string;
}

// ============================================
// GOUTTES / DROPS
// ============================================

export interface Drops {
  // Dilatation
  dilpiUsed: boolean;
  dilAgent: string; // tropicamide, phenylephrine, cyclopentolate
  dilDropsOD: string; // number of drops
  dilDropsOS: string;
  dilTime: string;
  
  // Fluorescéine
  fluorescein: boolean;
  fluorDropsOD: string;
  fluorDropsOS: string;
  
  // Anesthésique
  anesthetic: boolean;
  anestheticAgent: string; // proparacaine, etc.
  anesthDropsOD: string;
  anesthDropsOS: string;
  
  notes: string;
}

export const DIL_AGENTS = ['Tropicamide 1%', 'Phényléphrine 2.5%', 'Cyclopentolate 1%', 'Mydriacyl', 'Paremyd'] as const;
export const CYCLO_AGENTS = ['Cyclopentolate 1%', 'Tropicamide 1%', 'Atropine 1%'] as const;

// ============================================
// SEGMENT ANTÉRIEUR
// ============================================

export interface AnteriorSegment {
  // OD fields
  paupieresOD: string;
  conjonctiveOD: string;
  corneeOD: string;
  chambreAntOD: string;
  irisOD: string;
  cristallinOD: string;
  anglesOD: string;
  // OS fields
  paupieresOS: string;
  conjonctiveOS: string;
  corneeOS: string;
  chambreAntOS: string;
  irisOS: string;
  cristallinOS: string;
  anglesOS: string;
  notes: string;
}

// ============================================
// SEGMENT POSTÉRIEUR
// ============================================

export interface PosteriorSegment {
  // OD fields
  papilleOD: string;
  maculaOD: string;
  vaisseauxOD: string;
  peripherieOD: string;
  vitreOD: string;
  cdVertOD: string;
  cdHorizOD: string;
  // OS fields
  papilleOS: string;
  maculaOS: string;
  vaisseauxOS: string;
  peripherieOS: string;
  vitreOS: string;
  cdVertOS: string;
  cdHorizOS: string;
  notes: string;
}

// ============================================
// CHAMPS VISUELS
// ============================================

export interface VisualFields {
  type: string; // automatise, confrontation
  machine: string; // humphrey, fdt
  resultOD: string; // normal, defaut-non-specifique, arciforme, etc.
  resultOS: string;
  fiable: string; // oui, non
  notes: string;
}

export const VF_TYPES = ['Automatisé', 'Confrontation'] as const;
export const VF_MACHINES = ['Humphrey', 'FDT', 'Octopus'] as const;
export const VF_RESULTS = [
  'Normal',
  'Fiable et complet',
  'Pas fiable',
  'Défaut non-spécifique',
  'Défaut non-répétable',
  'Arciforme',
  'Scotome central',
  'Hémianopsie',
  'Quadranopsie',
  'Rétrécissement concentrique',
] as const;

// ============================================
// OCT
// ============================================

export interface OCT {
  type: string; // macula, rnfl, papille
  machine: string; // zeiss, topcon, heidelberg
  resultOD: string;
  resultOS: string;
  notes: string;
}

export const OCT_TYPES = ['Macula', 'RNFL', 'Papille', 'Segment Ant.'] as const;
export const OCT_MACHINES = ['Zeiss Cirrus', 'Topcon', 'Heidelberg', 'Optovue'] as const;
export const OCT_RESULTS = [
  'Normal',
  'Amincissement',
  'Épaississement',
  'Drusen',
  'Œdème',
  'Membrane',
  'Trou',
  'Atrophie',
] as const;

// ============================================
// PRESSION INTRAOCULAIRE
// ============================================

export interface IOP {
  method: string; // tonopen, goldmann, icare, ncr
  iopOD: string;
  iopOS: string;
  time: string;
  notes: string;
}

// ============================================
// ÉVALUATION ET PLAN
// ============================================

export interface AssessmentPlan {
  diagnosis: string;
  plan: string;
  nextVisit: string;
  notes: string;
}

export interface PreliminaryTests {
  // Chart selection
  chartVL: string; // snellen, lea, numbers, shapes
  chartVP: string; // reading-card, lea
  
  // AV VL - Sans Correction
  avVLscOD: string;
  avVLscOS: string;
  avVLscOU: string;
  // AV VL - Avec Correction
  avVLacOD: string;
  avVLacOS: string;
  avVLacOU: string;
  // AV VL - Pinhole
  avVLphOD: string;
  avVLphOS: string;
  // AV VP - Sans Correction (M notation)
  avVPscOD: string;
  avVPscOS: string;
  avVPscOU: string;
  // AV VP - Avec Correction (M notation)
  avVPacOD: string;
  avVPacOS: string;
  avVPacOU: string;
  
  // Vision des couleurs
  couleurs: string; // normal, déficient, etc.
  
  // Stéréoscopie (Randot)
  stereoFormes: string; // x/8
  stereoCercles: string; // x/10
  stereoAnimaux: string; // x/3
  
  // Réflexes pupillaires
  pupillesOD: string; // PERRLA, marcus gunn, etc.
  pupillesOS: string;
  
  // Mouvements oculaires
  mouvements: string; // souple et complet, etc.
  
  notes: string;
}

export interface BinocularVision {
  // Avec/Sans Rx
  vbAvecRx: boolean;
  vbSansRx: boolean;

  // Test Écran (Cover Test)
  coverTestVL: string; // ortho, eso, exo, hyper
  coverTestVP: string;
  
  // Tige de Maddox
  maddoxVL: string;
  maddoxVP: string;
  
  // Filtre Rouge
  filtreRougeVL: string;
  filtreRougeVP: string;
  
  // Réserves fusionnelles
  reservesBIVL: string;
  reservesBOVL: string;
  reservesBIVP: string;
  reservesBOVP: string;
  
  // PPC
  ppc: string; // bris
  ppcRecovery: string; // recouvrement
  ppcTarget: string; // type de cible
  
  notes: string;
}

// Labels for parsing stored visual needs data
export const VISUAL_NEEDS_LABELS: Record<string, Record<string, string>> = {
  travail: {
    'bureau': 'Bureau',
    'exterieur': 'Extérieur',
    'conduite': 'Conduite',
    'precision': 'Travail de précision',
    'ecrans': 'Multi-écrans',
  },
  ecran: {
    '0-2h': '0-2h/jour',
    '2-4h': '2-4h/jour',
    '4-8h': '4-8h/jour',
    '8h+': '8h+/jour',
  },
  conduite: {
    'jour': 'Jour',
    'nuit': 'Nuit',
    'les-deux': 'Jour + Nuit',
    'non': 'Non',
  },
  loisirs: {
    'lecture': 'Lecture',
    'sports': 'Sports',
    'bricolage': 'Bricolage',
    'couture': 'Couture',
    'musique': 'Musique',
    'jardinage': 'Jardinage',
  },
  distance: {
    'vl': 'Vision de loin',
    'vp': 'Vision de près',
    'vi': 'Vision intermédiaire',
    'toutes': 'Toutes distances',
  },
};

export interface PersonalOcularHealth {
  conditions: string[];
  surgeries: string[];
  notes: string;
}

export interface PersonalGeneralHealth {
  conditions: string[];
  medications: string[];
  allergies: string[];
  hasNKDA: boolean;
  notes: string;
}

export interface FamilyOcularHealth {
  conditions: string[];
  notes: string;
}

export interface FamilyGeneralHealth {
  conditions: string[];
  notes: string;
}

export interface PatientSession {
  id: string;
  patientInfo: PatientInfo;
  reasonForVisit: ReasonForVisit;
  lastExamInfo: LastExamInfo;
  currentRx: CurrentRx;
  visualNeeds: VisualNeeds;
  complaint: Complaint;
  personalOcularHealth: PersonalOcularHealth;
  personalGeneralHealth: PersonalGeneralHealth;
  familyOcularHealth: FamilyOcularHealth;
  familyGeneralHealth: FamilyGeneralHealth;
  preliminaryTests: PreliminaryTests;
  binocularVision: BinocularVision;
  visualAcuity: VisualAcuityData;
  objectiveRefraction: ObjectiveRefraction;
  refraction: RefractionData;
  anteriorSegment: AnteriorSegment;
  posteriorSegment: PosteriorSegment;
  iop: IOP;
  drops: Drops;
  visualFields: VisualFields;
  oct: OCT;
  assessmentPlan: AssessmentPlan;
  createdAt: Date;
}

export const VISIT_TYPE_LABELS: Record<VisitType, string> = {
  'routine': 'Examen de Routine',
  'follow-up': 'Suivi',
  'contact-lens-fitting': 'Ajustement Lentilles',
  'contact-lens-verification': 'Vérification Lentilles',
  'emergency': 'Urgence',
  'specific-complaint': 'Plainte Spécifique',
  'pediatric': 'Examen Pédiatrique',
  'pre-operative': 'Évaluation Préopératoire',
  'post-operative': 'Suivi Postopératoire',
  'low-vision': 'Basse Vision',
  'binocular-vision': 'Vision Binoculaire',
  'dry-eye': 'Sécheresse Oculaire',
  'visual-field-only': 'Champ Visuel Seulement',
  'glasses-verification': 'Vérification Lunettes',
};

export const LAST_EXAM_LABELS: Record<LastExamPeriod, string> = {
  'first': 'Premier Examen',
  'less-than-6-months': '< 6 mois',
  '6-to-12-months': '6-12 mois',
  '1-to-2-years': '1-2 ans',
  'more-than-2-years': '> 2 ans',
  'unknown': 'Inconnu',
};

export function createEmptyPatientSession(): PatientSession {
  return {
    id: crypto.randomUUID(),
    patientInfo: {
      name: '',
      notes: '',
    },
    reasonForVisit: {
      visitType: null,
      notes: '',
    },
    lastExamInfo: {
      lastExamPeriod: null,
      lastExamDate: null,
      previousExaminer: '',
      notes: '',
    },
    currentRx: {
      hasNoRx: true,
      etat: '',
      notes: '',
    },
    visualNeeds: {
      needs: '',
      notes: '',
    },
    complaint: {
      chiefComplaint: '',
      symptoms: [],
      notes: '',
    },
    personalOcularHealth: {
      conditions: [],
      surgeries: [],
      notes: '',
    },
    personalGeneralHealth: {
      conditions: [],
      medications: [],
      allergies: [],
      hasNKDA: true,
      notes: '',
    },
    familyOcularHealth: {
      conditions: [],
      notes: '',
    },
    familyGeneralHealth: {
      conditions: [],
      notes: '',
    },
    preliminaryTests: {
      chartVL: 'snellen',
      chartVP: 'reading-card',
      avVLscOD: '',
      avVLscOS: '',
      avVLscOU: '',
      avVLacOD: '',
      avVLacOS: '',
      avVLacOU: '',
      avVLphOD: '',
      avVLphOS: '',
      avVPscOD: '',
      avVPscOS: '',
      avVPscOU: '',
      avVPacOD: '',
      avVPacOS: '',
      avVPacOU: '',
      couleurs: '',
      stereoFormes: '',
      stereoCercles: '',
      stereoAnimaux: '',
      pupillesOD: '',
      pupillesOS: '',
      mouvements: '',
      notes: '',
    },
    binocularVision: {
      vbAvecRx: false,
      vbSansRx: false,
      coverTestVL: '',
      coverTestVP: '',
      maddoxVL: '',
      maddoxVP: '',
      filtreRougeVL: '',
      filtreRougeVP: '',
      reservesBIVL: '',
      reservesBOVL: '',
      reservesBIVP: '',
      reservesBOVP: '',
      ppc: '',
      ppcRecovery: '',
      ppcTarget: '',
      notes: '',
    },
    visualAcuity: {
      scOD: '',
      scOS: '',
      scOU: '',
      avecOD: '',
      avecOS: '',
      avecOU: '',
      phOD: '',
      phOS: '',
      notes: '',
    },
    objectiveRefraction: {
      method: 'autoref',
      rxOD: '',
      rxOS: '',
      notes: '',
    },
    refraction: {
      rxOD: '',
      rxOS: '',
      addOD: '',
      addOS: '',
      avOD: '',
      avOS: '',
      avOU: '',
      dpVL: '',
      dpVP: '',
      cycloUsed: false,
      cycloRxOD: '',
      cycloRxOS: '',
      cycloAgent: '',
      notes: '',
    },
    anteriorSegment: {
      paupieresOD: '', paupieresOS: '',
      conjonctiveOD: '', conjonctiveOS: '',
      corneeOD: '', corneeOS: '',
      chambreAntOD: '', chambreAntOS: '',
      irisOD: '', irisOS: '',
      cristallinOD: '', cristallinOS: '',
      anglesOD: '', anglesOS: '',
      notes: '',
    },
    posteriorSegment: {
      papilleOD: '', papilleOS: '',
      maculaOD: '', maculaOS: '',
      vaisseauxOD: '', vaisseauxOS: '',
      peripherieOD: '', peripherieOS: '',
      vitreOD: '', vitreOS: '',
      notes: '',
    },
    iop: {
      method: '',
      iopOD: '',
      iopOS: '',
      time: '',
      notes: '',
    },
    drops: {
      dilpiUsed: false,
      dilAgent: '',
      dilDropsOD: '',
      dilDropsOS: '',
      dilTime: '',
      fluorescein: false,
      fluorDropsOD: '',
      fluorDropsOS: '',
      anesthetic: false,
      anestheticAgent: '',
      anesthDropsOD: '',
      anesthDropsOS: '',
      notes: '',
    },
    visualFields: {
      type: '',
      machine: '',
      resultOD: '',
      resultOS: '',
      fiable: '',
      notes: '',
    },
    oct: {
      type: '',
      machine: '',
      resultOD: '',
      resultOS: '',
      notes: '',
    },
    assessmentPlan: {
      diagnosis: '',
      plan: '',
      nextVisit: '',
      notes: '',
    },
    createdAt: new Date(),
  };
}
