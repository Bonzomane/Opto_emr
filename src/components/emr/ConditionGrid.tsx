import { TriStateButton, TriStateOption, TriStateOptionGroup } from './TriStateButton';
import { useItemSelection } from '@/hooks/useItemSelection';

export interface ConditionOption {
  id: string;
  label: string;
}

export interface ConditionOptionGroup {
  label: string;
  options: ConditionOption[];
}

export interface ConditionDefinition {
  id: string;
  label: string;
  options?: ConditionOption[];
  groups?: ConditionOptionGroup[];
}

interface ConditionGridProps {
  definitions: ConditionDefinition[];
  items: string[];
  onChange: (items: string[]) => void;
  columns?: 2 | 3 | 4;
}

/**
 * Reusable grid of condition buttons with expandable options.
 * Consolidates the duplicate rendering logic from all health sections.
 */
export function ConditionGrid({
  definitions,
  items,
  onChange,
  columns = 2,
}: ConditionGridProps) {
  const { getState, setItemActive, toggleOption } = useItemSelection(items, onChange);

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-2`}>
      {definitions.map((condition) => {
        const state = getState(condition.id);
        const hasOptions = (condition.options && condition.options.length > 0) || 
                          (condition.groups && condition.groups.length > 0);

        return (
          <TriStateButton
            key={condition.id}
            label={condition.label}
            state={state.active ? 'positive' : 'negative'}
            onStateChange={(newState) => setItemActive(condition.id, newState === 'positive')}
            hasSelectedDetails={state.options.length > 0}
          >
            {/* Render grouped options */}
            {condition.groups?.map((group) => (
              <TriStateOptionGroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <TriStateOption
                    key={option.id}
                    label={option.label}
                    checked={state.options.includes(option.id)}
                    onChange={(checked) => toggleOption(condition.id, option.id, checked)}
                  />
                ))}
              </TriStateOptionGroup>
            ))}
            
            {/* Render flat options (no groups) */}
            {!condition.groups && condition.options && condition.options.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {condition.options.map((option) => (
                  <TriStateOption
                    key={option.id}
                    label={option.label}
                    checked={state.options.includes(option.id)}
                    onChange={(checked) => toggleOption(condition.id, option.id, checked)}
                  />
                ))}
              </div>
            )}
          </TriStateButton>
        );
      })}
    </div>
  );
}
