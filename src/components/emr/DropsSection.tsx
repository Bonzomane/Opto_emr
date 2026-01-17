import { Drops, DIL_AGENTS } from '@/types/emr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CollapsibleNotes } from './CollapsibleNotes';
import { QuickSelectButton } from './QuickSelectButton';
import { SectionHeaderWithPreview } from './SectionHeaderWithPreview';
import { DropsDisplay } from '@/print/sectionDisplays';

interface DropsSectionProps {
  drops: Drops;
  onChange: (updates: Partial<Drops>) => void;
}

 

export function DropsSection({ drops, onChange }: DropsSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeaderWithPreview
        title="Gouttes"
        preview={<DropsDisplay drops={drops} />}
      />

      {/* Dilatation */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium">Dilatation</Label>
          <QuickSelectButton 
            label={drops.dilpiUsed ? "Oui" : "Non"} 
            selected={drops.dilpiUsed} 
            onClick={() => onChange({ dilpiUsed: !drops.dilpiUsed })} 
          />
        </div>
        
        {drops.dilpiUsed && (
          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
            <div>
              <Label className="text-xs text-muted-foreground">Agent</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {DIL_AGENTS.map((agent) => (
                  <QuickSelectButton 
                    key={agent} 
                    label={agent.split(' ')[0]} 
                    selected={drops.dilAgent === agent} 
                    onClick={() => onChange({ dilAgent: drops.dilAgent === agent ? '' : agent })} 
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">OD</span>
                <Input
                  type="number"
                  min="0"
                  max="9"
                  placeholder="gtt"
                  value={drops.dilDropsOD}
                  onChange={(e) => onChange({ dilDropsOD: e.target.value })}
                  className="w-14 h-8 text-center text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">OS</span>
                <Input
                  type="number"
                  min="0"
                  max="9"
                  placeholder="gtt"
                  value={drops.dilDropsOS}
                  onChange={(e) => onChange({ dilDropsOS: e.target.value })}
                  className="w-14 h-8 text-center text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Heure</span>
                <Input
                  type="time"
                  value={drops.dilTime}
                  onChange={(e) => onChange({ dilTime: e.target.value })}
                  className="w-28 h-8 text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fluorescéine */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium">Fluorescéine</Label>
          <QuickSelectButton 
            label={drops.fluorescein ? "Oui" : "Non"} 
            selected={drops.fluorescein} 
            onClick={() => onChange({ fluorescein: !drops.fluorescein })} 
          />
        </div>
        {drops.fluorescein && (
          <div className="flex items-center gap-4 pl-4 border-l-2 border-primary/20">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">OD</span>
              <Input
                type="number"
                min="0"
                max="9"
                placeholder="gtt"
                value={drops.fluorDropsOD}
                onChange={(e) => onChange({ fluorDropsOD: e.target.value })}
                className="w-14 h-8 text-center text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">OS</span>
              <Input
                type="number"
                min="0"
                max="9"
                placeholder="gtt"
                value={drops.fluorDropsOS}
                onChange={(e) => onChange({ fluorDropsOS: e.target.value })}
                className="w-14 h-8 text-center text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Anesthésique */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium">Anesthésique</Label>
          <QuickSelectButton 
            label={drops.anesthetic ? "Oui" : "Non"} 
            selected={drops.anesthetic} 
            onClick={() => onChange({ anesthetic: !drops.anesthetic })} 
          />
        </div>
        
        {drops.anesthetic && (
          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
            <div>
              <Label className="text-xs text-muted-foreground">Agent</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                <QuickSelectButton label="Proparacaïne" selected={drops.anestheticAgent === 'Proparacaïne'} onClick={() => onChange({ anestheticAgent: drops.anestheticAgent === 'Proparacaïne' ? '' : 'Proparacaïne' })} />
                <QuickSelectButton label="Tétracaïne" selected={drops.anestheticAgent === 'Tétracaïne'} onClick={() => onChange({ anestheticAgent: drops.anestheticAgent === 'Tétracaïne' ? '' : 'Tétracaïne' })} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">OD</span>
                <Input
                  type="number"
                  min="0"
                  max="9"
                  placeholder="gtt"
                  value={drops.anesthDropsOD}
                  onChange={(e) => onChange({ anesthDropsOD: e.target.value })}
                  className="w-14 h-8 text-center text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">OS</span>
                <Input
                  type="number"
                  min="0"
                  max="9"
                  placeholder="gtt"
                  value={drops.anesthDropsOS}
                  onChange={(e) => onChange({ anesthDropsOS: e.target.value })}
                  className="w-14 h-8 text-center text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <CollapsibleNotes
        id="drops-notes"
        value={drops.notes}
        onChange={(value) => onChange({ notes: value })}
        placeholder="Notes gouttes..."
      />
    </div>
  );
}
