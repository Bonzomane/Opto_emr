import { useRef, useEffect, useState } from 'react';
import { PatientSession } from '@/types/emr';
import { CASE_HISTORY_SECTIONS } from '@/config/sections';
import { cn } from '@/lib/utils';

interface CaseHistorySectionProps {
  session: PatientSession;
  onUpdateField: <K extends keyof PatientSession>(field: K, updates: Partial<PatientSession[K]>) => void;
}

export function CaseHistorySection({ session, onUpdateField }: CaseHistorySectionProps) {
  const [activeSection, setActiveSection] = useState(CASE_HISTORY_SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let currentSection = CASE_HISTORY_SECTIONS[0].id;

      for (const section of CASE_HISTORY_SECTIONS) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= containerTop + 100) {
            currentSection = section.id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-background border-b border-border pb-2 mb-4">
        <div className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-md">
          {CASE_HISTORY_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                'px-2 py-1.5 text-xs rounded transition-colors',
                activeSection === section.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-8">
        {CASE_HISTORY_SECTIONS.map((section, index) => {
          const Component = section.component;
          const data = session[section.dataKey];
          const isLast = index === CASE_HISTORY_SECTIONS.length - 1;

          return (
            <div
              key={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className={cn('scroll-mt-16', isLast && 'pb-8')}
            >
              <Component
                data={data}
                onChange={(updates: any) => onUpdateField(section.dataKey, updates)}
                session={session}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
