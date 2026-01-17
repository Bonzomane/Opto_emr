import {
  FamilyGeneralHealth,
  FamilyOcularHealth,
  LastExamInfo,
  PersonalGeneralHealth,
  PersonalOcularHealth,
  ReasonForVisit,
  VisualNeeds,
  CurrentRx,
  Complaint,
  VISIT_TYPE_LABELS,
  LAST_EXAM_LABELS,
  RX_FIELD_LABELS,
  VISUAL_NEEDS_LABELS,
} from '@/types/emr';
import {
  ALLERGIES,
  FAMILY_GENERAL_CONDITIONS,
  FAMILY_OCULAR_CONDITIONS,
  MEDICAL_CONDITIONS,
  MEDICATIONS,
  OCULAR_CONDITIONS,
  OCULAR_SURGERIES,
  SYMPTOMS,
  parseStoredItems,
  ConditionDefinition,
} from '@/data/medicalDefinitions';
import { Empty, Note, Row } from './previewComponents';

function ItemList({
  items,
  definitions,
}: {
  items: string[];
  definitions: ConditionDefinition[];
}) {
  const parsed = parseStoredItems(items, definitions);
  if (parsed.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {parsed.map((item, idx) => (
        <div key={idx}>
          <span className="font-medium">{item.label}</span>
          {item.details.length > 0 && (
            <span className="text-zinc-400 ml-1">({item.details.join(', ')})</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function VisitDisplay({
  reasonForVisit,
  lastExamInfo,
}: {
  reasonForVisit: ReasonForVisit;
  lastExamInfo: LastExamInfo;
}) {
  const hasVisit = !!reasonForVisit.visitType || !!lastExamInfo.lastExamPeriod;
  if (!hasVisit && !reasonForVisit.notes && !lastExamInfo.notes) return <Empty />;

  return (
    <div className="space-y-0.5 text-[10px]">
      {hasVisit && (
        <div className="flex gap-2 flex-wrap">
          <span>{reasonForVisit.visitType ? VISIT_TYPE_LABELS[reasonForVisit.visitType] : '—'}</span>
          <span className="text-zinc-400">
            DEV: {lastExamInfo.lastExamPeriod ? LAST_EXAM_LABELS[lastExamInfo.lastExamPeriod] : '—'}
          </span>
        </div>
      )}
      {reasonForVisit.notes && <Note text={reasonForVisit.notes} />}
      {lastExamInfo.notes && <Note text={lastExamInfo.notes} />}
    </div>
  );
}

export function CurrentRxDisplay({ currentRx }: { currentRx: CurrentRx }) {
  if (!currentRx.etat && !currentRx.hasNoRx) return <Empty />;

  const parts = currentRx.etat.split(',').filter((v) => v);
  const fields: Record<string, string[]> = {};
  const noRxFlags: string[] = [];

  for (const part of parts) {
    if (part === 'norx-vl') {
      noRxFlags.push("Pas d'Rx VL");
      continue;
    }
    if (part === 'norx-vp') {
      noRxFlags.push("Pas d'Rx VP");
      continue;
    }
    const [field, value] = part.split(':');
    if (!fields[field]) fields[field] = [];
    fields[field].push(value);
  }

  const fieldLabels: Record<string, string> = {
    type: 'Type',
    vision: 'Vision',
    condition: 'État',
  };

  return (
    <div className="space-y-0.5 text-[10px]">
      {currentRx.hasNoRx && <span className="text-zinc-600">Aucune Rx</span>}
      {noRxFlags.length > 0 && (
        <span className="text-zinc-600">{noRxFlags.join(', ')}</span>
      )}
      {Object.entries(fields).map(([field, values]) => (
        <Row
          key={field}
          label={fieldLabels[field] || field}
          value={values.map((v) => RX_FIELD_LABELS[field]?.[v] || v).join(', ')}
        />
      ))}
    </div>
  );
}

export function ComplaintDisplay({ complaint }: { complaint: Complaint }) {
  const hasContent = complaint.chiefComplaint || complaint.symptoms.length > 0 || complaint.notes;
  if (!hasContent) return <Empty />;

  return (
    <div className="space-y-0.5 text-[10px]">
      {complaint.chiefComplaint && <p>{complaint.chiefComplaint}</p>}
      {complaint.symptoms.length > 0 ? (
        <ItemList items={complaint.symptoms} definitions={SYMPTOMS} />
      ) : !complaint.chiefComplaint && <Empty />}
      {complaint.notes && <Note text={complaint.notes} />}
    </div>
  );
}

export function PersonalOcularHealthDisplay({
  personalOcularHealth,
}: {
  personalOcularHealth: PersonalOcularHealth;
}) {
  const hasData =
    personalOcularHealth.conditions.length > 0 ||
    personalOcularHealth.surgeries.length > 0 ||
    personalOcularHealth.notes;

  if (!hasData) return <Empty />;

  return (
    <div className="space-y-0.5 text-[10px]">
      {personalOcularHealth.conditions.length > 0 ? (
        <ItemList items={personalOcularHealth.conditions} definitions={OCULAR_CONDITIONS} />
      ) : (
        <Empty />
      )}
      {personalOcularHealth.surgeries.length > 0 && (
        <div>
          <span className="text-[9px] text-zinc-500 font-medium">Chirurgies: </span>
          <ItemList items={personalOcularHealth.surgeries} definitions={OCULAR_SURGERIES} />
        </div>
      )}
      {personalOcularHealth.notes && <Note text={personalOcularHealth.notes} />}
    </div>
  );
}

export function AllergiesDisplay({
  personalGeneralHealth,
}: {
  personalGeneralHealth: PersonalGeneralHealth;
}) {
  if (personalGeneralHealth.hasNKDA) return <Empty />;
  if (personalGeneralHealth.allergies.length === 0) return <Empty />;

  return (
    <div className="space-y-0.5 text-[10px]">
      <span className="text-[9px] text-zinc-500 font-medium">Allergies: </span>
      <ItemList items={personalGeneralHealth.allergies} definitions={ALLERGIES} />
    </div>
  );
}

export function PersonalGeneralHealthDisplay({
  personalGeneralHealth,
}: {
  personalGeneralHealth: PersonalGeneralHealth;
}) {
  const hasData =
    personalGeneralHealth.conditions.length > 0 ||
    personalGeneralHealth.medications.length > 0 ||
    personalGeneralHealth.notes;

  if (!hasData) return <Empty />;

  return (
    <div className="space-y-0.5 text-[10px]">
      {personalGeneralHealth.conditions.length > 0 ? (
        <ItemList items={personalGeneralHealth.conditions} definitions={MEDICAL_CONDITIONS} />
      ) : (
        <Empty />
      )}
      {personalGeneralHealth.medications.length > 0 && (
        <div>
          <span className="text-[9px] text-zinc-500 font-medium">Médicaments: </span>
          <ItemList items={personalGeneralHealth.medications} definitions={MEDICATIONS} />
        </div>
      )}
      {personalGeneralHealth.notes && <Note text={personalGeneralHealth.notes} />}
    </div>
  );
}

export function FamilyHistoryDisplay({
  familyOcularHealth,
  familyGeneralHealth,
}: {
  familyOcularHealth: FamilyOcularHealth;
  familyGeneralHealth: FamilyGeneralHealth;
}) {
  const hasData =
    familyOcularHealth.conditions.length > 0 ||
    familyGeneralHealth.conditions.length > 0 ||
    familyOcularHealth.notes ||
    familyGeneralHealth.notes;

  if (!hasData) return <Empty />;

  return (
    <div className="space-y-0.5 text-[10px]">
      {familyOcularHealth.conditions.length > 0 && (
        <ItemList items={familyOcularHealth.conditions} definitions={FAMILY_OCULAR_CONDITIONS} />
      )}
      {familyGeneralHealth.conditions.length > 0 && (
        <ItemList items={familyGeneralHealth.conditions} definitions={FAMILY_GENERAL_CONDITIONS} />
      )}
      {familyOcularHealth.notes && <Note text={familyOcularHealth.notes} />}
      {familyGeneralHealth.notes && <Note text={familyGeneralHealth.notes} />}
    </div>
  );
}

export function VisualNeedsDisplay({ visualNeeds }: { visualNeeds: VisualNeeds }) {
  if (!visualNeeds.needs && !visualNeeds.notes) return <Empty />;

  const parts = visualNeeds.needs.split(',').filter((v) => v);
  const fieldOrder = ['travail', 'ecran', 'conduite', 'distance', 'loisirs'];
  const fieldLabels: Record<string, string> = {
    travail: 'Travail',
    ecran: 'Écran',
    conduite: 'Conduite',
    distance: 'Distance',
    loisirs: 'Loisirs',
  };

  const parsed: { field: string; value: string }[] = [];
  for (const part of parts) {
    const [field, value] = part.split(':');
    const label = VISUAL_NEEDS_LABELS[field]?.[value] || value;
    parsed.push({ field, value: label });
  }

  parsed.sort((a, b) => fieldOrder.indexOf(a.field) - fieldOrder.indexOf(b.field));

  return (
    <div className="space-y-0.5 text-[10px]">
      {parsed.map(({ field, value }) => (
        <Row key={field} label={fieldLabels[field] || field} value={value} />
      ))}
      {visualNeeds.notes && <Note text={visualNeeds.notes} />}
    </div>
  );
}
