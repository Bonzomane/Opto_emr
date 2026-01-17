import { useCallback } from 'react';

export interface ItemState {
  active: boolean;
  options: string[];
}

/**
 * Extracts state for a single item from a list of stored items.
 * Items are stored as 'itemId' or 'itemId:optionId'
 */
export function getItemState(items: string[], itemId: string): ItemState {
  const hasBase = items.includes(itemId);
  const optionPrefix = `${itemId}:`;
  const activeOptions = items
    .filter(item => item.startsWith(optionPrefix))
    .map(item => item.replace(optionPrefix, ''));
  
  return {
    active: hasBase || activeOptions.length > 0,
    options: activeOptions,
  };
}

/**
 * Hook for managing a list of items with optional sub-options.
 * Handles the common pattern of storing items as 'itemId' and 'itemId:optionId'
 */
export function useItemSelection(
  items: string[],
  onChange: (items: string[]) => void
) {
  const getState = useCallback(
    (itemId: string): ItemState => getItemState(items, itemId),
    [items]
  );

  const setItemActive = useCallback(
    (itemId: string, active: boolean) => {
      const optionPrefix = `${itemId}:`;
      // Remove base item and all its options
      let updated = items.filter(
        item => item !== itemId && !item.startsWith(optionPrefix)
      );
      
      if (active) {
        updated.push(itemId);
      }
      
      onChange(updated);
    },
    [items, onChange]
  );

  const toggleOption = useCallback(
    (itemId: string, optionId: string, checked: boolean) => {
      const fullOptionId = `${itemId}:${optionId}`;
      let updated: string[];
      
      if (checked) {
        updated = [...items, fullOptionId];
        // Auto-activate parent if not already active
        if (!items.includes(itemId)) {
          updated.push(itemId);
        }
      } else {
        updated = items.filter(item => item !== fullOptionId);
      }
      
      onChange(updated);
    },
    [items, onChange]
  );

  return {
    getState,
    setItemActive,
    toggleOption,
  };
}
