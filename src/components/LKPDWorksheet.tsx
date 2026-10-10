import React, { useState } from 'react';
import { getVSEPRGeometry } from '../data/vseprData';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';

interface LKPDWorksheetProps {
  currentCentralAtom: string;
  currentX: number;
  currentE: number;
  onLoadMoleculeTo3D: (central: string, x: number, e: number, bondOrder: 1 | 2, ligand: 'H' | 'F' | 'Cl' | 'O') => void;
}

interface ObservationRow {
  id: string;
  formula: string;
  centralAtom: string;
  ligand: 'H' | 'F' | 'Cl' | 'O';
  bondOrder: 1 | 2;
  expectedX: number;
  expectedE: number;
  expectedNotation: string;
  expectedShape: string;
  expectedAngle: string;
  studentX: string;
  studentE: string;
  studentNotation: string;
  studentShape: string;
  studentAngle: string;
  verified: boolean;
}

const INITIAL_OBSERVATION_ROWS: ObservationRow[] = [
  {
    id: 'co2',
    formula: 'CO₂',
    centralAtom: 'C',
    ligand: 'O',
    bondOrder: 2,
    expectedX: 2,
    expectedE: 0,
    expectedNotation: 'AX₂',
    expectedShape: 'Linear',
    expectedAngle: '180.0°',
    studentX: '2',
    studentE: '0',
    studentNotation: 'AX₂',
    studentShape: 'Linear',
    studentAngle: '180.0°',
    verified: true,
  },
  {
    id: 'h2o',
    formula: 'H₂O',
    centralAtom: 'O',
    ligand: 'H',
    bondOrder: 1,
    expectedX: 2,
    expectedE: 2,
    expectedNotation: 'AX₂E₂',
    expectedShape: 'Bentuk V (Bengkok / Angular)',
    expectedAngle: '104.5°',
    studentX: '',
    studentE: '',
    studentNotation: '',
    studentShape: '',
    studentAngle: '',
    verified: false,
  },
  {
    id: 'ch4',
    formula: 'CH₄',
    centralAtom: 'C',
    ligand: 'H',
    bondOrder: 1,
    expectedX: 4,
    expectedE: 0,
    expectedNotation: 'AX₄',
    expectedShape: 'Tetrahedral',
    expectedAngle: '109.5°',
    studentX: '',
    studentE: '',
    studentNotation: '',
    studentShape: '',
    studentAngle: '',
    verified: false,
  },
  {
    id: 'nh3',
    formula: 'NH₃',
    centralAtom: 'N',
    ligand: 'H',
    bondOrder: 1,
    expectedX: 3,
    expectedE: 1,
    expectedNotation: 'AX₃E',
    expectedShape: 'Piramida Trigonal',
    expectedAngle: '107.0°',
    studentX: '',
    studentE: '',
    studentNotation: '',
    studentShape: '',
    studentAngle: '',
    verified: false,
  },
  {
    id: 'bf3',
    formula: 'BF₃',
    centralAtom: 'B',
    ligand: 'F',
    bondOrder: 1,
    expectedX: 3,
    expectedE: 0,
    expectedNotation: 'AX₃',
    expectedShape: 'Segitiga Planar',
    expectedAngle: '120.0°',
    studentX: '',
    studentE: '',
    studentNotation: '',
    studentShape: '',
    studentAngle: '',
    verified: false,
  },
  {
    id: 'sf4',
    formula: 'SF₄',
    centralAtom: 'S',
    ligand: 'F',
    bondOrder: 1,
    expectedX: 4,
    expectedE: 1,
    expectedNotation: 'AX₄E',
    expectedShape: 'Jungkat-jungkit (Seesaw)',
    expectedAngle: '87.8° & 101.6°',
    studentX: '',
    studentE: '',
    studentNotation: '',
    studentShape: '',
    studentAngle: '',
    verified: false,
  },
];

