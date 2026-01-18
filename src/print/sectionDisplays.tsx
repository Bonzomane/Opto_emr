import {
  BinocularVision,
  Drops,
  IOP,
  OCT,
  ObjectiveRefraction,
  PosteriorSegment,
  PreliminaryTests,
  RefractionData,
  VisualFields,
} from '@/types/emr';
import { formatRxDisplay } from '@/lib/rxFormat';
import {
  CHART_VL_LABELS,
  CHART_VP_LABELS,
  COULEURS_LABELS,
  COVER_TEST_LABELS,
  FILTRE_ROUGE_LABELS,
  IOP_METHOD_LABELS,
  MOUVEMENTS_LABELS,
  PUPILLES_LABELS,
} from './labels';
import { DataRow, Empty, Note } from './previewComponents';

const SEGMENT_BASE_LABELS: Record<string, string> = {
  paupieres: 'Paupières',
  conjonctive: 'Conjonctive',
  cornee: 'Cornée',
  chambreAnt: 'Ch. Ant.',
  iris: 'Iris',
  cristallin: 'Cristallin',
  angles: 'Angles',
  papille: 'Papille',
  macula: 'Macula',
  vaisseaux: 'Vaisseaux',
  peripherie: 'Périphérie',
  vitre: 'Vitré',
};

function buildAVLabel(parts: string[]) {
  return parts.filter(Boolean).join(' · ');
}

export function PrelimTestsDisplay({ tests }: { tests: PreliminaryTests }) {
  const hasStereo = tests.stereoFormes || tests.stereoCercles || tests.stereoAnimaux;
  const hasVLsc = tests.avVLscOD || tests.avVLscOS || tests.avVLscOU;
  const hasVLac = tests.avVLacOD || tests.avVLacOS || tests.avVLacOU;
  const hasVLph = tests.avVLphOD || tests.avVLphOS;
  const hasVPsc = tests.avVPscOD || tests.avVPscOS || tests.avVPscOU;
  const hasVPac = tests.avVPacOD || tests.avVPacOS || tests.avVPacOU;
  const hasData = hasVLsc || hasVLac || hasVLph || hasVPsc || hasVPac ||
    tests.couleurs || hasStereo || tests.pupillesOD || tests.pupillesOS || tests.mouvements;

  if (!hasData) return <Empty />;

  const stereoDisplay = () => {
    if (tests.stereoFormes === 'Normal' && tests.stereoCercles === 'Normal' && tests.stereoAnimaux === 'Normal') {
      return 'Normal';
    }
    const parts = [];
    if (tests.stereoFormes) parts.push(`F: ${tests.stereoFormes}/8`);
    if (tests.stereoCercles) parts.push(`C: ${tests.stereoCercles}/10`);
    if (tests.stereoAnimaux) parts.push(`A: ${tests.stereoAnimaux}/3`);
    return parts.join(' ');
  };

  const chartVL = tests.chartVL ? CHART_VL_LABELS[tests.chartVL] || tests.chartVL : '';
  const chartVP = tests.chartVP ? CHART_VP_LABELS[tests.chartVP] || tests.chartVP : '';

  return (
    <div className="space-y-1 text-[10px]">
      {hasVLsc && (
        <DataRow label={buildAVLabel(['AV VL', chartVL, 'SC'])}>
          {tests.avVLscOD && <span>OD: {tests.avVLscOD}</span>}
          {tests.avVLscOS && <span>OS: {tests.avVLscOS}</span>}
          {tests.avVLscOU && <span>OU: {tests.avVLscOU}</span>}
        </DataRow>
      )}
      {hasVLac && (
        <DataRow label={buildAVLabel(['AV VL', chartVL, 'AC'])}>
          {tests.avVLacOD && <span>OD: {tests.avVLacOD}</span>}
          {tests.avVLacOS && <span>OS: {tests.avVLacOS}</span>}
          {tests.avVLacOU && <span>OU: {tests.avVLacOU}</span>}
        </DataRow>
      )}
      {hasVLph && (
        <DataRow label={buildAVLabel(['AV VL', chartVL, 'PH'])}>
          {tests.avVLphOD && <span>OD: {tests.avVLphOD}</span>}
          {tests.avVLphOS && <span>OS: {tests.avVLphOS}</span>}
        </DataRow>
      )}
      {hasVPsc && (
        <DataRow label={buildAVLabel(['AV VP @40cm', chartVP, 'SC'])}>
          {tests.avVPscOD && <span>OD: {tests.avVPscOD}</span>}
          {tests.avVPscOS && <span>OS: {tests.avVPscOS}</span>}
          {tests.avVPscOU && <span>OU: {tests.avVPscOU}</span>}
        </DataRow>
      )}
      {hasVPac && (
        <DataRow label={buildAVLabel(['AV VP @40cm', chartVP, 'AC'])}>
          {tests.avVPacOD && <span>OD: {tests.avVPacOD}</span>}
          {tests.avVPacOS && <span>OS: {tests.avVPacOS}</span>}
          {tests.avVPacOU && <span>OU: {tests.avVPacOU}</span>}
        </DataRow>
      )}
      {tests.couleurs && (
        <DataRow label="Couleurs">
          <span>{COULEURS_LABELS[tests.couleurs] || tests.couleurs}</span>
        </DataRow>
      )}
      {hasStereo && (
        <DataRow label="Randot">
          <span>{stereoDisplay()}</span>
        </DataRow>
      )}
      {(tests.pupillesOD || tests.pupillesOS) && (
        <DataRow label="Pupilles">
          {tests.pupillesOD && <span>OD: {PUPILLES_LABELS[tests.pupillesOD] || tests.pupillesOD}</span>}
          {tests.pupillesOS && <span>OS: {PUPILLES_LABELS[tests.pupillesOS] || tests.pupillesOS}</span>}
        </DataRow>
      )}
      {tests.mouvements && (
        <DataRow label="Mvts Oculaires">
          <span>{MOUVEMENTS_LABELS[tests.mouvements] || tests.mouvements}</span>
        </DataRow>
      )}
      {tests.notes && <Note text={tests.notes} />}
    </div>
  );
}

