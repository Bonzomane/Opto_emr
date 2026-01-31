import { useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { PatientSession } from '@/types/emr';
import { parseRxParts } from '@/lib/rxFormat';

export default function PrintRx() {
  const location = useLocation();
  const session = location.state?.session as PatientSession | undefined;
  const [validity, setValidity] = useState<1 | 2>(2);

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500">Aucune donnée patient à prévisualiser.</p>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au DME
          </Link>
        </Button>
      </div>
    );
  }

  const { patientInfo, refraction } = session;
  const today = new Date().toLocaleDateString('fr-CA');

  return (
    <div className="min-h-screen bg-zinc-300 print:bg-white">
      {/* Toolbar */}
      <div className="print:hidden bg-white border-b border-zinc-200 px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <Button asChild variant="ghost" size="sm">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Retour</Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">Validité:</span>
          <Button 
            variant={validity === 1 ? "default" : "outline"} 
            size="sm"
            onClick={() => setValidity(1)}
          >
            1 an
          </Button>
          <Button 
            variant={validity === 2 ? "default" : "outline"} 
            size="sm"
            onClick={() => setValidity(2)}
          >
            2 ans
          </Button>
        </div>
        <Button onClick={() => window.print()} size="sm">
          <Printer className="h-4 w-4 mr-2" />Imprimer
        </Button>
      </div>

      {/* Rx Page */}
      <div className="flex justify-center p-4 print:p-0">
        <div className="print-page bg-white w-[8.5in] min-h-[11in] shadow-lg print:shadow-none p-8 print:p-6">
          
          {/* Header */}
          <div className="text-center border-b-2 border-zinc-800 pb-4 mb-6">
            <h1 className="text-2xl font-bold tracking-wide">ORDONNANCE OPTIQUE</h1>
            <div className="mt-2 text-sm text-zinc-600">
              <p>LensCrafters - Place Montréal Trust</p>
              <p>1500, avenue McGill College, Montréal, QC H3A 3J5</p>
              <p>Tél: (514) 844-3937</p>
            </div>
          </div>

          {/* Patient Sticker Area + Date */}
          <div className="flex justify-between mb-8">
            {/* Sticker placeholder or patient name */}
            <div className="w-80 h-28 border border-dashed border-zinc-300 rounded flex items-center justify-center text-sm text-zinc-400">
              {patientInfo.name || 'Étiquette patient'}
            </div>
            <div className="text-right text-sm">
              <p><span className="text-zinc-500">Date:</span> {today}</p>
            </div>
          </div>

          {/* Rx Table */}
          <div className="flex-1">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-zinc-100">
                  <th className="border border-zinc-300 p-3 w-16"></th>
                  <th className="border border-zinc-300 p-3">Sphère</th>
                  <th className="border border-zinc-300 p-3">Cylindre</th>
                  <th className="border border-zinc-300 p-3">Axe</th>
                  <th className="border border-zinc-300 p-3">Add</th>
                  <th className="border border-zinc-300 p-3">AV</th>
                </tr>
              </thead>
              <tbody className="text-lg">
                <tr>
                  <td className="border border-zinc-300 p-3 font-bold bg-zinc-50">OD</td>
                  <td className="border border-zinc-300 p-3">
                    {(() => {
                      const parts = parseRxParts(refraction.rxOD);
                      if (!parts.cyl) return parts.sph ? `${parts.sph} sph.` : '—';
                      return parts.sph || 'plano';
                    })()}
                  </td>
                  <td className="border border-zinc-300 p-3">{parseRxParts(refraction.rxOD).cyl || '—'}</td>
                  <td className="border border-zinc-300 p-3">{parseRxParts(refraction.rxOD).axis ? `${parseRxParts(refraction.rxOD).axis}°` : '—'}</td>
                  <td className="border border-zinc-300 p-3">{refraction.addOD || '—'}</td>
                  <td className="border border-zinc-300 p-3">{refraction.avOD || '—'}</td>
                </tr>
                <tr>
                  <td className="border border-zinc-300 p-3 font-bold bg-zinc-50">OS</td>
                  <td className="border border-zinc-300 p-3">
                    {(() => {
                      const parts = parseRxParts(refraction.rxOS);
                      if (!parts.cyl) return parts.sph ? `${parts.sph} sph.` : '—';
                      return parts.sph || 'plano';
                    })()}
                  </td>
                  <td className="border border-zinc-300 p-3">{parseRxParts(refraction.rxOS).cyl || '—'}</td>
                  <td className="border border-zinc-300 p-3">{parseRxParts(refraction.rxOS).axis ? `${parseRxParts(refraction.rxOS).axis}°` : '—'}</td>
                  <td className="border border-zinc-300 p-3">{refraction.addOS || '—'}</td>
                  <td className="border border-zinc-300 p-3">{refraction.avOS || '—'}</td>
                </tr>
              </tbody>
            </table>

            {/* DP & Vertex */}
            <div className="mt-6 flex gap-8 text-sm">
              {refraction.dpVL && (
                <p><span className="text-zinc-500">DP VL:</span> <span className="font-medium">{refraction.dpVL} mm</span></p>
              )}
              {refraction.dpVP && (
                <p><span className="text-zinc-500">DP VP:</span> <span className="font-medium">{refraction.dpVP} mm</span></p>
              )}
              <p><span className="text-zinc-500">Vertex:</span> <span className="inline-block w-16 border-b border-zinc-400"></span> mm</p>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <p className="text-sm text-zinc-500 mb-2">Notes:</p>
              <div className="border-b border-zinc-300 h-6"></div>
              <div className="border-b border-zinc-300 h-6"></div>
              <div className="border-b border-zinc-300 h-6"></div>
              {refraction.notes && (
                <p className="mt-2 text-sm text-zinc-600">{refraction.notes}</p>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="mt-8 pt-6 border-t border-zinc-300">
            <div className="flex justify-between items-end">
              <div className="text-sm text-zinc-500">
                <p>Valide pour {validity} an{validity > 1 ? 's' : ''}</p>
              </div>
              <div className="text-center">
                <div className="w-64 border-b border-zinc-400 mb-2 h-12"></div>
                <p className="text-sm font-medium">Dr. Derdour Noreddine, O.D.</p>
                <p className="text-xs text-zinc-500">(322512)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

