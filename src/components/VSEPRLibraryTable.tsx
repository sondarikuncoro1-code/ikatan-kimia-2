import React, { useState } from 'react';
import { VSEPR_LIBRARY, VSEPRGeometryInfo } from '../data/vseprData';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface VSEPRLibraryTableProps {
  currentX: number;
  currentE: number;
  onSelectGeometry: (xCount: number, eCount: number) => void;
}

export const VSEPRLibraryTable: React.FC<VSEPRLibraryTableProps> = ({
  currentX,
  currentE,
  onSelectGeometry,
}) => {
  const [domainFilter, setDomainFilter] = useState<number | 'all'>('all');
  const [polarityFilter, setPolarityFilter] = useState<'all' | 'Polar' | 'Nonpolar'>('all');

  const allEntries: VSEPRGeometryInfo[] = Object.values(VSEPR_LIBRARY);

  const filteredEntries = allEntries.filter((item) => {
    const matchDomain = domainFilter === 'all' || item.totalDomains === domainFilter;
    const matchPolarity = polarityFilter === 'all' || item.polarity === polarityFilter;
    return matchDomain && matchPolarity;
  });

  const activeKey = `AX${currentX}E${currentE}`;

  return (
    <section className="space-y-6">
      {/* Header & Interactive Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Referensi Kimia Fase F · Teori Domain Elektron (Gillespie–Nyholm)
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">
            Tabel Pustaka & Validasi Otomatis Geometri VSEPR (AXₙEₘ)
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            Klik pada baris kombinasi domain elektron di bawah untuk memuat struktur molekulnya secara langsung ke dalam Workbench 3D dan mengamati perbandingan sudut ideal vs aktual.
          </p>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            {(['all', 2, 3, 4, 5, 6] as const).map((d) => (
              <button
                key={String(d)}
                type="button"
                onClick={() => setDomainFilter(d)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  domainFilter === d
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d === 'all' ? 'Semua Domain' : `${d} Domain`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            {(['all', 'Polar', 'Nonpolar'] as const).map((pol) => (
              <button
                key={pol}
                type="button"
                onClick={() => setPolarityFilter(pol)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  polarityFilter === pol
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pol === 'all' ? 'Semua Kepolaran' : pol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Scientific Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">Notasi VSEPR</th>
                <th className="py-3.5 px-4 text-center">Domain (PEI + PEB)</th>
                <th className="py-3.5 px-4">Geometri Domain</th>
                <th className="py-3.5 px-4">Nama Bentuk Molekul</th>
                <th className="py-3.5 px-4">Sudut Ikatan Aktual</th>
                <th className="py-3.5 px-4">Kepolaran & Hibridisasi</th>
                <th className="py-3.5 px-4">Contoh Senyawa</th>
                <th className="py-3.5 px-4 text-right">Aksi 3D</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-sm">
              {filteredEntries.map((entry) => {
                const isCurrent = entry.notation === activeKey;
                return (
                  <tr
                    key={entry.notation}
                    onClick={() => onSelectGeometry(entry.xCount, entry.eCount)}
                    className={`cursor-pointer transition-colors ${
                      isCurrent ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{entry.displayNotation}</span>
                        {isCurrent && (
                          <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" aria-label="Aktif di 3D" />
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-xs text-slate-600 whitespace-nowrap">
                      {entry.totalDomains} ({entry.xCount} PEI · {entry.eCount} PEB)
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {entry.domainGeometry}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {entry.molecularShape}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-800 whitespace-nowrap">
                      <span>{entry.actualAngleText}</span>
                      {entry.deviationDeg !== 0 && (
                        <span className="ml-2 text-xs text-amber-700">
                          ({entry.deviationDeg > 0 ? `+${entry.deviationDeg}` : entry.deviationDeg}° dari {entry.idealAngleText})
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      <span className={entry.polarity === 'Polar' ? 'font-semibold text-sky-700' : 'text-slate-700'}>
                        {entry.polarity}
                      </span>
                      <span aria-hidden="true" className="mx-1.5 text-slate-300">
                        ·
                      </span>
                      <span className="font-mono">{entry.hybridization}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700 whitespace-nowrap">
                      {entry.examples.join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectGeometry(entry.xCount, entry.eCount);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0284C7] hover:bg-sky-100/70 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>Simulasikan</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