export function ObjectiveRefractionDisplay({ obj }: { obj: ObjectiveRefraction }) {
  if (!obj.method) return <Empty />;

  const methodLabel = obj.method === 'autoref' ? 'Autoréfracteur' : 'Skiascopie';

  if (obj.method === 'autoref') {
    return (
      <div className="text-[10px]">
        <DataRow label={methodLabel}>
          <span className="italic text-zinc-500">Imprimé et joint</span>
        </DataRow>
        {obj.notes && <Note text={obj.notes} />}
      </div>
    );
  }

  return (
    <div className="space-y-1 text-[10px]">
      <DataRow label={methodLabel}>
        <div className="flex flex-col">
          {obj.rxOD && <span>OD: {formatRxDisplay(obj.rxOD)}</span>}
          {obj.rxOS && <span>OS: {formatRxDisplay(obj.rxOS)}</span>}
        </div>
      </DataRow>
      {obj.notes && <Note text={obj.notes} />}
    </div>
  );
}

export function BinoDisplay({ bino }: { bino: BinocularVision }) {
  const tables = bino.tables ?? [];
  const hasTableData = tables.some((table) =>
    table.rxStatus ||
    table.coverTestVL || table.coverTestVP ||
    table.maddoxVL || table.maddoxVP ||
    table.filtreRougeVL || table.filtreRougeVP ||
    table.ppc || table.ppcRecovery || table.ppcTarget ||
    table.reservesBIVL || table.reservesBOVL ||
    table.reservesBIVP || table.reservesBOVP
  );
  const hasData = hasTableData || bino.notes;

  if (!hasData) return <Empty />;

  return (
    <div className="space-y-2 text-[10px]">
      {tables.map((table, index) => {
        const rxLabel =
          table.rxStatus === 'avec'
            ? 'avec Rx'
            : table.rxStatus === 'sans'
            ? 'sans Rx'
            : '';

        const tableHasData =
          table.rxStatus ||
          table.coverTestVL || table.coverTestVP ||
          table.maddoxVL || table.maddoxVP ||
          table.filtreRougeVL || table.filtreRougeVP ||
          table.ppc || table.ppcRecovery || table.ppcTarget ||
          table.reservesBIVL || table.reservesBOVL ||
          table.reservesBIVP || table.reservesBOVP;

        if (!tableHasData) return null;

        return (
          <div key={`bino-table-${index}`} className="space-y-1">
            {(table.coverTestVL || table.coverTestVP) && (
              <DataRow label={rxLabel ? `Test Écran (${rxLabel})` : 'Test Écran'}>
                {table.coverTestVL && <span>VL: {COVER_TEST_LABELS[table.coverTestVL] || table.coverTestVL}</span>}
                {table.coverTestVP && <span>VP: {COVER_TEST_LABELS[table.coverTestVP] || table.coverTestVP}</span>}
              </DataRow>
            )}
            {(table.maddoxVL || table.maddoxVP) && (
              <DataRow label="Maddox">
                {table.maddoxVL && <span>VL: {table.maddoxVL}</span>}
                {table.maddoxVP && <span>VP: {table.maddoxVP}</span>}
              </DataRow>
            )}
            {(table.filtreRougeVL || table.filtreRougeVP) && (
              <DataRow label="Filtre Rouge">
                {table.filtreRougeVL && <span>VL: {FILTRE_ROUGE_LABELS[table.filtreRougeVL] || table.filtreRougeVL}</span>}
                {table.filtreRougeVP && <span>VP: {FILTRE_ROUGE_LABELS[table.filtreRougeVP] || table.filtreRougeVP}</span>}
              </DataRow>
            )}
            {(table.ppc || table.ppcRecovery) && (
              <DataRow label="PPC">
                {table.ppc && <span>B: {table.ppc}</span>}
                {table.ppcRecovery && <span>R: {table.ppcRecovery}</span>}
                {table.ppcTarget && <span className="text-zinc-400">({table.ppcTarget})</span>}
              </DataRow>
            )}
            {(table.reservesBIVL || table.reservesBOVL || table.reservesBIVP || table.reservesBOVP) && (
              <DataRow label="Réserves">
                <div className="flex flex-col">
                  {table.reservesBIVL && <span>BI VL: {table.reservesBIVL}</span>}
                  {table.reservesBOVL && <span>BO VL: {table.reservesBOVL}</span>}
                  {table.reservesBIVP && <span>BI VP: {table.reservesBIVP}</span>}
                  {table.reservesBOVP && <span>BO VP: {table.reservesBOVP}</span>}
                </div>
              </DataRow>
            )}
          </div>
        );
      })}
      {bino.notes && <Note text={bino.notes} />}
    </div>
  );
}

