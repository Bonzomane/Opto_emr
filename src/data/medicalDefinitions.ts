// Définitions centralisées pour les données médicales EMR
// Ce fichier est la source unique de vérité pour les labels et options

import type { ConditionDefinition } from '@/components/emr/ConditionGrid';

// Re-export the types for external use
export type { ConditionDefinition };

// ============================================
// DISPLAY UTILITIES
// ============================================

/**
 * Parse stored items and return formatted display data
 * Items are stored as 'itemId' or 'itemId:optionId'
 */
export function parseStoredItems(
  storedItems: string[],
  definitions: ConditionDefinition[]
): { label: string; details: string[] }[] {
  const result: { label: string; details: string[] }[] = [];
  
  // Get unique base IDs
  const baseIds = [...new Set(
    storedItems.map(item => item.includes(':') ? item.split(':')[0] : item)
  )];
  
  for (const baseId of baseIds) {
    const definition = definitions.find(d => d.id === baseId);
    if (!definition) continue;
    
    const selectedOptionIds = storedItems
      .filter(item => item.startsWith(`${baseId}:`))
      .map(item => item.split(':')[1]);
    
    const details: string[] = [];
    
    // Check in groups
    if (definition.groups) {
      for (const group of definition.groups) {
        for (const opt of group.options) {
          if (selectedOptionIds.includes(opt.id)) {
            details.push(opt.label);
          }
        }
      }
    }
    
    // Check in flat options
    if (definition.options) {
      for (const opt of definition.options) {
        if (selectedOptionIds.includes(opt.id)) {
          details.push(opt.label);
        }
      }
    }
    
    result.push({ label: definition.label, details });
  }
  
  return result;
}

/**
 * Format items for display as text
 */
export function formatItemsForDisplay(
  storedItems: string[],
  definitions: ConditionDefinition[],
  emptyMessage: string = 'Aucun'
): string {
  const parsed = parseStoredItems(storedItems, definitions);
  
  if (parsed.length === 0) {
    return emptyMessage;
  }
  
  return parsed.map(item => {
    if (item.details.length > 0) {
      return `${item.label} (${item.details.join(', ')})`;
    }
    return item.label;
  }).join('; ');
}

// ============================================
// PLAINTES / SYMPTÔMES
// ============================================

