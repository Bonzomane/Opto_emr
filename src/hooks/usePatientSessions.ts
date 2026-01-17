import { useState, useEffect, useCallback } from 'react';
import { PatientSession, createEmptyPatientSession } from '@/types/emr';

const STORAGE_KEY = 'emr-patient-sessions';
const ACTIVE_SESSION_KEY = 'emr-active-session-id';

function loadSessionsFromStorage(): PatientSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const sessions = JSON.parse(stored) as PatientSession[];
      // Migrate old sessions: ensure new fields have defaults
      return sessions.map(session => ({
        ...session,
        patientInfo: {
          ...session.patientInfo,
          notes: session.patientInfo?.notes ?? '',
        },
        reasonForVisit: {
          ...session.reasonForVisit,
          notes: session.reasonForVisit?.notes ?? '',
        },
        lastExamInfo: {
          ...session.lastExamInfo,
          notes: session.lastExamInfo?.notes ?? '',
        },
        personalGeneralHealth: {
          ...session.personalGeneralHealth,
          hasNKDA: session.personalGeneralHealth?.hasNKDA ?? true,
        },
        visualNeeds: session.visualNeeds ?? { needs: '', notes: '' },
        preliminaryTests: {
          chartVL: session.preliminaryTests?.chartVL ?? 'snellen',
          chartVP: session.preliminaryTests?.chartVP ?? 'reading-card',
          avVLscOD: session.preliminaryTests?.avVLscOD ?? session.preliminaryTests?.avVLOD ?? '',
          avVLscOS: session.preliminaryTests?.avVLscOS ?? session.preliminaryTests?.avVLOS ?? '',
          avVLscOU: session.preliminaryTests?.avVLscOU ?? '',
          avVLacOD: session.preliminaryTests?.avVLacOD ?? '',
          avVLacOS: session.preliminaryTests?.avVLacOS ?? '',
          avVLacOU: session.preliminaryTests?.avVLacOU ?? '',
          avVLphOD: session.preliminaryTests?.avVLphOD ?? '',
          avVLphOS: session.preliminaryTests?.avVLphOS ?? '',
          avVPscOD: session.preliminaryTests?.avVPscOD ?? session.preliminaryTests?.avVPOD ?? '',
          avVPscOS: session.preliminaryTests?.avVPscOS ?? session.preliminaryTests?.avVPOS ?? '',
          avVPscOU: session.preliminaryTests?.avVPscOU ?? '',
          avVPacOD: session.preliminaryTests?.avVPacOD ?? '',
          avVPacOS: session.preliminaryTests?.avVPacOS ?? '',
          avVPacOU: session.preliminaryTests?.avVPacOU ?? '',
          couleurs: session.preliminaryTests?.couleurs ?? '',
          stereoFormes: session.preliminaryTests?.stereoFormes ?? '',
          stereoCercles: session.preliminaryTests?.stereoCercles ?? '',
          stereoAnimaux: session.preliminaryTests?.stereoAnimaux ?? '',
          pupillesOD: session.preliminaryTests?.pupillesOD ?? '',
          pupillesOS: session.preliminaryTests?.pupillesOS ?? '',
          mouvements: session.preliminaryTests?.mouvements ?? '',
          notes: session.preliminaryTests?.notes ?? '',
        },
        binocularVision: (() => {
          const legacy = session.binocularVision as any;
          const defaultTable = {
            rxStatus: '',
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
          };

          if (legacy?.tables && Array.isArray(legacy.tables) && legacy.tables.length > 0) {
            return {
              tables: legacy.tables.map((table: any) => ({
                ...defaultTable,
                ...table,
              })),
              notes: legacy.notes ?? '',
            };
          }

          // Migrate legacy single-table fields (and old vbAvecRx/vbSansRx)
          const rxStatus =
            legacy?.vbAvecRx ? 'avec' : legacy?.vbSansRx ? 'sans' : '';

          return {
            tables: [
              {
                ...defaultTable,
                rxStatus,
                coverTestVL: legacy?.coverTestVL ?? '',
                coverTestVP: legacy?.coverTestVP ?? '',
                maddoxVL: legacy?.maddoxVL ?? '',
                maddoxVP: legacy?.maddoxVP ?? '',
                filtreRougeVL: legacy?.filtreRougeVL ?? '',
                filtreRougeVP: legacy?.filtreRougeVP ?? '',
                reservesBIVL: legacy?.reservesBIVL ?? '',
                reservesBOVL: legacy?.reservesBOVL ?? '',
                reservesBIVP: legacy?.reservesBIVP ?? '',
                reservesBOVP: legacy?.reservesBOVP ?? '',
                ppc: legacy?.ppc ?? '',
                ppcRecovery: legacy?.ppcRecovery ?? '',
                ppcTarget: legacy?.ppcTarget ?? '',
              },
            ],
            notes: legacy?.notes ?? '',
          };
        })(),
        visualAcuity: session.visualAcuity ?? {
          scOD: '', scOS: '', scOU: '',
          avecOD: '', avecOS: '', avecOU: '',
          phOD: '', phOS: '',
          notes: '',
        },
        objectiveRefraction: session.objectiveRefraction ?? {
          method: 'autoref',
          rxOD: '', rxOS: '',
          notes: '',
        },
        refraction: session.refraction ?? {
          rxOD: '', rxOS: '', addOD: '', addOS: '',
          avOD: '', avOS: '', avOU: '',
          dpVL: '', dpVP: '',
          cycloUsed: false, cycloRxOD: '', cycloRxOS: '', cycloAgent: '',
          notes: '',
        },
        anteriorSegment: session.anteriorSegment ?? {
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
          papilleOD: session.posteriorSegment?.papilleOD ?? '',
          papilleOS: session.posteriorSegment?.papilleOS ?? '',
          maculaOD: session.posteriorSegment?.maculaOD ?? '',
          maculaOS: session.posteriorSegment?.maculaOS ?? '',
          vaisseauxOD: session.posteriorSegment?.vaisseauxOD ?? '',
          vaisseauxOS: session.posteriorSegment?.vaisseauxOS ?? '',
          peripherieOD: session.posteriorSegment?.peripherieOD ?? '',
          peripherieOS: session.posteriorSegment?.peripherieOS ?? '',
          vitreOD: session.posteriorSegment?.vitreOD ?? '',
          vitreOS: session.posteriorSegment?.vitreOS ?? '',
          cdVertOD: session.posteriorSegment?.cdVertOD ?? '',
          cdHorizOD: session.posteriorSegment?.cdHorizOD ?? '',
          cdVertOS: session.posteriorSegment?.cdVertOS ?? '',
          cdHorizOS: session.posteriorSegment?.cdHorizOS ?? '',
          notes: session.posteriorSegment?.notes ?? '',
        },
        iop: session.iop ?? {
          method: '', iopOD: '', iopOS: '',
          time: '', notes: '',
        },
        drops: session.drops ?? {
          dilpiUsed: false, dilAgent: '', dilDropsOD: '', dilDropsOS: '', dilTime: '',
          fluorescein: false, fluorDropsOD: '', fluorDropsOS: '',
          anesthetic: false, anestheticAgent: '', anesthDropsOD: '', anesthDropsOS: '',
          notes: '',
        },
        visualFields: session.visualFields ?? {
          type: '', machine: '', resultOD: '', resultOS: '', fiable: '', notes: '',
        },
        oct: session.oct ?? {
          type: '', machine: '', resultOD: '', resultOS: '', notes: '',
        },
        assessmentPlan: session.assessmentPlan ?? { diagnosis: '', plan: '', nextVisit: '', notes: '' },
      }));
    }
  } catch (e) {
    console.error('Failed to load sessions from storage:', e);
  }
  return [createEmptyPatientSession()];
}

