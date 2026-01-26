import { VisitType, LastExamPeriod } from '@/types/emr';

export const LABELS = {
  visitType: {
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
  } as Record<VisitType, string>,

  lastExam: {
    'first': 'Premier Examen',
    'less-than-6-months': '< 6 mois',
    '6-to-12-months': '6-12 mois',
    '1-to-2-years': '1-2 ans',
    'more-than-2-years': '> 2 ans',
    'unknown': 'Inconnu',
  } as Record<LastExamPeriod, string>,

  iop: {
    methods: {
      'goldmann': 'Goldmann',
      'icare': 'iCare',
      'ncr': 'NCT',
      'tonopen': 'Tonopen',
      'palpation': 'Palpation',
    } as Record<string, string>,
  },

  rxFields: {
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
  } as Record<string, Record<string, string>>,

  visualNeeds: {
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
  } as Record<string, Record<string, string>>,

  coverTest: {
    'ortho': 'Ortho',
    'eso': 'Eso',
    'exo': 'Exo',
    'hyper': 'Hyper',
    'hypo': 'Hypo',
    'eso-tropie': 'Eso-tropie',
    'exo-tropie': 'Exo-tropie',
    'hyper-tropie': 'Hyper-tropie',
    'hypo-tropie': 'Hypo-tropie',
  } as Record<string, string>,

  filtreRouge: {
    'Fusion': 'Fusion',
    'suppr-od': 'Suppr. OD',
    'suppr-os': 'Suppr. OS',
    'diplopie': 'Diplopie',
    'diplopie-croisee': 'Diplopie croisée',
    'diplopie-homonyme': 'Diplopie homonyme',
  } as Record<string, string>,

  couleurs: {
    'normal': 'Normal',
    'deficient': 'Déficient',
    'protanope': 'Protanope',
    'deuteranope': 'Deutéranope',
    'non-teste': 'Non testé',
  } as Record<string, string>,

  charts: {
    vl: {
      'snellen': 'Snellen',
      'lea': 'Lea',
      'numbers': 'Chiffres',
      'shapes': 'Formes',
    },
    vp: {
      'reading-card': 'Carte',
      'lea': 'Lea',
    },
  },

  pupilles: {
    'perrla': 'PERRLA',
    'dpar-': 'DPAR-',
    'lent': 'Lent',
    'fixe': 'Fixe',
    'marcus-gunn': 'Marcus Gunn +',
    'anisocorie': 'Anisocorie',
  } as Record<string, string>,

  mouvements: {
    'souple-complet': 'Souples et complets',
    'limité': 'Limité',
    'douloureux': 'Douloureux',
    'nystagmus': 'Nystagmus',
    'strabisme': 'Strabisme',
  } as Record<string, string>,

  common: {
    od: 'OD',
    os: 'OS',
    ou: 'OU',
    vl: 'VL',
    vp: 'VP',
    add: 'Add',
    sph: 'Sph',
    cyl: 'Cyl',
    axe: 'Axe',
    mav: 'MAV',
    av: 'AV',
    ph: 'PH',
    sc: 'SC',
    ac: 'AC',
    nct: 'NCT',
    attached: 'Imprimé et joint',
  },

  agents: {
    dil: ['Tropicamide 1%', 'Phényléphrine 2.5%', 'Cyclopentolate 1%', 'Mydriacyl', 'Paremyd'],
    cyclo: ['Cyclopentolate 1%', 'Tropicamide 1%', 'Atropine 1%'],
  },

  vf: {
    types: ['Automatisé', 'Confrontation'],
    machines: ['Humphrey', 'FDT', 'Octopus'],
    results: [
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
    ],
  },

  oct: {
    types: ['Macula', 'RNFL', 'Papille', 'Segment Ant.'],
    machines: ['Zeiss Cirrus', 'Topcon', 'Heidelberg', 'Optovue'],
    results: [
      'Normal',
      'Amincissement',
      'Épaississement',
      'Drusen',
      'Œdème',
      'Membrane',
      'Trou',
      'Atrophie',
    ],
  },

  objRefraction: {
    methods: ['Autoréfracteur', 'Skiascopie'],
  },
};