export const SYMPTOMS: ConditionDefinition[] = [
  { 
    id: 'blurred-vision', 
    label: 'Vision Floue',
    groups: [
      {
        label: 'Distance',
        options: [
          { id: 'distance', label: 'Loin' },
          { id: 'near', label: 'Près' },
          { id: 'both', label: 'Les deux' },
        ]
      },
      {
        label: 'Fréquence',
        options: [
          { id: 'intermittent', label: 'Intermittent' },
          { id: 'constant', label: 'Constant' },
        ]
      },
      {
        label: 'Latéralité',
        options: [
          { id: 'od', label: 'OD' },
          { id: 'os', label: 'OS' },
          { id: 'ou', label: 'OU' },
        ]
      }
    ]
  },
  { 
    id: 'eye-pain', 
    label: 'Douleur Oculaire',
    groups: [
      {
        label: 'Type',
        options: [
          { id: 'sharp', label: 'Aiguë' },
          { id: 'dull', label: 'Sourde' },
          { id: 'burning', label: 'Brûlure' },
          { id: 'pressure', label: 'Pression' },
        ]
      },
      {
        label: 'Sévérité',
        options: [
          { id: 'mild', label: 'Légère' },
          { id: 'moderate', label: 'Modérée' },
          { id: 'severe', label: 'Sévère' },
        ]
      },
      {
        label: 'Latéralité',
        options: [
          { id: 'od', label: 'OD' },
          { id: 'os', label: 'OS' },
          { id: 'ou', label: 'OU' },
        ]
      }
    ]
  },
  { 
    id: 'redness', 
    label: 'Rougeur',
    groups: [
      {
        label: 'Distribution',
        options: [
          { id: 'diffuse', label: 'Diffuse' },
          { id: 'sectoral', label: 'Sectorielle' },
          { id: 'circumlimbal', label: 'Périlimbique' },
        ]
      },
      {
        label: 'Latéralité',
        options: [
          { id: 'od', label: 'OD' },
          { id: 'os', label: 'OS' },
          { id: 'ou', label: 'OU' },
        ]
      }
    ]
  },
  { 
    id: 'itching', 
    label: 'Démangeaison',
    groups: [
      {
        label: 'Sévérité',
        options: [
          { id: 'mild', label: 'Légère' },
          { id: 'moderate', label: 'Modérée' },
          { id: 'severe', label: 'Sévère' },
        ]
      },
      {
        label: 'Déclencheur',
        options: [
          { id: 'seasonal', label: 'Saisonnière' },
          { id: 'allergies', label: 'Allergies' },
          { id: 'contact', label: 'Contact' },
        ]
      },
      {
        label: 'Latéralité',
        options: [
          { id: 'od', label: 'OD' },
          { id: 'os', label: 'OS' },
          { id: 'ou', label: 'OU' },
        ]
      }
    ]
  },
  { 
    id: 'tearing', 
    label: 'Larmoiement',
    groups: [
      {
        label: 'Type',
        options: [
          { id: 'excessive', label: 'Excessif' },
          { id: 'reflex', label: 'Réflexe' },
          { id: 'epiphora', label: 'Épiphora' },
        ]
      },
      {
        label: 'Latéralité',
        options: [
          { id: 'od', label: 'OD' },
          { id: 'os', label: 'OS' },
          { id: 'ou', label: 'OU' },
        ]
      }
    ]
  },
  { 
    id: 'discharge', 
    label: 'Écoulement',
    groups: [
      {
        label: 'Type',
        options: [
          { id: 'watery', label: 'Aqueux' },
          { id: 'mucous', label: 'Muqueux' },
          { id: 'purulent', label: 'Purulent' },
          { id: 'crusty', label: 'Croûtes' },
        ]
      },
      {
        label: 'Moment',
        options: [
          { id: 'morning', label: 'Matin' },
          { id: 'evening', label: 'Soir' },
          { id: 'constant', label: 'Constant' },
        ]
      },
      {
        label: 'Latéralité',
        options: [
          { id: 'od', label: 'OD' },
          { id: 'os', label: 'OS' },
          { id: 'ou', label: 'OU' },
        ]
      }
    ]
  },
  { 
    id: 'photophobia', 
    label: 'Photophobie',
    groups: [
      {
        label: 'Sévérité',
        options: [
          { id: 'mild', label: 'Légère' },
          { id: 'moderate', label: 'Modérée' },
          { id: 'severe', label: 'Sévère' },
        ]
      },
      {
        label: 'Déclencheur',
        options: [
          { id: 'sunlight', label: 'Soleil' },
          { id: 'indoor', label: 'Intérieur' },
          { id: 'screens', label: 'Écrans' },
        ]
      }
    ]
  },
  { 
    id: 'floaters', 
    label: 'Corps Flottants',
    groups: [
      {
        label: 'Apparition',
        options: [
          { id: 'new', label: 'Nouveau' },
          { id: 'old', label: 'Ancien' },
          { id: 'increased', label: 'Augmenté' },
        ]
      },
      {
        label: 'Quantité',
        options: [
          { id: 'few', label: 'Peu' },
          { id: 'moderate', label: 'Modéré' },
          { id: 'many', label: 'Nombreux' },
        ]
      },
      {
        label: 'Latéralité',
        options: [
          { id: 'od', label: 'OD' },
          { id: 'os', label: 'OS' },
          { id: 'ou', label: 'OU' },
        ]
      }
    ]
  },
  { 
    id: 'flashes', 
    label: 'Éclairs',
    groups: [
      {
        label: 'Apparition',
        options: [
          { id: 'new', label: 'Nouveau' },
          { id: 'chronic', label: 'Chronique' },
        ]
      },
      {
        label: 'Localisation',
        options: [
          { id: 'temporal', label: 'Temporal' },
          { id: 'nasal', label: 'Nasal' },
          { id: 'superior', label: 'Supérieur' },
          { id: 'inferior', label: 'Inférieur' },
        ]
      },
      {
        label: 'Latéralité',
        options: [
          { id: 'od', label: 'OD' },
          { id: 'os', label: 'OS' },
          { id: 'ou', label: 'OU' },
        ]
      }
    ]
  },
  { 
    id: 'headache', 
    label: 'Céphalée',
    groups: [
      {
        label: 'Localisation',
        options: [
          { id: 'frontal', label: 'Frontale' },
          { id: 'temporal', label: 'Temporale' },
          { id: 'occipital', label: 'Occipitale' },
          { id: 'periorbital', label: 'Périorbitaire' },
        ]
      },
      {
        label: 'Déclencheur',
        options: [
          { id: 'reading', label: 'Lecture' },
          { id: 'screens', label: 'Écrans' },
          { id: 'driving', label: 'Conduite' },
          { id: 'end-of-day', label: 'Fin de journée' },
        ]
      },
      {
        label: 'Sévérité',
        options: [
          { id: 'mild', label: 'Légère' },
          { id: 'moderate', label: 'Modérée' },
          { id: 'severe', label: 'Sévère' },
        ]
      }
    ]
  },
  { 
    id: 'double-vision', 
    label: 'Diplopie',
    groups: [
      {
        label: 'Type',
        options: [
          { id: 'monocular', label: 'Monoculaire' },
          { id: 'binocular', label: 'Binoculaire' },
        ]
      },
      {
        label: 'Direction',
        options: [
          { id: 'horizontal', label: 'Horizontale' },
          { id: 'vertical', label: 'Verticale' },
          { id: 'oblique', label: 'Oblique' },
        ]
      },
      {
        label: 'Fréquence',
        options: [
          { id: 'constant', label: 'Constante' },
          { id: 'intermittent', label: 'Intermittente' },
          { id: 'fatigue', label: 'À la fatigue' },
        ]
      }
    ]
  },
  { 
    id: 'dryness', 
    label: 'Sécheresse',
    groups: [
      {
        label: 'Sévérité',
        options: [
          { id: 'mild', label: 'Légère' },
          { id: 'moderate', label: 'Modérée' },
          { id: 'severe', label: 'Sévère' },
        ]
      },
      {
        label: 'Moment',
        options: [
          { id: 'morning', label: 'Matin' },
          { id: 'evening', label: 'Soir' },
          { id: 'constant', label: 'Constant' },
        ]
      },
      {
        label: 'Aggravé par',
        options: [
          { id: 'screens', label: 'Écrans' },
          { id: 'ac', label: 'Climatisation' },
          { id: 'wind', label: 'Vent' },
          { id: 'reading', label: 'Lecture' },
        ]
      }
    ]
  },
];

