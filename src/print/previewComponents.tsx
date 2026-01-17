import React from 'react';

export function Empty() {
  return <span className="text-zinc-400 italic">Aucun</span>;
}

export function Note({ text }: { text: string }) {
  return (
    <p className="text-[10px] text-zinc-500 mt-1.5 pl-2 border-l-2 border-zinc-300 italic">
      {text}
    </p>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[9px] text-zinc-400 uppercase block">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function SubLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[9px] text-zinc-400 uppercase block">{children}</span>;
}

export function DataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <SubLabel>{label}</SubLabel>
      <div className="flex gap-2 flex-wrap">{children}</div>
    </div>
  );
}