export function RefractionDisplay({ rx }: { rx: RefractionData }) {
  const hasSubjective = rx.rxOD || rx.rxOS;
  const hasFinal = rx.finalRxOD || rx.finalRxOS;
  const hasCyclo = rx.cycloUsed && (rx.cycloRxOD || rx.cycloRxOS);
  
  if (!hasSubjective && !hasFinal && !hasCyclo) return <Empty />;

  // Use final if set, otherwise fall back to subjective
  const displayFinalOD = rx.finalRxOD || rx.rxOD;
  const displayFinalOS = rx.finalRxOS || rx.rxOS;
  const displayFinalAddOD = rx.finalAddOD || rx.addOD;
  const displayFinalAddOS = rx.finalAddOS || rx.addOS;

  return (
    <div className="space-y-2 text-[10px]">
      {/* Rx Subjective */}
      {hasSubjective && (
        <div className="space-y-0.5">
          <div className="font-semibold text-zinc-600">Rx Subjective</div>
          <DataRow label="Rx">
            <div className="flex flex-col">
              {rx.rxOD && <span>OD: {formatRxDisplay(rx.rxOD)}{rx.addOD && ` add ${rx.addOD}`}</span>}
              {rx.rxOS && <span>OS: {formatRxDisplay(rx.rxOS)}{rx.addOS && ` add ${rx.addOS}`}</span>}
            </div>
          </DataRow>
          {(rx.subjAvOD || rx.subjAvOS || rx.subjAvOU) && (
            <DataRow label="AV">
              {rx.subjAvOD && <span>OD: {rx.subjAvOD}</span>}
              {rx.subjAvOS && <span> OS: {rx.subjAvOS}</span>}
              {rx.subjAvOU && <span> OU: {rx.subjAvOU}</span>}
            </DataRow>
          )}
        </div>
      )}

      {/* Rx Finale */}
      {(displayFinalOD || displayFinalOS) && (
        <div className="space-y-0.5">
          <div className="font-semibold text-zinc-600">Rx Finale</div>
          <DataRow label="Rx">
            <div className="flex flex-col">
              {displayFinalOD && <span>OD: {formatRxDisplay(displayFinalOD)}{displayFinalAddOD && ` add ${displayFinalAddOD}`}</span>}
              {displayFinalOS && <span>OS: {formatRxDisplay(displayFinalOS)}{displayFinalAddOS && ` add ${displayFinalAddOS}`}</span>}
            </div>
          </DataRow>
          {(rx.avOD || rx.avOS || rx.avOU) && (
            <DataRow label="MAV">
              {rx.avOD && <span>OD: {rx.avOD}</span>}
              {rx.avOS && <span> OS: {rx.avOS}</span>}
              {rx.avOU && <span> OU: {rx.avOU}</span>}
            </DataRow>
          )}
        </div>
      )}

      {/* DP */}
      {(rx.dpVL || rx.dpVP) && (
        <DataRow label="DP">
          {rx.dpVL && <span>VL: {rx.dpVL}</span>}
          {rx.dpVP && <span> VP: {rx.dpVP}</span>}
        </DataRow>
      )}

      {/* Cycloplégie */}
      {hasCyclo && (
        <div className="space-y-0.5">
          <div className="font-semibold text-zinc-600">Cycloplégie {rx.cycloAgent && <span className="font-normal text-zinc-400">({rx.cycloAgent})</span>}</div>
          <DataRow label="Rx">
            <div className="flex flex-col">
              {rx.cycloRxOD && <span>OD: {formatRxDisplay(rx.cycloRxOD)}{rx.cycloAddOD && ` add ${rx.cycloAddOD}`}</span>}
              {rx.cycloRxOS && <span>OS: {formatRxDisplay(rx.cycloRxOS)}{rx.cycloAddOS && ` add ${rx.cycloAddOS}`}</span>}
            </div>
          </DataRow>
          {(rx.cycloAvOD || rx.cycloAvOS || rx.cycloAvOU) && (
            <DataRow label="AV">
              {rx.cycloAvOD && <span>OD: {rx.cycloAvOD}</span>}
              {rx.cycloAvOS && <span> OS: {rx.cycloAvOS}</span>}
              {rx.cycloAvOU && <span> OU: {rx.cycloAvOU}</span>}
            </DataRow>
          )}
        </div>
      )}

      {rx.notes && <Note text={rx.notes} />}
    </div>
  );
}