// ============================================
// SANTÉ OCULAIRE PERSONNELLE
// ============================================

export const OCULAR_CONDITIONS: ConditionDefinition[] = [
  { 
    id: 'glaucoma', 
    label: 'Glaucome',
    options: [
      { id: 'poag', label: 'POAG' },
      { id: 'pacg', label: 'PACG' },
    { id: 'suspect', label: 'Suspect' },
    { id: 'treated', label: 'Traité' },
    ]
  },
  { 
    id: 'cataracts', 
    label: 'Cataractes',
    options: [
      { id: 'nuclear', label: 'Nucléaire' },
      { id: 'cortical', label: 'Corticale' },
      { id: 'posterior', label: 'Sous-capsulaire' },
    { id: 'od', label: 'OD' },
    { id: 'os', label: 'OS' },
    ]
  },
  { 
    id: 'macular-degeneration', 
    label: 'DMLA',
    options: [
    { id: 'dry', label: 'Sèche' },
    { id: 'wet', label: 'Humide' },
    { id: 'od', label: 'OD' },
    { id: 'os', label: 'OS' },
    ]
  },
  { 
    id: 'retinal-detachment', 
    label: 'Décollement Rétinien',
    options: [
      { id: 'history', label: 'Antécédent' },
      { id: 'repaired', label: 'Réparé' },
    { id: 'od', label: 'OD' },
    { id: 'os', label: 'OS' },
    ]
  },
  { 
    id: 'amblyopia', 
    label: 'Amblyopie',
    options: [
      { id: 'strabismic', label: 'Strabique' },
      { id: 'refractive', label: 'Réfractive' },
    { id: 'od', label: 'OD' },
    { id: 'os', label: 'OS' },
    ]
  },
  { 
    id: 'strabismus', 
    label: 'Strabisme',
    options: [
    { id: 'esotropia', label: 'Ésotropie' },
    { id: 'exotropia', label: 'Exotropie' },
    { id: 'hypertropia', label: 'Hypertropie' },
    ]
  },
  { 
    id: 'dry-eye', 
    label: 'Sécheresse Oculaire',
    options: [
      { id: 'aqueous', label: 'Déficience Aqueuse' },
      { id: 'evaporative', label: 'Évaporative' },
      { id: 'mgd', label: 'DGM' },
    ]
  },
  { 
    id: 'keratoconus', 
    label: 'Kératocône',
    options: [
      { id: 'mild', label: 'Léger' },
      { id: 'moderate', label: 'Modéré' },
      { id: 'severe', label: 'Sévère' },
    ]
  },
  { 
    id: 'uveitis', 
    label: 'Uvéite',
    options: [
    { id: 'anterior', label: 'Antérieure' },
    { id: 'posterior', label: 'Postérieure' },
    { id: 'chronic', label: 'Chronique' },
    ]
  },
  { 
    id: 'diabetic-retinopathy', 
    label: 'Rétinopathie Diabétique',
    options: [
      { id: 'npdr', label: 'RDNP' },
      { id: 'pdr', label: 'RDP' },
      { id: 'dme', label: 'OMD' },
    ]
  },
];

