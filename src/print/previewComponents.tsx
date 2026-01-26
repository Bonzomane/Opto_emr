import React from 'react';

export const PRINT_COLORS = {
  label: 'text-zinc-400',
  sublabel: 'text-zinc-500', 
  text: 'text-zinc-600',
  heading: 'text-zinc-700',
  border: 'border-zinc-300',
};

export function Empty() {
  return <span className={`${PRINT_COLORS.label} italic`}>Aucun</span>;
}

export function Note({ text }: { text: string }) {
  return (
    <p className={`text-[10px] ${PRINT_COLORS.sublabel} mt-1.5 pl-2 border-l-2 ${PRINT_COLORS.border} italic`}>
      {text}
    </p>
  );
}

export function AttachedNote() {
  return <span className={`italic ${PRINT_COLORS.sublabel}`}>Imprimé et joint</span>;
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className={`text-[9px] ${PRINT_COLORS.label} uppercase block`}>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function SubLabel({ children }: { children: React.ReactNode }) {
  return <span className={`text-[9px] ${PRINT_COLORS.label} uppercase block`}>{children}</span>;
}

export function DataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <SubLabel>{label}</SubLabel>
      <div className="flex gap-2 flex-wrap">{children}</div>
    </div>
  );
}
