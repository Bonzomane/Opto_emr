import { useEffect, RefObject } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref(s)
 */
export function useClickOutside(
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = Array.isArray(refs)
        ? refs.every((ref) => ref.current && !ref.current.contains(event.target as Node))
        : refs.current && !refs.current.contains(event.target as Node);

      if (isOutside) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, handler, enabled]);
}
