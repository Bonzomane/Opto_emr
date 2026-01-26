import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LateralizedInputProps {
  label: string;
  od: React.ReactNode;
  os: React.ReactNode;
  ou?: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function LateralizedInput({
  label,
  od,
  os,
  ou,
  className,
  labelClassName,
}: LateralizedInputProps) {
  return (
    <div className={cn('grid grid-cols-12 gap-2 items-start', className)}>
      <div className={cn('col-span-3 pt-2', labelClassName)}>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </Label>
      </div>
      <div className="col-span-9 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-400 block uppercase ml-1">OD</span>
            {od}
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-400 block uppercase ml-1">OS</span>
            {os}
          </div>
        </div>
        {ou && (
          <div className="space-y-1.5 border-t border-zinc-100 pt-2">
            <span className="text-[10px] font-bold text-zinc-400 block uppercase ml-1">OU</span>
            {ou}
          </div>
        )}
      </div>
    </div>
  );
}