function loadActiveSessionIdFromStorage(sessions: PatientSession[]): string {
  try {
    const stored = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (stored && sessions.some(s => s.id === stored)) {
      return stored;
    }
  } catch (e) {
    console.error('Failed to load active session id:', e);
  }
  return sessions[0]?.id ?? '';
}

export function usePatientSessions() {
  const [sessions, setSessions] = useState<PatientSession[]>(() => loadSessionsFromStorage());
  const [activeSessionId, setActiveSessionId] = useState<string>(() => loadActiveSessionIdFromStorage(sessions));

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];

  // Save to localStorage whenever sessions change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  }, [sessions]);

  // Save active session id
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
    } catch (e) {
      console.error('Failed to save active session id:', e);
    }
  }, [activeSessionId]);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasData = sessions.some(s => 
        s.patientInfo.name ||
        s.complaint.chiefComplaint ||
        s.complaint.symptoms.length > 0 ||
        s.personalOcularHealth.conditions.length > 0 ||
        s.personalGeneralHealth.conditions.length > 0
      );

      if (hasData) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessions]);

  const addSession = useCallback(() => {
    const newSession = createEmptyPatientSession();
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newSession.id);
  }, []);

  const closeSession = useCallback((sessionId: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const newSession = createEmptyPatientSession();
        setActiveSessionId(newSession.id);
        return [newSession];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeSessionId]);

  /**
   * Generic updater for any session field.
   * Usage: updateSessionField(sessionId, 'patientInfo', { name: 'John' })
   */
  const updateSessionField = useCallback(<K extends keyof PatientSession>(
    sessionId: string,
    field: K,
    updates: Partial<PatientSession[K]>
  ) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          [field]: { ...s[field], ...updates }
        };
      })
    );
  }, []);

  const clearAllSessions = useCallback(() => {
    const newSession = createEmptyPatientSession();
    setSessions([newSession]);
    setActiveSessionId(newSession.id);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }, []);

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    addSession,
    closeSession,
    updateSessionField,
    clearAllSessions,
  };
}