export function DropsDisplay({ drops }: { drops: Drops }) {
  const hasData = drops.dilpiUsed || drops.fluorescein || drops.anesthetic;
  if (!hasData) return null;

  const formatDropCount = (od: string, os: string) => {
    const odNum = od || '?';
    const osNum = os || '?';
    return `OD: ${odNum}gtt OS: ${osNum}gtt`;
  };

  return (
    <div className="space-y-0.5 text-[10px]">
      {drops.dilpiUsed && (
        <DataRow label="Dilatation">
          <span>{drops.dilAgent || 'Oui'}</span>
          <span className="text-zinc-500 ml-1">({formatDropCount(drops.dilDropsOD, drops.dilDropsOS)})</span>
          {drops.dilTime && <span className="text-zinc-400 ml-1">@ {drops.dilTime}</span>}
        </DataRow>
      )}
      {drops.fluorescein && (
        <DataRow label="Fluorescéine">
          <span>Oui</span>
          <span className="text-zinc-500 ml-1">({formatDropCount(drops.fluorDropsOD, drops.fluorDropsOS)})</span>
        </DataRow>
      )}
      {drops.anesthetic && (
        <DataRow label="Anesthésique">
          <span>{drops.anestheticAgent || 'Oui'}</span>
          <span className="text-zinc-500 ml-1">({formatDropCount(drops.anesthDropsOD, drops.anesthDropsOS)})</span>
        </DataRow>
      )}
      {drops.notes && <Note text={drops.notes} />}
    </div>
  );
}

export function SegmentDisplay({ data }: { data: Record<string, string> }) {
  const baseKeys = ['paupieres', 'conjonctive', 'cornee', 'chambreAnt', 'iris', 'cristallin', 'angles', 'papille', 'macula', 'vaisseaux', 'peripherie', 'vitre'];

  const rows: { label: string; od: string; os: string }[] = [];
  for (const base of baseKeys) {
    const od = data[`${base}OD`] || '';
    const os = data[`${base}OS`] || '';
    if (od || os) {
      rows.push({ label: SEGMENT_BASE_LABELS[base] || base, od, os });
    }
    if (base === 'papille') {
      const cdOD = (data.cdVertOD || data.cdHorizOD)
        ? `${data.cdVertOD || '-'}/${data.cdHorizOD || '-'}`
        : '';
      const cdOS = (data.cdVertOS || data.cdHorizOS)
        ? `${data.cdVertOS || '-'}/${data.cdHorizOS || '-'}`
        : '';
      if (cdOD || cdOS) {
        rows.push({ label: 'C/D (V/H)', od: cdOD, os: cdOS });
      }
    }
  }

  if (rows.length === 0) return <Empty />;

  return (
    <div className="text-[10px]">
      <div className="flex gap-1 mb-1 border-b border-zinc-200 pb-0.5">
        <span className="w-16 shrink-0"></span>
        <span className="flex-1 font-medium text-zinc-500">OD</span>
        <span className="flex-1 font-medium text-zinc-500">OS</span>
      </div>
      {rows.map(({ label, od, os }, idx) => (
        <div key={label} className={`flex gap-1 py-0.5 ${idx < rows.length - 1 ? 'border-b border-zinc-100' : ''}`}>
          <span className="text-zinc-400 w-16 shrink-0">{label}:</span>
          <span className="flex-1">{od || '—'}</span>
          <span className="flex-1">{os || '—'}</span>
        </div>
      ))}
      {data.notes && <Note text={data.notes} />}
    </div>
  );
}

