import React from 'react';
import { PreviewSlice } from './PreviewSlice';
import { cn } from '@/lib/utils';

interface SectionHeaderWithPreviewProps {
  title: string;
  preview: React.ReactNode;
  className?: string;
}

export function SectionHeaderWithPreview({
  title,
  preview,
  className,
}: SectionHeaderWithPreviewProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
        {title}
      </h2>
      <div className="w-[240px] shrink-0">
        <PreviewSlice title="Aperçu impression">{preview}</PreviewSlice>
      </div>
    </div>
  );
}
