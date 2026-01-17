import { IOP, VisualFields, OCT, Drops } from '@/types/emr';
import { IOPSection } from './IOPSection';
import { VisualFieldsSection } from './VisualFieldsSection';
import { OCTSection } from './OCTSection';
import { DropsSection } from './DropsSection';

interface DiagnosticTestsSectionProps {
  iop: IOP;
  drops: Drops;
  visualFields: VisualFields;
  oct: OCT;
  onIOPChange: (updates: Partial<IOP>) => void;
  onDropsChange: (updates: Partial<Drops>) => void;
  onVisualFieldsChange: (updates: Partial<VisualFields>) => void;
  onOCTChange: (updates: Partial<OCT>) => void;
}

export function DiagnosticTestsSection({
  iop,
  drops,
  visualFields,
  oct,
  onIOPChange,
  onDropsChange,
  onVisualFieldsChange,
  onOCTChange,
}: DiagnosticTestsSectionProps) {
  return (
    <div className="space-y-8">
      <DropsSection drops={drops} onChange={onDropsChange} />
      <div className="border-t border-border pt-6">
        <IOPSection iop={iop} onChange={onIOPChange} />
      </div>
      <div className="border-t border-border pt-6">
        <VisualFieldsSection visualFields={visualFields} onChange={onVisualFieldsChange} />
      </div>
      <div className="border-t border-border pt-6">
        <OCTSection oct={oct} onChange={onOCTChange} />
      </div>
    </div>
  );
}