export function IOPDisplay({ iop }: { iop: IOP }) {
  if (iop.method === 'ncr') {
    return (
      <div className="space-y-1 text-[10px]">
        <DataRow label="NCT">
          <span className="italic text-zinc-500">Résultats joints à l'examen</span>
        </DataRow>
        {iop.notes && <Note text={iop.notes} />}
      </div>
    );
  }

  const hasData = iop.iopOD || iop.iopOS;
  if (!hasData) return <Empty />;

  return (
    <div className="space-y-1 text-[10px]">
      <DataRow label={iop.method ? IOP_METHOD_LABELS[iop.method] || iop.method : 'PIO'}>
        {iop.iopOD && <span>OD: {iop.iopOD}</span>}
        {iop.iopOS && <span>OS: {iop.iopOS}</span>}
        {iop.time && <span className="text-zinc-400">@ {iop.time}</span>}
      </DataRow>
      {iop.notes && <Note text={iop.notes} />}
    </div>
  );
}

export function VisualFieldsDisplay({ vf }: { vf: VisualFields }) {
  const hasData = vf.type || vf.machine || vf.resultOD || vf.resultOS;
  if (!hasData) return <Empty />;

  const isAttached = vf.machine || vf.type;

  return (
    <div className="space-y-1 text-[10px]">
      {isAttached && (
        <>
          <DataRow label="Type">
            {vf.type && <span>{vf.type}</span>}
            {vf.machine && <span className="text-zinc-400">({vf.machine})</span>}
          </DataRow>
          <span className="italic text-zinc-500">Imprimé et joint</span>
        </>
      )}
      {(vf.resultOD || vf.resultOS) && (
        <DataRow label="Résultats">
          {vf.resultOD && <span>OD: {vf.resultOD}</span>}
          {vf.resultOS && <span>OS: {vf.resultOS}</span>}
        </DataRow>
      )}
      {vf.notes && <Note text={vf.notes} />}
    </div>
  );
}

export function OCTDisplay({ oct }: { oct: OCT }) {
  const hasData = oct.type || oct.machine || oct.resultOD || oct.resultOS;
  if (!hasData) return <Empty />;

  const isAttached = oct.machine || oct.type;

  return (
    <div className="space-y-1 text-[10px]">
      {isAttached && (
        <>
          <DataRow label="Type">
            {oct.type && <span>{oct.type}</span>}
            {oct.machine && <span className="text-zinc-400">({oct.machine})</span>}
          </DataRow>
          <span className="italic text-zinc-500">Imprimé et joint</span>
        </>
      )}
      {(oct.resultOD || oct.resultOS) && (
        <DataRow label="Résultats">
          {oct.resultOD && <span>OD: {oct.resultOD}</span>}
          {oct.resultOS && <span>OS: {oct.resultOS}</span>}
        </DataRow>
      )}
      {oct.notes && <Note text={oct.notes} />}
    </div>
  );
}

export function AssessmentPlanDisplay({
  diagnosis,
  plan,
  nextVisit,
  notes,
}: {
  diagnosis: string;
  plan: string;
  nextVisit: string;
  notes: string;
}) {
  if (!diagnosis && !plan && !nextVisit && !notes) return <Empty />;

  return (
    <div className="space-y-1 text-[10px]">
      {diagnosis && (
        <div>
          <span className="text-[9px] text-zinc-400 uppercase block">Diagnostic</span>
          <p className="whitespace-pre-line">{diagnosis}</p>
        </div>
      )}
      {plan && (
        <div>
          <span className="text-[9px] text-zinc-400 uppercase block">Plan</span>
          <p className="whitespace-pre-line">{plan}</p>
        </div>
      )}
      {nextVisit && (
        <div>
          <span className="text-[9px] text-zinc-400 uppercase block">Suivi</span>
          <p>{nextVisit}</p>
        </div>
      )}
      {notes && <Note text={notes} />}
    </div>
  );
}

export function SegmentPreview({ data }: { data: PosteriorSegment }) {
  return <SegmentDisplay data={data} />;
}