export const LKPDWorksheet: React.FC<LKPDWorksheetProps> = ({
  currentCentralAtom,
  currentX,
  currentE,
  onLoadMoleculeTo3D,
}) => {
  const [studentName, setStudentName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('XI MIPA / Fase F');
  const [groupName, setGroupName] = useState<string>('Kelompok Inkuiri 1');
  const [hypothesisText, setHypothesisText] = useState<string>(
    'Molekul H₂O memiliki pasangan elektron bebas (PEB) pada atom pusat Oksigen yang menolak ikatan O–H sehingga bentuknya membengkok, sedangkan CO₂ tidak memiliki PEB pada atom pusat Karbon.'
  );
  const [analysisAnswer1, setAnalysisAnswer1] = useState<string>(
    'Karena pada NH₃ terdapat 1 PEB yang memiliki awan elektron lebih menyebar dibandingkan PEI pada CH₄. Tolakan PEB–PEI lebih kuat daripada PEI–PEI sehingga sudut ikatan menyempit dari 109,5° menjadi 107,0°.'
  );
  const [conclusionText, setConclusionText] = useState<string>(
    'Geometri molekul ditentukan oleh jumlah PEI (X) dan PEB (E) dengan rumus umum AXₙEₘ. Urutan kekuatan gaya tolakan adalah PEB–PEB > PEB–PEI > PEI–PEI.'
  );
  const [rows, setRows] = useState<ObservationRow[]>(INITIAL_OBSERVATION_ROWS);
  const [showTeacherKey, setShowTeacherKey] = useState<boolean>(false);

  const currentGeometry = getVSEPRGeometry(currentX, currentE);

  const handleAutoFillRow = (rowId: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        onLoadMoleculeTo3D(r.centralAtom, r.expectedX, r.expectedE, r.bondOrder, r.ligand);
        return {
          ...r,
          studentX: String(r.expectedX),
          studentE: String(r.expectedE),
          studentNotation: r.expectedNotation,
          studentShape: r.expectedShape,
          studentAngle: r.expectedAngle,
          verified: true,
        };
      })
    );
  };

  const handleFieldChange = (
    rowId: string,
    field: 'studentX' | 'studentE' | 'studentNotation' | 'studentShape' | 'studentAngle',
    val: string
  ) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const updated = { ...r, [field]: val };
        const xMatch = Number(updated.studentX) === r.expectedX;
        const eMatch = Number(updated.studentE) === r.expectedE;
        updated.verified = xMatch && eMatch;
        if (xMatch && eMatch && !updated.studentNotation) {
          updated.studentNotation = r.expectedNotation;
          updated.studentShape = r.expectedShape;
          updated.studentAngle = r.expectedAngle;
        }
        return updated;
      })
    );
  };

  const handleResetLKPD = () => {
    setRows(INITIAL_OBSERVATION_ROWS);
  };

  const handleDownloadReport = () => {
    const lines = [
      '========================================================================',
      'LEMBAR KERJA PESERTA DIDIK (LKPD) INKUIRI TERBIMBING — KIMIA FASE F',
      'VSEPR LAB: MENGUAK MISTERI RUANG MOLEKUL',
      '========================================================================',
      `Nama Peserta Didik : ${studentName || '(Belum diisi)'}`,
      `Kelas / Fase       : ${studentClass}`,
      `Kelompok           : ${groupName}`,
      '',
      '1. RUMUSAN MASALAH UTAMA:',
      '   Mengapa molekul H₂O (104,5°) bentuknya berbeda dengan CO₂ (180°) padahal sama-sama triatomik?',
      '',
      '2. HIPOTESIS AWAL SISWA:',
      `   ${hypothesisText}`,
      '',
      '3. DATA PENGAMATAN EKSPERIMEN VIRTUAL 3D:',
      '------------------------------------------------------------------------',
      'Senyawa | PEI (X) | PEB (E) | Notasi | Bentuk Molekul              | Sudut',
      '------------------------------------------------------------------------',
      ...rows.map(
        (r) =>
          `${r.formula.padEnd(7)} | ${(r.studentX || '-').padEnd(7)} | ${(r.studentE || '-').padEnd(7)} | ${(
            r.studentNotation || '-'
          ).padEnd(6)} | ${(r.studentShape || '-').padEnd(27)} | ${r.studentAngle || '-'}`
      ),
      '------------------------------------------------------------------------',
      '',
      '4. ANALISIS DATA (NH₃ 107° vs CH₄ 109,5°):',
      `   ${analysisAnswer1}`,
      '',
      '5. KESIMPULAN UMUM (ATURAN VSEPR & RUMUS AXₙEₘ):',
      `   ${conclusionText}`,
      '========================================================================',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LKPD_VSEPR_${(studentName || 'Siswa').replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const verifiedCount = rows.filter((r) => r.verified).length;

  return (
    <section className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Dokumen Kurikulum Merdeka · Sasaran: SMA Kelas X/XI (Fase F) · Model: Inkuiri Terbimbing
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">
            Lembar Kerja Peserta Didik (LKPD) Interaktif
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            Lengkapi tahapan inkuiri terbimbing berikut berdasarkan hasil percobaan pada VSEPR 3D Sandbox, lalu unduh laporan hasil praktikum Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowTeacherKey((prev) => !prev)}
            className="px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            {showTeacherKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showTeacherKey ? 'Sembunyikan Kunci Guru' : 'Tampilkan Kunci & Rubrik Guru'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetLKPD}
            className="px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Tabel</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-[#0284C7] text-white hover:bg-[#0369A1] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Laporan LKPD (.txt)</span>
          </button>
        </div>
      </div>

      {/* Student Identity Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Nama Lengkap Peserta Didik
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Ketik nama lengkap Anda..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0284C7]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Kelas / Fase Pembelajaran
          </label>
          <input
            type="text"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0284C7]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Kelompok Praktikum
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0284C7]"
          />
        </div>
      </div>

      {/* Phase 1 & 2: Orientasi & Merumuskan Pertanyaan / Hipotesis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-medium text-slate-500">
            01. Tahap Orientasi Fenomena
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Mengapa Wujud dan Sifat H₂O Berbeda dengan CO₂?
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Perhatikan rumus kimia air (<span className="font-mono font-medium text-slate-800">H₂O</span>) dan gas karbon dioksida (<span className="font-mono font-medium text-slate-800">CO₂</span>). Kedua senyawa tersebut sama-sama merupakan molekul <strong>triatomik</strong> (tersusun atas 1 atom pusat dan 2 atom pengikat).
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Namun secara makroskopis, <span className="font-mono">CO₂</span> bersifat nonpolar dengan titik didih rendah (wujud gas) dan sudut ikatan <span className="font-mono tabular-nums">180°</span>, sedangkan <span className="font-mono">H₂O</span> bersifat sangat polar (wujud cair) dengan sudut ikatan <span className="font-mono tabular-nums">104,5°</span>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-medium text-slate-500">
            02. Merumuskan Pertanyaan & Hipotesis
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Rumusan Masalah & Hipotesis Siswa
          </h3>
          <p className="text-xs text-slate-500">
            Pertanyaan Inkuiri: Mengapa molekul H₂O bentuknya berbeda dengan CO₂ padahal sama-sama triatomik? Tuliskan dugaan sementara (hipotesis) Anda:
          </p>
          <textarea
            rows={3}
            value={hypothesisText}
            onChange={(e) => setHypothesisText(e.target.value)}
            className="w-full p-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0284C7]"
            placeholder="Tuliskan hipotesis Anda mengenai pengaruh pasangan elektron bebas..."
          />
        </div>
      </div>

      {/* Phase 3: Pengumpulan Data (Eksperimen Virtual) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-medium text-slate-500">
              03. Pengumpulan Data (Eksperimen Virtual VSEPR 3D)
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Tabel Pengamatan Pasangan Elektron Ikatan (PEI) & Bebas (PEB)
            </h3>
          </div>
          <div className="text-xs text-slate-600 font-mono tabular-nums">
            Tervalidasi: {verifiedCount} / {rows.length} Senyawa · Konfigurasi 3D Aktif: {currentCentralAtom} ({currentGeometry.displayNotation})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50">
                <th className="py-3 px-3">Senyawa</th>
                <th className="py-3 px-3">Atom Pusat</th>
                <th className="py-3 px-3 w-24">Jumlah PEI (X)</th>
                <th className="py-3 px-3 w-24">Jumlah PEB (E)</th>
                <th className="py-3 px-3 w-32">Notasi VSEPR</th>
                <th className="py-3 px-3">Bentuk Molekul</th>
                <th className="py-3 px-3 w-32">Sudut Ikatan</th>
                <th className="py-3 px-3 text-right">Uji & Validasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-sm">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                    {row.formula}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-600">
                    {row.centralAtom}
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={row.studentX}
                      onChange={(e) => handleFieldChange(row.id, 'studentX', e.target.value)}
                      placeholder="?"
                      className="w-16 px-2 py-1 text-xs font-mono tabular-nums rounded border border-slate-200 focus:border-[#0284C7] focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={row.studentE}
                      onChange={(e) => handleFieldChange(row.id, 'studentE', e.target.value)}
                      placeholder="?"
                      className="w-16 px-2 py-1 text-xs font-mono tabular-nums rounded border border-slate-200 focus:border-[#0284C7] focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.studentNotation}
                      onChange={(e) => handleFieldChange(row.id, 'studentNotation', e.target.value)}
                      placeholder="AXₙEₘ"
                      className="w-24 px-2 py-1 text-xs font-mono rounded border border-slate-200 focus:border-[#0284C7] focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.studentShape}
                      onChange={(e) => handleFieldChange(row.id, 'studentShape', e.target.value)}
                      placeholder="Nama bentuk..."
                      className="w-full min-w-[140px] px-2 py-1 text-xs rounded border border-slate-200 focus:border-[#0284C7] focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.studentAngle}
                      onChange={(e) => handleFieldChange(row.id, 'studentAngle', e.target.value)}
                      placeholder="...°"
                      className="w-24 px-2 py-1 text-xs font-mono tabular-nums rounded border border-slate-200 focus:border-[#0284C7] focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      {row.verified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Valid</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Belum lengkap</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAutoFillRow(row.id)}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 hover:bg-sky-100 hover:text-[#0284C7] transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                      >
                        <FlaskConical className="w-3 h-3" />
                        <span>Eksperimen 3D</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phase 4 & 5: Analisis & Kesimpulan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-medium text-slate-500">
            04. Analisis & Abstraksi Gaya Tolakan
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Mengapa Sudut NH₃ (107°) Lebih Kecil dari CH₄ (109,5°)?
          </h3>
          <p className="text-xs text-slate-500">
            Jelaskan bagaimana perbedaan kekuatan tolakan antara Pasangan Elektron Bebas (PEB) dan Pasangan Elektron Ikatan (PEI) menyebabkan penyimpangan sudut ikatan:
          </p>
          <textarea
            rows={4}
            value={analysisAnswer1}
            onChange={(e) => setAnalysisAnswer1(e.target.value)}
            className="w-full p-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-medium text-slate-500">
            05. Kesimpulan Akhir
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Rumus Umum Bentuk Molekul (AXₙEₘ)
          </h3>
          <p className="text-xs text-slate-500">
            Simpulkan hubungan antara jumlah PEI (n), jumlah PEB (m), urutan kekuatan tolakan, dan geometri molekul akhir:
          </p>
          <textarea
            rows={4}
            value={conclusionText}
            onChange={(e) => setConclusionText(e.target.value)}
            className="w-full p-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0284C7]"
          />
        </div>
      </div>

      {/* Optional Teacher Rubric & Key Panel */}
      {showTeacherKey && (
        <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs text-sky-400 font-medium">
                Pedoman Guru · Rubrik Asesmen Formatif Inkuiri Terbimbing
              </div>
              <h3 className="text-lg font-semibold text-white mt-0.5">
                Kunci Jawaban & Indikator Ketercapaian Tujuan Pembelajaran (IKTP)
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-1.5">
              <div className="font-semibold text-white">1. Konflik Kognitif H₂O vs CO₂ (Skor 30)</div>
              <p>
                Siswa mampu membuktikan bahwa atom pusat C pada CO₂ memiliki 4 elektron valensi yang seluruhnya dipakai berikatan rangkap dua (AX₂, 0 PEB → Linear 180°), sedangkan O pada H₂O memiliki 6 elektron valensi: 2 elektron untuk 2 PEI dan 4 elektron sisa menjadi 2 PEB (AX₂E₂ → Bentuk V 104,5°).
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-white">2. Analisis Tolakan NH₃ vs CH₄ (Skor 35)</div>
              <p>
                Siswa menemukan pola penyempitan sudut pada domain 4: CH₄ (AX₄, 0 PEB = 109,5°) → NH₃ (AX₃E, 1 PEB = 107,0°) → H₂O (AX₂E₂, 2 PEB = 104,5°). Setiap substitusi 1 PEI dengan 1 PEB menyempitkan sudut sekitar 2,5° karena awan PEB hanya ditarik oleh satu inti atom pusat.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-white">3. Abstraksi Rumus AXₙEₘ (Skor 35)</div>
              <p>
                Siswa merumuskan hierarki gaya tolakan elektrostatik: <strong>PEB–PEB &gt; PEB–PEI &gt; PEI–PEI</strong>, serta memahami mengapa pada domain 5 (AX₄E, AX₃E₂, AX₂E₃) PEB selalu menempati posisi ekuatorial yang lebih longgar (120°).
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