export const OCULAR_SURGERIES: ConditionDefinition[] = [
  { 
    id: 'cataract-surgery', 
    label: 'Chir. Cataracte',
    options: [
    { id: 'od', label: 'OD' },
    { id: 'os', label: 'OS' },
      { id: 'iol', label: 'LIO' },
    ]
  },
  { 
    id: 'lasik-prk', 
    label: 'LASIK/PRK',
    options: [
      { id: 'lasik', label: 'LASIK' },
      { id: 'prk', label: 'PRK' },
      { id: 'smile', label: 'SMILE' },
    ]
  },
  { 
    id: 'retinal-surgery', 
    label: 'Chir. Rétine',
    options: [
      { id: 'vitrectomy', label: 'Vitrectomie' },
      { id: 'laser', label: 'Laser' },
      { id: 'injection', label: 'Injection' },
    ]
  },
  { 
    id: 'glaucoma-surgery', 
    label: 'Chir. Glaucome',
    options: [
    { id: 'trabeculectomy', label: 'Trabéculectomie' },
    { id: 'slt', label: 'SLT' },
      { id: 'migs', label: 'MIGS' },
    ]
  },
];

// ============================================
// SANTÉ GÉNÉRALE PERSONNELLE
// ============================================

export const MEDICAL_CONDITIONS: ConditionDefinition[] = [
  { 
    id: 'diabetes', 
    label: 'Diabète',
    options: [
    { id: 'type1', label: 'Type 1' },
    { id: 'type2', label: 'Type 2' },
      { id: 'insulin', label: 'Insuline' },
    { id: 'controlled', label: 'Contrôlé' },
    ]
  },
  { 
    id: 'hypertension', 
    label: 'Hypertension',
    options: [
    { id: 'controlled', label: 'Contrôlée' },
    { id: 'uncontrolled', label: 'Non contrôlée' },
    ]
  },
  { 
    id: 'cardiovascular', 
    label: 'Maladie Cardiovasculaire',
    options: [
      { id: 'cad', label: 'Coronaropathie' },
      { id: 'chf', label: 'Insuffisance' },
      { id: 'arrhythmia', label: 'Arythmie' },
    ]
  },
  { 
    id: 'thyroid', 
    label: 'Trouble Thyroïdien',
    options: [
    { id: 'hypo', label: 'Hypothyroïdie' },
    { id: 'hyper', label: 'Hyperthyroïdie' },
    { id: 'graves', label: 'Graves' },
    ]
  },
  { 
    id: 'autoimmune', 
    label: 'Maladie Auto-immune',
    options: [
    { id: 'lupus', label: 'Lupus' },
      { id: 'ra', label: 'Polyarthrite' },
    { id: 'sjogren', label: 'Sjögren' },
    ]
  },
  { 
    id: 'asthma', 
    label: 'Asthme',
    options: [
      { id: 'mild', label: 'Léger' },
      { id: 'moderate', label: 'Modéré' },
      { id: 'severe', label: 'Sévère' },
    ]
  },
  { 
    id: 'cancer', 
    label: 'Cancer',
    options: [
    { id: 'active', label: 'Actif' },
    { id: 'remission', label: 'Rémission' },
    ]
  },
  { 
    id: 'migraine', 
    label: 'Migraines',
    options: [
      { id: 'with-aura', label: 'Avec aura' },
      { id: 'without-aura', label: 'Sans aura' },
    ]
  },
];

