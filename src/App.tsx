import React, { useState } from 'react';
import {
  CENTRAL_ATOMS,
  LIGAND_ATOMS,
  PRESET_MOLECULES,
  INQUIRY_MISSIONS,
  getVSEPRGeometry,
  PresetMolecule,
} from './data/vseprData';
import { VSEPRViewport3D } from './components/VSEPRViewport3D';
import { VSEPRLibraryTable } from './components/VSEPRLibraryTable';
import { LKPDWorksheet } from './components/LKPDWorksheet';
import {
  Plus,
  Minus,
  RotateCcw,
  CheckCircle2,
  Compass,
  HelpCircle,
  ArrowRight,
  GripVertical,
  Sliders,
  BookOpen,
} from 'lucide-react';

type ActiveSection = 'workbench' | 'inquiry' | 'library' | 'lkpd';

export default function App() {
  // Core 3D Molecule State (Default loaded with H2O so user immediately sees an authentic molecule)
  const [centralAtom, setCentralAtom] = useState<string>('O');
  const [ligandAtom, setLigandAtom] = useState<'H' | 'F' | 'Cl' | 'O'>('H');
  const [bondOrder, setBondOrder] = useState<1 | 2>(1);
  const [xCount, setXCount] = useState<number>(2);
  const [eCount, setECount] = useState<number>(2);

  // Visualization Toggles
  const [showRepulsion, setShowRepulsion] = useState<boolean>(true);
  const [showBondAngle, setShowBondAngle] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Navigation & Pedagogical Inquiry State
  const [activeSection, setActiveSection] = useState<ActiveSection>('workbench');
  const [selectedMissionId, setSelectedMissionId] = useState<string>('mission-h2o');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [showHelpPanel, setShowHelpPanel] = useState<boolean>(false);

  const geometryInfo = getVSEPRGeometry(xCount, eCount);
  const currentCentralObj =
    CENTRAL_ATOMS.find((a) => a.symbol === centralAtom) || CENTRAL_ATOMS[0];

  const currentMission =
    INQUIRY_MISSIONS.find((m) => m.id === selectedMissionId) || INQUIRY_MISSIONS[0];
  const currentStep = currentMission.steps[activeStepIndex] || currentMission.steps[0];

  // Check if current 3D configuration satisfies the active guided inquiry step target
  const isStepTargetMet = (() => {
    if (currentStep.targetX === undefined && currentStep.targetE === undefined) {
      const qKey = `${currentMission.id}-step-${currentStep.stepNumber}`;
      if (currentStep.reflectionQuestion) {
        return selectedQuizAnswers[qKey] === currentStep.reflectionQuestion.correctIndex;
      }
      return true;
    }
    const atomMatch =
      !currentStep.targetCentralAtom || currentStep.targetCentralAtom === centralAtom;
    const xMatch = currentStep.targetX === undefined || currentStep.targetX === xCount;
    const eMatch = currentStep.targetE === undefined || currentStep.targetE === eCount;
    const repMatch = !currentStep.requireRepulsionView || showRepulsion;
    return atomMatch && xMatch && eMatch && repMatch;
  })();

  // Handlers for modifying domains while keeping total domains between 1 and 6
  const handleAddX = () => {
    if (xCount + eCount < 6 && xCount < 6) {
      setXCount((prev) => prev + 1);
    } else if (xCount < 6 && eCount > 0) {
      // Swap 1 E for 1 X if at 6 domain ceiling
      setECount((prev) => prev - 1);
      setXCount((prev) => prev + 1);
    }
  };

  const handleRemoveX = () => {
    if (xCount > 1) {
      setXCount((prev) => prev - 1);
    }
  };

  const handleAddE = () => {
    if (xCount + eCount < 6 && eCount < 4) {
      setECount((prev) => prev + 1);
    } else if (eCount < 4 && xCount > 2) {
      setXCount((prev) => prev - 1);
      setECount((prev) => prev + 1);
    }
  };

  const handleRemoveE = () => {
    if (eCount > 0) {
      setECount((prev) => prev - 1);
    }
  };

  const handleDropDomain = (type: 'X' | 'E') => {
    if (type === 'X') handleAddX();
    else handleAddE();
  };

  const handleSelectPreset = (preset: PresetMolecule) => {
    setCentralAtom(preset.centralAtom);
    setLigandAtom(preset.ligandAtom);
    setBondOrder(preset.bondOrder);
    setXCount(preset.xCount);
    setECount(preset.eCount);
  };

  const handleResetLab = () => {
    setCentralAtom('O');
    setLigandAtom('H');
    setBondOrder(1);
    setXCount(2);
    setECount(2);
    setShowRepulsion(true);
    setShowBondAngle(true);
    setAutoRotate(false);
  };

  const handleApplyStepTarget = () => {
    if (currentStep.targetCentralAtom) {
      const atomObj = CENTRAL_ATOMS.find((a) => a.symbol === currentStep.targetCentralAtom);
      setCentralAtom(currentStep.targetCentralAtom);
      if (atomObj) setLigandAtom(atomObj.defaultLigand);
      setBondOrder(1);
    }
    if (currentStep.targetX !== undefined) setXCount(currentStep.targetX);
    if (currentStep.targetE !== undefined) setECount(currentStep.targetE);
    if (currentStep.requireRepulsionView) setShowRepulsion(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract (Brand — 4 Nav Links — 1 Primary Action) */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#workbench"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('workbench');
          }}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          VSEPR Lab 3D
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto">
          <a
            href="#workbench"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('workbench');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeSection === 'workbench'
                ? 'text-slate-900 border-[#0284C7] font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Workbench 3D
          </a>
          <a
            href="#inquiry"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('inquiry');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeSection === 'inquiry'
                ? 'text-slate-900 border-[#0284C7] font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Misi Inkuiri
          </a>
          <a
            href="#library"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('library');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeSection === 'library'
                ? 'text-slate-900 border-[#0284C7] font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Pustaka VSEPR
          </a>
          <a
            href="#lkpd"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('lkpd');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeSection === 'lkpd'
                ? 'text-slate-900 border-[#0284C7] font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            LKPD Siswa
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleResetLab}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Reset Simulasi
          </button>
        </div>
      </header>

      {/* Main Content Container (1440px max-w desktop presence) */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Top Context Banner & Quick-Try Molecule Bar */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Kimia SMA Kelas X/XI (Fase F)</span>
                <span aria-hidden="true">·</span>
                <span>Model Pembelajaran: Inkuiri Terbimbing (Guided Inquiry)</span>
                <span aria-hidden="true">·</span>
                <span>VSEPR 3D Sandbox</span>
              </div>
              <h1 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight text-balance">
                Menguak Misteri Ruang Molekul & Gaya Tolakan Domain Elektron
              </h1>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-center">
              <button
                type="button"
                onClick={() => setShowHelpPanel((prev) => !prev)}
                className="px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHelpPanel ? 'Tutup Panduan' : 'Panduan Praktikum'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'lkpd' ? 'workbench' : 'lkpd')}
                className="px-3.5 py-2 rounded-lg text-xs font-medium bg-[#0284C7] text-white hover:bg-[#0369A1] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{activeSection === 'lkpd' ? 'Kembali ke Lab 3D' : 'Buka LKPD Inkuiri'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Pedagogical Help Guide */}
          {showHelpPanel && (
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600 leading-relaxed">
              <div>
                <div className="font-semibold text-slate-900 mb-1">
                  1. Cara Merakit Molekul 3D
                </div>
                <p>
                  Pilih <strong>Atom Pusat (A)</strong> di panel kanan, lalu tambahkan <strong>Pasangan Elektron Ikatan / PEI (X)</strong> dan <strong>Pasangan Elektron Bebas / PEB (E)</strong> menggunakan tombol <code>[+]</code> / <code>[-]</code> atau seret (drag-and-drop) kartu domain langsung ke kanvas 3D.
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 mb-1">
                  2. Analisis Gaya Tolakan (PEB vs PEI)
                </div>
                <p>
                  Aktifkan tombol <strong>Analisis Gaya Tolakan</strong> untuk melihat garis putus-putus beranimasi. Amati bahwa <strong>Tolakan PEB–PEB (Merah) &gt; PEB–PEI (Oranye) &gt; PEI–PEI (Biru)</strong> menekan sudut ikatan hingga menyimpang dari sudut idealnya.
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 mb-1">
                  3. Skenario Inkuiri Terbimbing
                </div>
                <p>
                  Ikuti langkah misi di bawah panggung 3D (mulai dari membandingkan mengapa <strong>H₂O</strong> bengkok 104,5° sedangkan <strong>CO₂</strong> lurus 180°, serta mengapa sudut <strong>NH₃</strong> 107° lebih kecil dari <strong>CH₄</strong> 109,5°).
                </p>
              </div>
            </div>
          )}

          {/* Quick-Try Preset Molecule Selector */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap shrink-0 mr-1">
              Contoh Senyawa Nyata:
            </span>
            {PRESET_MOLECULES.map((preset) => {
              const isSelected =
                centralAtom === preset.centralAtom &&
                xCount === preset.xCount &&
                eCount === preset.eCount &&
                bondOrder === preset.bondOrder;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    handleSelectPreset(preset);
                    if (activeSection !== 'workbench' && activeSection !== 'inquiry') {
                      setActiveSection('workbench');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-[#0284C7] text-white border-[#0284C7]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-mono font-semibold">{preset.displayFormula}</span>
                  <span className="mx-1.5 opacity-50">·</span>
                  <span>{preset.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 1 & 2: WORKBENCH 3D & INQUIRY MISSIONS */}
        {(activeSection === 'workbench' || activeSection === 'inquiry') && (
          <>
            {/* Two-Zone Sandbox Layout (Wireframe Implementation) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* LEFT ZONE: 3D Interactive Stage + Catatan Lab (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <VSEPRViewport3D
                  centralAtomSymbol={centralAtom}
                  ligandSymbol={ligandAtom}
                  bondOrder={bondOrder}
                  xCount={xCount}
                  eCount={eCount}
                  showRepulsion={showRepulsion}
                  showBondAngle={showBondAngle}
                  autoRotate={autoRotate}
                  onToggleRepulsion={() => setShowRepulsion((prev) => !prev)}
                  onToggleBondAngle={() => setShowBondAngle((prev) => !prev)}
                  onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
                  onDropDomain={handleDropDomain}
                />

                {/* CATATAN LAB (From Wireframe Bottom Bar) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                      <span>CATATAN LAB ({geometryInfo.displayNotation} — {geometryInfo.molecularShape})</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {geometryInfo.labNote}
                    </p>
                  </div>

                  <div className="shrink-0 text-right font-mono tabular-nums bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-200/80">
                    <div className="text-[11px] text-slate-500">Penyimpangan Sudut</div>
                    <div className="text-sm font-bold text-slate-900">
                      {geometryInfo.deviationDeg === 0
                        ? '0.0° (Simetris Ideal)'
                        : `${geometryInfo.deviationDeg.toFixed(1)}° dari ${geometryInfo.idealAngleText}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT ZONE: PANEL KONTROL DOMAIN ELEKTRON (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-5">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        Panel Kontrol Domain Elektron
                      </h2>
                      <p className="text-xs text-slate-500">
                        Klik tombol [+] / [-] atau seret kartu PEI/PEB ke kanvas 3D
                      </p>
                    </div>
                    <span className="font-mono tabular-nums text-xs font-medium text-slate-600">
                      Total: {xCount + eCount}/6 Domain
                    </span>
                  </div>

                  {/* 1. Atom Pusat (A) Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        1. Atom Pusat (A) : [{centralAtom}] {currentCentralObj.name}
                      </span>
                      <span className="text-slate-500">
                        {currentCentralObj.valenceElectrons} Elektron Valensi · {currentCentralObj.group}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {CENTRAL_ATOMS.map((atom) => {
                        const active = atom.symbol === centralAtom;
                        return (
                          <button
                            key={atom.symbol}
                            type="button"
                            onClick={() => {
                              setCentralAtom(atom.symbol);
                              setLigandAtom(atom.defaultLigand);
                            }}
                            className={`py-2 px-2 rounded-lg font-mono text-xs font-bold border transition-colors flex flex-col items-center justify-center ${
                              active
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{atom.symbol}</span>
                            <span className="text-[10px] font-normal opacity-75">
                              {atom.valenceElectrons}e⁻
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Tambah PEI (X) Control + Draggable Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', 'X')}
                        className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
                        title="Seret ke area 3D untuk menambah PEI (X)"
                      >
                        <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-slate-900">
                            Pasangan Elektron Ikatan — PEI (X)
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Domain ikatan kovalen A–{ligandAtom} (Seret ke 3D atau klik +/-)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={handleRemoveX}
                          disabled={xCount <= 1}
                          aria-label="Kurangi PEI"
                          className="w-8 h-8 rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono tabular-nums font-bold text-sm text-slate-900">
                          {xCount}
                        </span>
                        <button
                          type="button"
                          onClick={handleAddX}
                          disabled={xCount >= 6}
                          aria-label="Tambah PEI"
                          className="w-8 h-8 rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Ligand & Bond Order Sub-Controls */}
                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Atom X:</span>
                        {(['H', 'F', 'Cl', 'O'] as const).map((lig) => (
                          <button
                            key={lig}
                            type="button"
                            onClick={() => setLigandAtom(lig)}
                            className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                              ligandAtom === lig
                                ? 'bg-[#0284C7] text-white font-semibold'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {lig}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setBondOrder(1)}
                          className={`px-2 py-0.5 rounded text-xs transition-colors whitespace-nowrap ${
                            bondOrder === 1
                              ? 'bg-slate-800 text-white font-medium'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          Tunggal (—)
                        </button>
                        <button
                          type="button"
                          onClick={() => setBondOrder(2)}
                          className={`px-2 py-0.5 rounded text-xs transition-colors whitespace-nowrap ${
                            bondOrder === 2
                              ? 'bg-slate-800 text-white font-medium'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          Rangkap (=)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Tambah PEB (E) Control + Draggable Card */}
                  <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', 'E')}
                        className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
                        title="Seret ke area 3D untuk menambah PEB (E)"
                      >
                        <GripVertical className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-slate-900">
                            Pasangan Elektron Bebas — PEB (E)
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Awan orbital elektron non-ikatan (Tolakan kuat)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={handleRemoveE}
                          disabled={eCount <= 0}
                          aria-label="Kurangi PEB"
                          className="w-8 h-8 rounded-lg border border-amber-300 bg-white text-slate-800 hover:bg-amber-100/60 disabled:opacity-40 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono tabular-nums font-bold text-sm text-amber-900">
                          {eCount}
                        </span>
                        <button
                          type="button"
                          onClick={handleAddE}
                          disabled={eCount >= 4}
                          aria-label="Tambah PEB"
                          className="w-8 h-8 rounded-lg border border-amber-300 bg-white text-slate-800 hover:bg-amber-100/60 disabled:opacity-40 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4. Validasi Otomatis VSEPR Readout Box (Matching Wireframe) */}
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-400">NOTASI VSEPR</span>
                      <span className="font-mono text-base font-bold text-[#38BDF8]">
                        {geometryInfo.displayNotation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-400">GEOMETRI DOMAIN</span>
                      <span className="text-xs font-medium text-slate-200">
                        {geometryInfo.domainGeometry} ({geometryInfo.totalDomains} Domain · {geometryInfo.hybridization})
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-400">NAMA BENTUK</span>
                      <span className="text-xs font-semibold text-emerald-400 text-right">
                        {geometryInfo.molecularShape}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-400">SUDUT IKATAN</span>
                      <span className="font-mono tabular-nums text-xs font-bold text-amber-400">
                        {geometryInfo.actualAngleText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">KEPOLARAN & CONTOH</span>
                      <span className="text-xs text-slate-300 font-mono">
                        {geometryInfo.polarity} · {geometryInfo.examples.slice(0, 3).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Checkboxes for Repulsion Force Lines & Bond Angle Arc */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <label className="flex items-center justify-between gap-3 cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900">
                    <span>Tampilkan Garis Gaya Tolakan (PEB–PEB &gt; PEB–PEI &gt; PEI–PEI)</span>
                    <input
                      type="checkbox"
                      checked={showRepulsion}
                      onChange={(e) => setShowRepulsion(e.target.checked)}
                      className="w-4 h-4 accent-[#0284C7] rounded cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900">
                    <span>Tampilkan Busur & Nilai Sudut Ikatan 3D</span>
                    <input
                      type="checkbox"
                      checked={showBondAngle}
                      onChange={(e) => setShowBondAngle(e.target.checked)}
                      className="w-4 h-4 accent-[#0284C7] rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* SKENARIO PEMBELAJARAN & MODE EKSPERIMEN INKUIRI (Interactive Stepper) */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    Skenario Pembelajaran Inkuiri Terbimbing · Tantangan Misteri VSEPR
                  </div>
                  <h2 className="mt-0.5 text-xl font-semibold text-slate-900">
                    {currentMission.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-600">
                    {currentMission.researchQuestion}
                  </p>
                </div>

                {/* Mission Selector Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/80 self-start">
                  {INQUIRY_MISSIONS.map((m, idx) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMissionId(m.id);
                        setActiveStepIndex(0);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        selectedMissionId === m.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Misi {idx + 1}: {idx === 0 ? 'Air (H₂O vs CO₂)' : idx === 1 ? 'NH₃ vs CH₄' : 'SF₄ vs XeF₄'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stepper Progress Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentMission.steps.map((step, idx) => {
                  const isActive = idx === activeStepIndex;
                  return (
                    <button
                      key={step.stepNumber}
                      type="button"
                      onClick={() => setActiveStepIndex(idx)}
                      className={`text-left p-3.5 rounded-xl border transition-colors ${
                        isActive
                          ? 'bg-sky-50/70 border-[#0284C7] text-slate-900'
                          : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Langkah {step.stepNumber}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          {step.pedagogicalPhase}
                        </span>
                      </div>
                      <div className="mt-1 text-xs font-medium text-slate-800 line-clamp-1">
                        {step.phaseTitle.replace(/^Langkah \d+:\s*/, '')}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Detail Card */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="text-xs font-semibold text-[#0284C7]">
                      {currentStep.phaseTitle} · {currentStep.pedagogicalPhase}
                    </div>
                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      {currentStep.instruction}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {currentStep.cognitivePrompt}
                    </p>
                  </div>

                  {/* Quick-Apply Target Configuration Button if step has a 3D target */}
                  {currentStep.targetX !== undefined && (
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {isStepTargetMet ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Konfigurasi 3D Sesuai Target!</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyStepTarget}
                          className="px-3.5 py-2 rounded-lg text-xs font-medium bg-[#0284C7] text-white hover:bg-[#0369A1] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>
                            Terapkan ke 3D (Atom {currentStep.targetCentralAtom}, X={currentStep.targetX}, E={currentStep.targetE})
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Interactive Cognitive Conflict / Reflection Question if present */}
                {currentStep.reflectionQuestion && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="text-xs font-semibold text-slate-900">
                      Pertanyaan Uji Pemahaman Inkuiri: {currentStep.reflectionQuestion.question}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {currentStep.reflectionQuestion.options.map((opt, optIdx) => {
                        const qKey = `${currentMission.id}-step-${currentStep.stepNumber}`;
                        const chosen = selectedQuizAnswers[qKey];
                        const isSelected = chosen === optIdx;
                        const isCorrect = optIdx === currentStep.reflectionQuestion!.correctIndex;

                        let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                        if (isSelected && isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-50 border-red-400 text-red-900';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() =>
                              setSelectedQuizAnswers((prev) => ({ ...prev, [qKey]: optIdx }))
                            }
                            className={`text-left px-4 py-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-3 ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <span className="text-[11px] font-semibold shrink-0">
                                {isCorrect ? '✓ Jawaban Tepat' : '× Kurang Tepat'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedQuizAnswers[`${currentMission.id}-step-${currentStep.stepNumber}`] !==
                      undefined && (
                      <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                        <strong>Penjelasan Konsep:</strong> {currentStep.reflectionQuestion.explanation}
                      </div>
                    )}
                  </div>
                )}

                {/* Step Navigation Footer */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex((i) => Math.max(0, i - 1))}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  >
                    Langkah Sebelumnya
                  </button>

                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    Langkah {activeStepIndex + 1} dari {currentMission.steps.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (activeStepIndex < currentMission.steps.length - 1) {
                        setActiveStepIndex((i) => i + 1);
                      } else {
                        setActiveSection('lkpd');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>
                      {activeStepIndex < currentMission.steps.length - 1
                        ? 'Langkah Berikutnya'
                        : 'Lanjut Isi LKPD Siswa'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* SECTION 3: TABEL PUSTAKA VSEPR */}
        {(activeSection === 'library' || activeSection === 'workbench') && (
          <VSEPRLibraryTable
            currentX={xCount}
            currentE={eCount}
            onSelectGeometry={(newX, newE) => {
              setXCount(newX);
              setECount(newE);
              setActiveSection('workbench');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* SECTION 4: LKPD INKUIRI TERBIMBING */}
        {activeSection === 'lkpd' && (
          <LKPDWorksheet
            currentCentralAtom={centralAtom}
            currentX={xCount}
            currentE={eCount}
            onLoadMoleculeTo3D={(central, newX, newE, order, lig) => {
              setCentralAtom(central);
              setXCount(newX);
              setECount(newE);
              setBondOrder(order);
              setLigandAtom(lig);
            }}
          />
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-5 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            VSEPR Lab: Menguak Misteri Ruang Molekul · Media Pembelajaran Kimia SMA Fase F (Kelas X/XI)
          </div>
          <div className="flex items-center gap-3">
            <span>Model Inkuiri Terbimbing</span>
            <span aria-hidden="true">·</span>
            <span>Algoritma Minimisasi Tolakan VSEPR 3D</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
