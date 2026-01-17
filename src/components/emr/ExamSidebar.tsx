import { cn } from '@/lib/utils';
import { VisitType } from '@/types/emr';
import { getVisibleSections } from '@/config/sections';
import { ChevronRight } from 'lucide-react';

interface ExamSidebarProps {
  visitType: VisitType | null;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export function ExamSidebar({ visitType, activeSection, onSelectSection }: ExamSidebarProps) {
  const visibleSections = getVisibleSections(visitType);

  return (
    <aside className="w-48 border-r border-border bg-sidebar flex flex-col">
      <div className="p-2 border-b border-sidebar-border">
        <span className="text-xs font-medium text-sidebar-foreground uppercase tracking-wide">
          Sections d'Examen
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-1">
        {visibleSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors text-left',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate flex-1">{section.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