export const MEDICATIONS: ConditionDefinition[] = [
  { 
    id: 'blood-pressure', 
    label: 'Méd. Tension',
    options: [
      { id: 'ace', label: 'IEC' },
      { id: 'beta-blocker', label: 'Bêta-bloquant' },
      { id: 'diuretic', label: 'Diurétique' },
    ]
  },
  { 
    id: 'diabetes-meds', 
    label: 'Méd. Diabète',
    options: [
      { id: 'metformin', label: 'Metformine' },
      { id: 'insulin', label: 'Insuline' },
      { id: 'glp1', label: 'GLP-1' },
    ]
  },
  { 
    id: 'cholesterol', 
    label: 'Méd. Cholestérol',
    options: [
      { id: 'statin', label: 'Statine' },
    ]
  },
  { 
    id: 'anticoagulants', 
    label: 'Anticoagulants',
    options: [
      { id: 'warfarin', label: 'Warfarine' },
      { id: 'aspirin', label: 'Aspirine' },
      { id: 'doac', label: 'AOD' },
    ]
  },
  { 
    id: 'antidepressants', 
    label: 'Antidépresseurs',
    options: [
      { id: 'ssri', label: 'ISRS' },
      { id: 'snri', label: 'IRSN' },
    ]
  },
  { 
    id: 'plaquenil', 
    label: 'Plaquenil',
    options: [
      { id: 'lupus', label: 'Pour Lupus' },
      { id: 'ra', label: 'Pour Polyarthrite' },
      { id: 'years-5plus', label: '> 5 ans' },
    ]
  },
  { 
    id: 'glaucoma-drops', 
    label: 'Gouttes Glaucome',
    options: [
      { id: 'prostaglandin', label: 'Prostaglandine' },
      { id: 'beta-blocker', label: 'Bêta-bloquant' },
    ]
  },
  { 
    id: 'artificial-tears', 
    label: 'Larmes Artificielles',
    options: [
      { id: 'preserved', label: 'Avec conservateur' },
      { id: 'pf', label: 'Sans conservateur' },
    ]
  },
];

export const ALLERGIES: ConditionDefinition[] = [
  { 
    id: 'penicillin', 
    label: 'Pénicilline',
    options: [
      { id: 'rash', label: 'Éruption' },
      { id: 'anaphylaxis', label: 'Anaphylaxie' },
    ]
  },
  { 
    id: 'sulfa', 
    label: 'Sulfamides',
    options: [
      { id: 'rash', label: 'Éruption' },
      { id: 'anaphylaxis', label: 'Anaphylaxie' },
    ]
  },
  { 
    id: 'nsaids', 
    label: 'AINS',
    options: [
      { id: 'gi', label: 'Troubles GI' },
      { id: 'asthma', label: 'Asthme' },
    ]
  },
  { 
    id: 'latex', 
    label: 'Latex',
    options: [
      { id: 'contact', label: 'Contact' },
      { id: 'anaphylaxis', label: 'Anaphylaxie' },
    ]
  },
  { 
    id: 'tropicamide', 
    label: 'Tropicamide',
    options: [
      { id: 'tachycardia', label: 'Tachycardie' },
    ]
  },
  { 
    id: 'phenylephrine', 
    label: 'Phényléphrine',
    options: [
      { id: 'hypertension', label: 'Hypertension' },
    ]
  },
];

