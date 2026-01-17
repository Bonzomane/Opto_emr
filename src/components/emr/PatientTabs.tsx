import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatientSession } from '@/types/emr';
import { cn } from '@/lib/utils';

interface PatientTabsProps {
  sessions: PatientSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onAddSession: () => void;
  onCloseSession: (sessionId: string) => void;
}

export function PatientTabs({
  sessions,
  activeSessionId,
  onSelectSession,
  onAddSession,
  onCloseSession,
}: PatientTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 border-b border-border overflow-x-auto">
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;
        const displayName = session.patientInfo.name.trim() || 'Nouveau Patient';

        return (
          <div
            key={session.id}
            className={cn(
              'group flex items-center gap-1 px-3 py-1.5 rounded-t-md text-sm cursor-pointer transition-colors min-w-0',
              isActive
                ? 'bg-background text-foreground border border-b-0 border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
            onClick={() => onSelectSession(session.id)}
          >
            <span className="truncate max-w-[120px]">{displayName}</span>
            <button
              className={cn(
                'ml-1 p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors',
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onCloseSession(session.id);
              }}
              aria-label={`Fermer ${displayName}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 ml-1"
        onClick={onAddSession}
        aria-label="Ajouter un nouveau patient"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
