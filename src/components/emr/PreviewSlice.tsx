import React from 'react';
import { cn } from '@/lib/utils';

interface PreviewSliceProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function PreviewSlice({ title = 'Aperçu', children, className }: PreviewSliceProps) {
  return (
    <div className={cn('border border-zinc-300 rounded-lg bg-white shadow-sm p-3', className)}>
      <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wide mb-2">
        {title}
      </div>
      <div className="text-[10px] leading-tight">{children}</div>
    </div>
  );
}