// ============================================
// ANTÉCÉDENTS FAMILIAUX OCULAIRES
// ============================================

export const FAMILY_OCULAR_CONDITIONS: ConditionDefinition[] = [
  { 
    id: 'glaucoma', 
    label: 'Glaucome',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'grandparent', label: 'Grand-parent' },
    { id: 'sibling', label: 'Frère/Sœur' },
    ]
  },
  { 
    id: 'macular-degeneration', 
    label: 'DMLA',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'grandparent', label: 'Grand-parent' },
    { id: 'sibling', label: 'Frère/Sœur' },
    ]
  },
  { 
    id: 'cataracts', 
    label: 'Cataractes',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'grandparent', label: 'Grand-parent' },
      { id: 'early-onset', label: 'Précoce' },
    ]
  },
  { 
    id: 'retinal-detachment', 
    label: 'Décollement Rétinien',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'sibling', label: 'Frère/Sœur' },
    ]
  },
  { 
    id: 'keratoconus', 
    label: 'Kératocône',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'sibling', label: 'Frère/Sœur' },
    ]
  },
  { 
    id: 'strabismus', 
    label: 'Strabisme',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'sibling', label: 'Frère/Sœur' },
    ]
  },
  { 
    id: 'blindness', 
    label: 'Cécité',
    options: [
      { id: 'parent', label: 'Parent' },
      { id: 'grandparent', label: 'Grand-parent' },
      { id: 'unknown-cause', label: 'Cause inconnue' },
    ]
  },
  { 
    id: 'diabetic-retinopathy', 
    label: 'Rétinopathie Diabétique',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'grandparent', label: 'Grand-parent' },
    ]
  },
];

// ============================================
// ANTÉCÉDENTS FAMILIAUX GÉNÉRAUX
// ============================================

export const FAMILY_GENERAL_CONDITIONS: ConditionDefinition[] = [
  { 
    id: 'diabetes', 
    label: 'Diabète',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'grandparent', label: 'Grand-parent' },
    { id: 'sibling', label: 'Frère/Sœur' },
      { id: 'type1', label: 'Type 1' },
      { id: 'type2', label: 'Type 2' },
    ]
  },
  { 
    id: 'hypertension', 
    label: 'Hypertension',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'grandparent', label: 'Grand-parent' },
    { id: 'sibling', label: 'Frère/Sœur' },
    ]
  },
  { 
    id: 'cardiovascular', 
    label: 'Maladie Cardiovasculaire',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'grandparent', label: 'Grand-parent' },
      { id: 'early-onset', label: 'Précoce (<55 ans)' },
    ]
  },
  { 
    id: 'stroke', 
    label: 'AVC',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'grandparent', label: 'Grand-parent' },
    ]
  },
  { 
    id: 'autoimmune', 
    label: 'Maladie Auto-immune',
    options: [
      { id: 'parent', label: 'Parent' },
      { id: 'sibling', label: 'Frère/Sœur' },
      { id: 'lupus', label: 'Lupus' },
      { id: 'ra', label: 'Polyarthrite' },
    ]
  },
  { 
    id: 'thyroid', 
    label: 'Trouble Thyroïdien',
    options: [
      { id: 'parent', label: 'Parent' },
    { id: 'sibling', label: 'Frère/Sœur' },
    ]
  },
  { 
    id: 'cancer', 
    label: 'Cancer',
    options: [
    { id: 'parent', label: 'Parent' },
    { id: 'grandparent', label: 'Grand-parent' },
    { id: 'sibling', label: 'Frère/Sœur' },
    ]
  },
  { 
    id: 'neurological', 
    label: 'Maladie Neurologique',
    options: [
    { id: 'parent', label: 'Parent' },
      { id: 'alzheimer', label: 'Alzheimer' },
      { id: 'parkinson', label: 'Parkinson' },
      { id: 'ms', label: 'Sclérose en Plaques' },
    ]
  },
];
