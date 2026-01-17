import { Eye, Printer, Glasses, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PatientSession } from '@/types/emr';

interface AppHeaderProps {
  patientName: string;
  session: PatientSession;
  activeSection?: string;
  onClearAll?: () => void;
}

export function AppHeader({ patientName, session, activeSection, onClearAll }: AppHeaderProps) {
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate('/preview', { state: { session, activeSection } });
  };

  const handlePrintRx = () => {
    navigate('/rx', { state: { session, activeSection } });
  };

  const handleClearAll = () => {
    if (onClearAll && window.confirm('⚠️ ATTENTION\n\nVoulez-vous vraiment effacer TOUTES les données?\n\nCette action est irréversible.')) {
      onClearAll();
    }
  };

  return (
    <header className="h-10 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-border">
      <div className="flex items-center gap-2">
        <Eye className="h-5 w-5" />
        <span className="font-semibold text-sm">DME Optométrique</span>
      </div>
      <div className="flex items-center gap-2">
        {patientName && (
          <span className="text-xs text-primary-foreground/80">
            Actuel : {patientName}
          </span>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="h-7 text-xs"
          onClick={handleClearAll}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Effacer
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-7 text-xs"
          onClick={handlePrintRx}
        >
          <Glasses className="h-3.5 w-3.5 mr-1" />
          Rx
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-7 text-xs"
          onClick={handlePreview}
        >
          <Printer className="h-3.5 w-3.5 mr-1" />
          Aperçu
        </Button>
      </div>
    </header>
  );
}
