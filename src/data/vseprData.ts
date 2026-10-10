export interface VSEPRGeometryInfo {
  notation: string; // e.g., "AX2E2"
  displayNotation: string; // e.g., "AX₂E₂"
  xCount: number;
  eCount: number;
  totalDomains: number;
  domainGeometry: string; // Geometri Domain Elektron
  molecularShape: string; // Nama Bentuk Molekul
  englishShape: string;
  idealAngleText: string;
  actualAngleText: string;
  primaryAngleDeg: number; // Numeric angle between X-A-X for arc display
  deviationDeg: number; // Deviation from ideal angle
  polarity: 'Polar' | 'Nonpolar';
  dipoleDescription: string;
  repulsionSummary: string;
  labNote: string;
  examples: string[];
  hybridization: string;
}

export interface CentralAtomOption {
  symbol: string;
  name: string;
  valenceElectrons: number;
  group: string;
  colorHex: string;
  radiusScale: number;
  defaultLigand: 'H' | 'F' | 'Cl' | 'O';
}

export interface PresetMolecule {
  id: string;
  formula: string;
  displayFormula: string;
  name: string;
  centralAtom: string;
  ligandAtom: 'H' | 'F' | 'Cl' | 'O';
  bondOrder: 1 | 2;
  xCount: number;
  eCount: number;
  highlightNote: string;
}

export interface InquiryStep {
  stepNumber: number;
  phaseTitle: string; // e.g., "Langkah 1: Eksplorasi Bebas"
  pedagogicalPhase: 'Orientasi & Eksplorasi' | 'Konflik Kognitif' | 'Investigasi Virtual' | 'Refleksi & Abstraksi';
  instruction: string;
  cognitivePrompt: string;
  targetCentralAtom?: string;
  targetX?: number;
  targetE?: number;
  requireRepulsionView?: boolean;
  reflectionQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface InquiryMission {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  phenomenonIntro: string;
  researchQuestion: string;
  steps: InquiryStep[];
}

export const CENTRAL_ATOMS: CentralAtomOption[] = [
  {
    symbol: 'O',
    name: 'Oksigen',
    valenceElectrons: 6,
    group: 'Golongan VIA (16)',
    colorHex: '#EF4444',
    radiusScale: 1.0,
    defaultLigand: 'H',
  },
  {
    symbol: 'C',
    name: 'Karbon',
    valenceElectrons: 4,
    group: 'Golongan IVA (14)',
    colorHex: '#334155',
    radiusScale: 1.05,
    defaultLigand: 'H',
  },
  {
    symbol: 'N',
    name: 'Nitrogen',
    valenceElectrons: 5,
    group: 'Golongan VA (15)',
    colorHex: '#2563EB',
    radiusScale: 1.02,
    defaultLigand: 'H',
  },
  {
    symbol: 'B',
    name: 'Boron',
    valenceElectrons: 3,
    group: 'Golongan IIIA (13)',
    colorHex: '#D97706',
    radiusScale: 0.98,
    defaultLigand: 'F',
  },
  {
    symbol: 'Be',
    name: 'Berilium',
    valenceElectrons: 2,
    group: 'Golongan IIA (2)',
    colorHex: '#059669',
    radiusScale: 0.95,
    defaultLigand: 'Cl',
  },
  {
    symbol: 'P',
    name: 'Fosfor',
    valenceElectrons: 5,
    group: 'Golongan VA (15)',
    colorHex: '#EA580C',
    radiusScale: 1.15,
    defaultLigand: 'Cl',
  },
  {
    symbol: 'S',
    name: 'Belerang (Sulfur)',
    valenceElectrons: 6,
    group: 'Golongan VIA (16)',
    colorHex: '#EAB308',
    radiusScale: 1.15,
    defaultLigand: 'F',
  },
  {
    symbol: 'Xe',
    name: 'Xenon',
    valenceElectrons: 8,
    group: 'Golongan VIIIA (18)',
    colorHex: '#0284C7',
    radiusScale: 1.22,
    defaultLigand: 'F',
  },
];

export const LIGAND_ATOMS: Record<'H' | 'F' | 'Cl' | 'O', { symbol: string; name: string; colorHex: string; radius: number }> = {
  H: { symbol: 'H', name: 'Hidrogen', colorHex: '#F8FAFC', radius: 0.34 },
  F: { symbol: 'F', name: 'Fluor', colorHex: '#10B981', radius: 0.42 },
  Cl: { symbol: 'Cl', name: 'Klor', colorHex: '#059669', radius: 0.48 },
  O: { symbol: 'O', name: 'Oksigen', colorHex: '#EF4444', radius: 0.44 },
};

export const PRESET_MOLECULES: PresetMolecule[] = [
  {
    id: 'h2o',
    formula: 'H2O',
    displayFormula: 'H₂O',
    name: 'Air (Dihidrogen Monoksida)',
    centralAtom: 'O',
    ligandAtom: 'H',
    bondOrder: 1,
    xCount: 2,
    eCount: 2,
    highlightNote: '2 PEB mendesak ikatan O–H sehingga sudut menyempit dari 109,5° menjadi 104,5° (Bentuk V).',
  },
  {
    id: 'co2',
    formula: 'CO2',
    displayFormula: 'CO₂',
    name: 'Karbon Dioksida',
    centralAtom: 'C',
    ligandAtom: 'O',
    bondOrder: 2,
    xCount: 2,
    eCount: 0,
    highlightNote: 'Tanpa PEB pada atom pusat C, 2 domain ikatan rangkap membentuk garis lurus Linear 180°.',
  },
  {
    id: 'nh3',
    formula: 'NH3',
    displayFormula: 'NH₃',
    name: 'Amonia',
    centralAtom: 'N',
    ligandAtom: 'H',
    bondOrder: 1,
    xCount: 3,
    eCount: 1,
    highlightNote: '1 PEB di puncak menekan 3 ikatan N–H membentuk Piramida Trigonal dengan sudut 107,0°.',
  },
  {
    id: 'ch4',
    formula: 'CH4',
    displayFormula: 'CH₄',
    name: 'Metana',
    centralAtom: 'C',
    ligandAtom: 'H',
    bondOrder: 1,
    xCount: 4,
    eCount: 0,
    highlightNote: '4 PEI identik menyebar simetris sempurna dalam ruang 3D membentuk Tetrahedral 109,5°.',
  },
  {
    id: 'bf3',
    formula: 'BF3',
    displayFormula: 'BF₃',
    name: 'Boron Trifluorida',
    centralAtom: 'B',
    ligandAtom: 'F',
    bondOrder: 1,
    xCount: 3,
    eCount: 0,
    highlightNote: '3 PEI tanpa PEB terletak pada satu bidang datar dengan sudut 120° (Segitiga Planar).',
  },
  {
    id: 'so2',
    formula: 'SO2',
    displayFormula: 'SO₂',
    name: 'Belerang Dioksida',
    centralAtom: 'S',
    ligandAtom: 'O',
    bondOrder: 2,
    xCount: 2,
    eCount: 1,
    highlightNote: '1 PEB pada domain 3 mendorong 2 ikatan S=O sehingga sudut mengecil menjadi ~119° (Bentuk V).',
  },
  {
    id: 'pcl5',
    formula: 'PCl5',
    displayFormula: 'PCl₅',
    name: 'Fosfor Pentaklorida',
    centralAtom: 'P',
    ligandAtom: 'Cl',
    bondOrder: 1,
    xCount: 5,
    eCount: 0,
    highlightNote: '5 PEI terbagi menjadi 3 posisi ekuatorial (120°) dan 2 posisi aksial (90°).',
  },
  {
    id: 'sf4',
    formula: 'SF4',
    displayFormula: 'SF₄',
    name: 'Belerang Tetrafluorida',
    centralAtom: 'S',
    ligandAtom: 'F',
    bondOrder: 1,
    xCount: 4,
    eCount: 1,
    highlightNote: '1 PEB menempati posisi sabuk ekuatorial untuk meminimalkan tolakan 90°, menghasilkan bentuk Jungkat-jungkit.',
  },
  {
    id: 'sf6',
    formula: 'SF6',
    displayFormula: 'SF₆',
    name: 'Belerang Heksafluorida',
    centralAtom: 'S',
    ligandAtom: 'F',
    bondOrder: 1,
    xCount: 6,
    eCount: 0,
    highlightNote: '6 PEI simetris sempurna dengan seluruh sudut ikatan 90° (Oktahedral Nonpolar).',
  },
  {
    id: 'xef4',
    formula: 'XeF4',
    displayFormula: 'XeF₄',
    name: 'Xenon Tetrafluorida',
    centralAtom: 'Xe',
    ligandAtom: 'F',
    bondOrder: 1,
    xCount: 4,
    eCount: 2,
    highlightNote: '2 PEB menempati kutub berlawanan (trans 180°) sehingga 4 ikatan Xe–F rata membentuk Segi Empat Planar.',
  },
];

export const VSEPR_LIBRARY: Record<string, VSEPRGeometryInfo> = {
  AX2E0: {
    notation: 'AX2E0',
    displayNotation: 'AX₂',
    xCount: 2,
    eCount: 0,
    totalDomains: 2,
    domainGeometry: 'Linear',
    molecularShape: 'Linear',
    englishShape: 'Linear',
    idealAngleText: '180.0°',
    actualAngleText: '180.0°',
    primaryAngleDeg: 180.0,
    deviationDeg: 0,
    polarity: 'Nonpolar',
    dipoleDescription: 'Vektor dipol ikatan saling meniadakan secara simetris (Σμ = 0).',
    repulsionSummary: 'Hanya terdapat tolakan PEI–PEI yang seimbang dari dua arah berlawanan (180°).',
    labNote: 'Kedua pasangan elektron ikatan (PEI) mengambil posisi terjauh pada garis lurus 180° untuk meminimalkan tolakan.',
    examples: ['CO₂', 'BeCl₂', 'CS₂', 'HCN'],
    hybridization: 'sp',
  },
  AX3E0: {
    notation: 'AX3E0',
    displayNotation: 'AX₃',
    xCount: 3,
    eCount: 0,
    totalDomains: 3,
    domainGeometry: 'Segitiga Planar',
    molecularShape: 'Segitiga Planar (Trigonal Planar)',
    englishShape: 'Trigonal Planar',
    idealAngleText: '120.0°',
    actualAngleText: '120.0°',
    primaryAngleDeg: 120.0,
    deviationDeg: 0,
    polarity: 'Nonpolar',
    dipoleDescription: 'Tiga vektor ikatan pada satu bidang datar saling meniadakan (Σμ = 0).',
    repulsionSummary: 'Tiga tolakan PEI–PEI identik membagi bidang lingkaran 360° menjadi 3 × 120°.',
    labNote: 'Ketiga domain ikatan tersebar merata pada bidang ekuatorial membentuk segitiga sama sisi.',
    examples: ['BF₃', 'SO₃', 'BCl₃', 'NO₃⁻'],
    hybridization: 'sp²',
  },
  AX2E1: {
    notation: 'AX2E1',
    displayNotation: 'AX₂E',
    xCount: 2,
    eCount: 1,
    totalDomains: 3,
    domainGeometry: 'Segitiga Planar',
    molecularShape: 'Bentuk V (Bengkok / Angular)',
    englishShape: 'Bent / Angular',
    idealAngleText: '120.0°',
    actualAngleText: '119.0° (<120°)',
    primaryAngleDeg: 119.0,
    deviationDeg: -1.0,
    polarity: 'Polar',
    dipoleDescription: 'Asimetri akibat 1 PEB menghasilkan momen dipol bersih (Σμ ≠ 0).',
    repulsionSummary: 'Tolakan PEB–PEI > PEI–PEI menekan kedua ikatan X mendekat hingga sudut < 120°.',
    labNote: 'Kehadiran 1 awan elektron bebas (PEB) yang lebih gemuk mendorong kedua ikatan X sehingga molekul membengkok.',
    examples: ['SO₂', 'O₃', 'SnCl₂', 'NO₂⁻'],
    hybridization: 'sp²',
  },
  AX4E0: {
    notation: 'AX4E0',
    displayNotation: 'AX₄',
    xCount: 4,
    eCount: 0,
    totalDomains: 4,
    domainGeometry: 'Tetrahedral',
    molecularShape: 'Tetrahedral',
    englishShape: 'Tetrahedral',
    idealAngleText: '109.5°',
    actualAngleText: '109.5°',
    primaryAngleDeg: 109.5,
    deviationDeg: 0,
    polarity: 'Nonpolar',
    dipoleDescription: 'Empat ikatan mengarah ke sudut bidang empat beraturan, resultan dipol nol (Σμ = 0).',
    repulsionSummary: 'Enam interaksi tolakan PEI–PEI bernilai sama besar di seluruh ruang 3D.',
    labNote: 'Pada ruang 3 dimensi, 4 domain elektron mencapai jarak terjauh bukan pada 90° (datar), melainkan 109,5° (Tetrahedral).',
    examples: ['CH₄', 'CCl₄', 'SiH₄', 'NH₄⁺'],
    hybridization: 'sp³',
  },
  AX3E1: {
    notation: 'AX3E1',
    displayNotation: 'AX₃E',
    xCount: 3,
    eCount: 1,
    totalDomains: 4,
    domainGeometry: 'Tetrahedral',
    molecularShape: 'Piramida Trigonal (Trigonal Pyramidal)',
    englishShape: 'Trigonal Pyramidal',
    idealAngleText: '109.5°',
    actualAngleText: '107.0°',
    primaryAngleDeg: 107.0,
    deviationDeg: -2.5,
    polarity: 'Polar',
    dipoleDescription: 'PEB di puncak piramida menciptakan kutub negatif kuat (Σμ ≠ 0).',
    repulsionSummary: '3 tolakan PEB–PEI lebih kuat daripada 3 tolakan PEI–PEI, menyempitkan sudut dari 109,5° ke 107,0°.',
    labNote: 'Bandingkan dengan CH₄ (109,5°): penggantian 1 ikatan dengan 1 PEB pada NH₃ menekan ketiga ikatan N–H ke bawah sebesar 2,5°.',
    examples: ['NH₃', 'PCl₃', 'NF₃', 'H₃O⁺'],
    hybridization: 'sp³',
  },
  AX2E2: {
    notation: 'AX2E2',
    displayNotation: 'AX₂E₂',
    xCount: 2,
    eCount: 2,
    totalDomains: 4,
    domainGeometry: 'Tetrahedral',
    molecularShape: 'Bentuk V (Bengkok / Angular)',
    englishShape: 'Bent / Angular',
    idealAngleText: '109.5°',
    actualAngleText: '104.5°',
    primaryAngleDeg: 104.5,
    deviationDeg: -5.0,
    polarity: 'Polar',
    dipoleDescription: 'Dua PEB menarik rapat elektron ke satu sisi, menjadikan molekul sangat polar (Σμ ≠ 0).',
    repulsionSummary: 'Tolakan sangat kuat PEB–PEB + 4 tolakan PEB–PEI mendesak sudut X–A–X hingga tinggal 104,5°.',
    labNote: 'Perhatikan bagaimana 2 pasang elektron bebas (PEB) saling menolak keras dan mendesak ikatan H–O–H hingga menyempit 5° dari sudut tetrahedral!',
    examples: ['H₂O', 'H₂S', 'OF₂', 'SCl₂'],
    hybridization: 'sp³',
  },
  AX5E0: {
    notation: 'AX5E0',
    displayNotation: 'AX₅',
    xCount: 5,
    eCount: 0,
    totalDomains: 5,
    domainGeometry: 'Bipiramida Trigonal',
    molecularShape: 'Bipiramida Trigonal',
    englishShape: 'Trigonal Bipyramidal',
    idealAngleText: '90.0° & 120.0°',
    actualAngleText: '90.0° (Aksial) & 120.0° (Ekuatorial)',
    primaryAngleDeg: 90.0,
    deviationDeg: 0,
    polarity: 'Nonpolar',
    dipoleDescription: '3 ikatan ekuatorial dan 2 ikatan aksial saling meniadakan secara simetris (Σμ = 0).',
    repulsionSummary: 'Posisi aksial mengalami 3 tolakan 90°, sedangkan posisi ekuatorial hanya mengalami 2 tolakan 90°.',
    labNote: 'Domain 5 memiliki dua jenis posisi: 3 sabuk ekuatorial (120°) dan 2 kutub aksial (90° terhadap bidang ekuatorial).',
    examples: ['PCl₅', 'PF₅', 'AsF₅'],
    hybridization: 'sp³d',
  },
  AX4E1: {
    notation: 'AX4E1',
    displayNotation: 'AX₄E',
    xCount: 4,
    eCount: 1,
    totalDomains: 5,
    domainGeometry: 'Bipiramida Trigonal',
    molecularShape: 'Jungkat-jungkit (Seesaw / Tetrahedral Terdistorsi)',
    englishShape: 'Seesaw',
    idealAngleText: '90.0° & 120.0°',
    actualAngleText: '87.8° & 101.6°',
    primaryAngleDeg: 101.6,
    deviationDeg: -18.4,
    polarity: 'Polar',
    dipoleDescription: '1 PEB di posisi ekuatorial membuat distribusi muatan tidak simetris (Σμ ≠ 0).',
    repulsionSummary: 'PEB memilih posisi ekuatorial karena ruang 120° lebih lega, lalu mendorong ikatan aksial dan ekuatorial.',
    labNote: 'PEB selalu menempati posisi ekuatorial pada domain 5 agar hanya mengalami 2 tolakan 90° (bukan 3 tolakan 90° jika di aksial).',
    examples: ['SF₄', 'TeCl₄', 'IF₄⁺'],
    hybridization: 'sp³d',
  },
  AX3E2: {
    notation: 'AX3E2',
    displayNotation: 'AX₃E₂',
    xCount: 3,
    eCount: 2,
    totalDomains: 5,
    domainGeometry: 'Bipiramida Trigonal',
    molecularShape: 'Bentuk T (T-Shaped)',
    englishShape: 'T-Shaped',
    idealAngleText: '90.0°',
    actualAngleText: '87.5° (<90°)',
    primaryAngleDeg: 87.5,
    deviationDeg: -2.5,
    polarity: 'Polar',
    dipoleDescription: 'Dua PEB di sabuk ekuatorial menyebabkan resultan dipol tidak nol (Σμ ≠ 0).',
    repulsionSummary: 'Dua PEB ekuatorial menekan kedua ikatan aksial sehingga huruf T sedikit melengkung (<90°).',
    labNote: 'Kedua PEB menempati dua sudut segitiga ekuatorial, menyisakan 1 ikatan ekuatorial dan 2 ikatan aksial berbentuk huruf T.',
    examples: ['ClF₃', 'BrF₃', 'ICl₃'],
    hybridization: 'sp³d',
  },
  AX2E3: {
    notation: 'AX2E3',
    displayNotation: 'AX₂E₃',
    xCount: 2,
    eCount: 3,
    totalDomains: 5,
    domainGeometry: 'Bipiramida Trigonal',
    molecularShape: 'Linear',
    englishShape: 'Linear',
    idealAngleText: '180.0°',
    actualAngleText: '180.0°',
    primaryAngleDeg: 180.0,
    deviationDeg: 0,
    polarity: 'Nonpolar',
    dipoleDescription: 'Tiga PEB di sabuk ekuatorial saling meniadakan; dua ikatan aksial lurus 180° (Σμ = 0).',
    repulsionSummary: '3 PEB menguasai seluruh bidang ekuatorial (120°) dan menekan kedua PEI secara seimbang dari segala arah.',
    labNote: 'Walaupun memiliki 3 PEB, ketiganya berada simetris di sabuk ekuatorial sehingga kedua atom X tetap lurus 180° (Nonpolar)!',
    examples: ['XeF₂', 'I₃⁻', 'BrF₂⁻'],
    hybridization: 'sp³d',
  },
  AX6E0: {
    notation: 'AX6E0',
    displayNotation: 'AX₆',
    xCount: 6,
    eCount: 0,
    totalDomains: 6,
    domainGeometry: 'Oktahedral',
    molecularShape: 'Oktahedral',
    englishShape: 'Octahedral',
    idealAngleText: '90.0°',
    actualAngleText: '90.0°',
    primaryAngleDeg: 90.0,
    deviationDeg: 0,
    polarity: 'Nonpolar',
    dipoleDescription: 'Enam ikatan simetris pada sumbu X, Y, Z saling meniadakan (Σμ = 0).',
    repulsionSummary: 'Seluruh 6 posisi pada oktahedral bersifat ekuivalen dengan sudut antar-domain berdekatan 90°.',
    labNote: 'Enam pasangan elektron ikatan menempati enam titik sudut oktahedron beraturan dengan sudut seragam 90°.',
    examples: ['SF₆', 'SeF₆', 'PF₆⁻'],
    hybridization: 'sp³d²',
  },
  AX5E1: {
    notation: 'AX5E1',
    displayNotation: 'AX₅E',
    xCount: 5,
    eCount: 1,
    totalDomains: 6,
    domainGeometry: 'Oktahedral',
    molecularShape: 'Piramida Segi Empat (Square Pyramidal)',
    englishShape: 'Square Pyramidal',
    idealAngleText: '90.0°',
    actualAngleText: '84.8° (<90°)',
    primaryAngleDeg: 84.8,
    deviationDeg: -5.2,
    polarity: 'Polar',
    dipoleDescription: '1 PEB di bagian bawah tidak diimbangi oleh ikatan di seberangnya (Σμ ≠ 0).',
    repulsionSummary: 'Tolakan PEB terhadap 4 PEI bidang alas mengangkat keempat ikatan sedikit ke atas (<90° terhadap puncak).',
    labNote: '1 PEB mendorong 4 ikatan bidang tengah menjauhinya sehingga sudut ikatan puncak terhadap alas menyempit menjadi 84,8°.',
    examples: ['BrF₅', 'IF₅', 'XeOF₄'],
    hybridization: 'sp³d²',
  },
  AX4E2: {
    notation: 'AX4E2',
    displayNotation: 'AX₄E₂',
    xCount: 4,
    eCount: 2,
    totalDomains: 6,
    domainGeometry: 'Oktahedral',
    molecularShape: 'Segi Empat Planar (Square Planar)',
    englishShape: 'Square Planar',
    idealAngleText: '90.0°',
    actualAngleText: '90.0°',
    primaryAngleDeg: 90.0,
    deviationDeg: 0,
    polarity: 'Nonpolar',
    dipoleDescription: 'Dua PEB berada pada posisi trans (180°) sehingga tolakan dan dipol saling meniadakan (Σμ = 0).',
    repulsionSummary: 'Tolakan PEB–PEB diminimalkan dengan mengambil posisi berseberangan 180° (atas & bawah).',
    labNote: 'Agar tolakan PEB–PEB yang sangat besar menjadi minimal, kedua PEB mengambil kutub berlawanan (180°), menyisakan 4 ikatan datar 90°.',
    examples: ['XeF₄', 'ICl₄⁻', 'PtCl₄²⁻'],
    hybridization: 'sp³d²',
  },
};

const SUBSCRIPTS: Record<number, string> = {
  0: '₀',
  1: '',
  2: '₂',
  3: '₃',
  4: '₄',
  5: '₅',
  6: '₆',
};

export function formatVSEPRNotation(xCount: number, eCount: number): string {
  const xPart = `X${SUBSCRIPTS[xCount] ?? xCount}`;
  const ePart = eCount > 0 ? `E${SUBSCRIPTS[eCount] ?? eCount}` : '';
  return `A${xPart}${ePart}`;
}

export function getVSEPRGeometry(xCount: number, eCount: number): VSEPRGeometryInfo {
  const key = `AX${xCount}E${eCount}`;
  if (VSEPR_LIBRARY[key]) {
    return VSEPR_LIBRARY[key];
  }

  const totalDomains = xCount + eCount;
  const displayNotation = formatVSEPRNotation(xCount, eCount);

  if (xCount === 1) {
    return {
      notation: key,
      displayNotation,
      xCount,
      eCount,
      totalDomains,
      domainGeometry: totalDomains === 2 ? 'Linear' : totalDomains === 3 ? 'Segitiga Planar' : 'Tetrahedral',
      molecularShape: 'Linear (Diatomik)',
      englishShape: 'Linear (Diatomic)',
      idealAngleText: '— (Hanya 1 Ikatan)',
      actualAngleText: '— (Tambahkan minimal 2 PEI untuk sudut ikatan)',
      primaryAngleDeg: 180,
      deviationDeg: 0,
      polarity: eCount > 0 ? 'Polar' : 'Nonpolar',
      dipoleDescription: 'Molekul diatomik hanya memiliki satu sumbu ikatan A–X.',
      repulsionSummary: 'Tambahkan minimal 2 Pasangan Elektron Ikatan (PEI) untuk mengamati sudut ikatan X–A–X.',
      labNote: 'Molekul dengan 1 ikatan selalu berbentuk garis lurus (diatomik). Tambahkan minimal 2 PEI (X) untuk mengukur sudut ikatan.',
      examples: ['HF', 'HCl', 'CO'],
      hybridization: totalDomains <= 2 ? 'sp' : totalDomains === 3 ? 'sp²' : 'sp³',
    };
  }

  return {
    notation: key,
    displayNotation,
    xCount,
    eCount,
    totalDomains,
    domainGeometry: totalDomains <= 4 ? 'Tetrahedral' : totalDomains === 5 ? 'Bipiramida Trigonal' : 'Oktahedral',
    molecularShape: 'Kombinasi Eksperimental Khusus',
    englishShape: 'Custom Experimental Configuration',
    idealAngleText: '90.0° – 120.0°',
    actualAngleText: '~90.0°',
    primaryAngleDeg: 90.0,
    deviationDeg: 0,
    polarity: eCount > 0 ? 'Polar' : 'Nonpolar',
    dipoleDescription: 'Kombinasi domain kustom pada mode sandbox.',
    repulsionSummary: 'Gaya tolakan dihitung secara otomatis menggunakan minimisasi energi tolakan pada permukaan bola.',
    labNote: 'Kombinasi AXₙEₘ ini berada di luar tabel standar SMA Fase F. Sesuaikan jumlah PEI (X) dan PEB (E) agar total domain ≤ 6.',
    examples: ['Eksperimen Sandbox'],
    hybridization: totalDomains === 5 ? 'sp³d' : 'sp³d²',
  };
}

export interface DomainVector3D {
  id: string;
  type: 'X' | 'E';
  index: number;
  x: number;
  y: number;
  z: number;
  positionLabel?: 'Aksial' | 'Ekuatorial' | 'Simetris';
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Computes exact, chemically authentic 3D unit vectors for any (xCount, eCount) configuration,
 * reflecting true VSEPR lone-pair repulsion angular distortions (e.g. 104.5° in H2O, 107.0° in NH3,
 * 119° in SO2, 87.8°/101.6° in SF4, 84.8° in BrF5).
 */
export function computeTargetDomainVectors(xCount: number, eCount: number): DomainVector3D[] {
  const key = `AX${xCount}E${eCount}`;
  const domains: DomainVector3D[] = [];

  // Exact geometries for canonical VSEPR cases
  if (key === 'AX1E0') {
    domains.push({ id: 'X-0', type: 'X', index: 0, x: 1, y: 0, z: 0, positionLabel: 'Simetris' });
    return domains;
  }

  if (key === 'AX2E0') {
    // Linear 180° along X-axis
    domains.push({ id: 'X-0', type: 'X', index: 0, x: -1, y: 0, z: 0, positionLabel: 'Simetris' });
    domains.push({ id: 'X-1', type: 'X', index: 1, x: 1, y: 0, z: 0, positionLabel: 'Simetris' });
    return domains;
  }

  if (key === 'AX3E0') {
    // Trigonal planar in XY plane (120°)
    for (let i = 0; i < 3; i++) {
      const angle = degToRad(90 + i * 120);
      domains.push({
        id: `X-${i}`,
        type: 'X',
        index: i,
        x: Math.cos(angle),
        y: Math.sin(angle),
        z: 0,
        positionLabel: 'Ekuatorial',
      });
    }
    return domains;
  }

  if (key === 'AX2E1') {
    // Bent (119.0° between X-A-X), E at top (+Y), two X pushed slightly down
    const halfAngle = degToRad(119.0 / 2);
    domains.push({
      id: 'X-0',
      type: 'X',
      index: 0,
      x: -Math.sin(halfAngle),
      y: -Math.cos(halfAngle),
      z: 0,
    });
    domains.push({
      id: 'X-1',
      type: 'X',
      index: 1,
      x: Math.sin(halfAngle),
      y: -Math.cos(halfAngle),
      z: 0,
    });
    domains.push({
      id: 'E-0',
      type: 'E',
      index: 0,
      x: 0,
      y: 1,
      z: 0,
    });
    return domains;
  }

  if (key === 'AX4E0') {
    // Regular Tetrahedron (109.47°)
    // Top vertex at +Y, 3 base vertices separated by 120° around Y axis at angle 109.4712° from +Y
    const theta = Math.acos(-1 / 3); // ~109.4712°
    domains.push({ id: 'X-0', type: 'X', index: 0, x: 0, y: 1, z: 0, positionLabel: 'Simetris' });
    for (let i = 0; i < 3; i++) {
      const phi = degToRad(i * 120);
      domains.push({
        id: `X-${i + 1}`,
        type: 'X',
        index: i + 1,
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.cos(theta),
        z: Math.sin(theta) * Math.sin(phi),
        positionLabel: 'Simetris',
      });
    }
    return domains;
  }

  if (key === 'AX3E1') {
    // Trigonal Pyramidal (NH3): E at +Y, 3 X bonds compressed so X-A-X angle = 107.0°
    // Let polar angle from -Y axis be alpha. For 3 symmetric vectors with angle alpha from -Y axis:
    // cos(107°) = cos²(alpha) + sin²(alpha)*cos(120°) = cos²(alpha) - 0.5*sin²(alpha) = 1.5*cos²(alpha) - 0.5
    const cos107 = Math.cos(degToRad(107.0));
    const cosAlpha = Math.sqrt((cos107 + 0.5) / 1.5);
    const sinAlpha = Math.sqrt(Math.max(0, 1 - cosAlpha * cosAlpha));

    for (let i = 0; i < 3; i++) {
      const phi = degToRad(i * 120 + 30);
      domains.push({
        id: `X-${i}`,
        type: 'X',
        index: i,
        x: sinAlpha * Math.cos(phi),
        y: -cosAlpha,
        z: sinAlpha * Math.sin(phi),
      });
    }
    domains.push({ id: 'E-0', type: 'E', index: 0, x: 0, y: 1, z: 0 });
    return domains;
  }

  if (key === 'AX2E2') {
    // Bent / Angular (H2O): 2 X bonds in lower XY plane with exact 104.5° angle;
    // 2 E lone pairs in upper YZ plane with widened ~114.5° angle due to PEB-PEB repulsion!
    const halfXAngle = degToRad(104.5 / 2);
    const halfEAngle = degToRad(114.5 / 2);

    domains.push({
      id: 'X-0',
      type: 'X',
      index: 0,
      x: -Math.sin(halfXAngle),
      y: -Math.cos(halfXAngle),
      z: 0,
    });
    domains.push({
      id: 'X-1',
      type: 'X',
      index: 1,
      x: Math.sin(halfXAngle),
      y: -Math.cos(halfXAngle),
      z: 0,
    });
    domains.push({
      id: 'E-0',
      type: 'E',
      index: 0,
      x: 0,
      y: Math.cos(halfEAngle),
      z: Math.sin(halfEAngle),
    });
    domains.push({
      id: 'E-1',
      type: 'E',
      index: 1,
      x: 0,
      y: Math.cos(halfEAngle),
      z: -Math.sin(halfEAngle),
    });
    return domains;
  }

  if (key === 'AX5E0') {
    // Trigonal Bipyramidal: 2 Axial (+Y, -Y), 3 Equatorial in XZ plane (120°)
    domains.push({ id: 'X-0', type: 'X', index: 0, x: 0, y: 1, z: 0, positionLabel: 'Aksial' });
    domains.push({ id: 'X-1', type: 'X', index: 1, x: 0, y: -1, z: 0, positionLabel: 'Aksial' });
    for (let i = 0; i < 3; i++) {
      const phi = degToRad(i * 120);
      domains.push({
        id: `X-${i + 2}`,
        type: 'X',
        index: i + 2,
        x: Math.cos(phi),
        y: 0,
        z: Math.sin(phi),
        positionLabel: 'Ekuatorial',
      });
    }
    return domains;
  }

  if (key === 'AX4E1') {
    // Seesaw (SF4): E at +Y (equatorial position rotated to top for visual clarity),
    // 2 equatorial legs at 101.6° apart downward, 2 axial legs bent slightly away from E (87.8° from E)
    const halfEq = degToRad(101.6 / 2);
    const axFromE = degToRad(92.2); // pushed past 90° away from E at +Y
    domains.push({
      id: 'X-0',
      type: 'X',
      index: 0,
      x: -Math.sin(halfEq),
      y: -Math.cos(halfEq),
      z: 0,
      positionLabel: 'Ekuatorial',
    });
    domains.push({
      id: 'X-1',
      type: 'X',
      index: 1,
      x: Math.sin(halfEq),
      y: -Math.cos(halfEq),
      z: 0,
      positionLabel: 'Ekuatorial',
    });
    domains.push({
      id: 'X-2',
      type: 'X',
      index: 2,
      x: 0,
      y: Math.cos(axFromE),
      z: Math.sin(axFromE),
      positionLabel: 'Aksial',
    });
    domains.push({
      id: 'X-3',
      type: 'X',
      index: 3,
      x: 0,
      y: Math.cos(axFromE),
      z: -Math.sin(axFromE),
      positionLabel: 'Aksial',
    });
    domains.push({
      id: 'E-0',
      type: 'E',
      index: 0,
      x: 0,
      y: 1,
      z: 0,
      positionLabel: 'Ekuatorial',
    });
    return domains;
  }

  if (key === 'AX3E2') {
    // T-shaped (ClF3): 1 equatorial X along -Y, 2 axial X bent slightly towards -Y (87.5°), 2 E in upper equatorial positions
    const axAngleFromNegY = degToRad(87.5);
    domains.push({ id: 'X-0', type: 'X', index: 0, x: 0, y: -1, z: 0, positionLabel: 'Ekuatorial' });
    domains.push({
      id: 'X-1',
      type: 'X',
      index: 1,
      x: Math.sin(axAngleFromNegY),
      y: -Math.cos(axAngleFromNegY),
      z: 0,
      positionLabel: 'Aksial',
    });
    domains.push({
      id: 'X-2',
      type: 'X',
      index: 2,
      x: -Math.sin(axAngleFromNegY),
      y: -Math.cos(axAngleFromNegY),
      z: 0,
      positionLabel: 'Aksial',
    });
    const halfE = degToRad(124 / 2);
    domains.push({
      id: 'E-0',
      type: 'E',
      index: 0,
      x: 0,
      y: Math.cos(halfE),
      z: Math.sin(halfE),
      positionLabel: 'Ekuatorial',
    });
    domains.push({
      id: 'E-1',
      type: 'E',
      index: 1,
      x: 0,
      y: Math.cos(halfE),
      z: -Math.sin(halfE),
      positionLabel: 'Ekuatorial',
    });
    return domains;
  }

  if (key === 'AX2E3') {
    // Linear (XeF2): 2 Axial X at +Y and -Y (180°), 3 E in XZ equatorial belt (120°)
    domains.push({ id: 'X-0', type: 'X', index: 0, x: 0, y: 1, z: 0, positionLabel: 'Aksial' });
    domains.push({ id: 'X-1', type: 'X', index: 1, x: 0, y: -1, z: 0, positionLabel: 'Aksial' });
    for (let i = 0; i < 3; i++) {
      const phi = degToRad(i * 120);
      domains.push({
        id: `E-${i}`,
        type: 'E',
        index: i,
        x: Math.cos(phi),
        y: 0,
        z: Math.sin(phi),
        positionLabel: 'Ekuatorial',
      });
    }
    return domains;
  }

  if (key === 'AX6E0') {
    // Octahedral (90°)
    const coords: [number, number, number][] = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ];
    coords.forEach(([x, y, z], i) => {
      domains.push({ id: `X-${i}`, type: 'X', index: i, x, y, z, positionLabel: 'Simetris' });
    });
    return domains;
  }

  if (key === 'AX5E1') {
    // Square Pyramidal (BrF5): 1 Axial X at +Y, 1 E at -Y, 4 basal X tilted slightly up (84.8° from +Y)
    const tiltFromTop = degToRad(84.8);
    domains.push({ id: 'X-0', type: 'X', index: 0, x: 0, y: 1, z: 0, positionLabel: 'Aksial' });
    for (let i = 0; i < 4; i++) {
      const phi = degToRad(i * 90 + 45);
      domains.push({
        id: `X-${i + 1}`,
        type: 'X',
        index: i + 1,
        x: Math.sin(tiltFromTop) * Math.cos(phi),
        y: Math.cos(tiltFromTop),
        z: Math.sin(tiltFromTop) * Math.sin(phi),
        positionLabel: 'Ekuatorial',
      });
    }
    domains.push({ id: 'E-0', type: 'E', index: 0, x: 0, y: -1, z: 0, positionLabel: 'Aksial' });
    return domains;
  }

  if (key === 'AX4E2') {
    // Square Planar (XeF4): 4 X in XZ plane (90°), 2 E at +Y and -Y (trans 180°)
    for (let i = 0; i < 4; i++) {
      const phi = degToRad(i * 90 + 45);
      domains.push({
        id: `X-${i}`,
        type: 'X',
        index: i,
        x: Math.cos(phi),
        y: 0,
        z: Math.sin(phi),
        positionLabel: 'Ekuatorial',
      });
    }
    domains.push({ id: 'E-0', type: 'E', index: 0, x: 0, y: 1, z: 0, positionLabel: 'Aksial' });
    domains.push({ id: 'E-1', type: 'E', index: 1, x: 0, y: -1, z: 0, positionLabel: 'Aksial' });
    return domains;
  }

  // General fallback using spherical Fibonacci + Thomson VSEPR repulsion minimization
  const total = xCount + eCount;
  const rawPoints: { type: 'X' | 'E'; index: number; x: number; y: number; z: number }[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < total; i++) {
    const isX = i < xCount;
    const y = total === 1 ? 0 : 1 - (i / (total - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    rawPoints.push({
      type: isX ? 'X' : 'E',
      index: isX ? i : i - xCount,
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    });
  }

  // Iterative Thomson repulsion minimization with VSEPR weights (PEB-PEB: 1.75, PEB-PEI: 1.35, PEI-PEI: 1.0)
  for (let iter = 0; iter < 120; iter++) {
    const forces = rawPoints.map(() => ({ fx: 0, fy: 0, fz: 0 }));
    for (let i = 0; i < total; i++) {
      for (let j = i + 1; j < total; j++) {
        const dx = rawPoints[i].x - rawPoints[j].x;
        const dy = rawPoints[i].y - rawPoints[j].y;
        const dz = rawPoints[i].z - rawPoints[j].z;
        const distSq = dx * dx + dy * dy + dz * dz + 0.01;
        const dist = Math.sqrt(distSq);
        const weight =
          rawPoints[i].type === 'E' && rawPoints[j].type === 'E'
            ? 1.75
            : rawPoints[i].type === 'E' || rawPoints[j].type === 'E'
            ? 1.35
            : 1.0;
        const f = weight / (distSq * dist);
        forces[i].fx += dx * f;
        forces[i].fy += dy * f;
        forces[i].fz += dz * f;
        forces[j].fx -= dx * f;
        forces[j].fy -= dy * f;
        forces[j].fz -= dz * f;
      }
    }
    const step = 0.05;
    for (let i = 0; i < total; i++) {
      const nx = rawPoints[i].x + forces[i].fx * step;
      const ny = rawPoints[i].y + forces[i].fy * step;
      const nz = rawPoints[i].z + forces[i].fz * step;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      rawPoints[i].x = nx / len;
      rawPoints[i].y = ny / len;
      rawPoints[i].z = nz / len;
    }
  }

  return rawPoints.map((p) => ({
    id: `${p.type}-${p.index}`,
    type: p.type,
    index: p.index,
    x: p.x,
    y: p.y,
    z: p.z,
  }));
}

export const INQUIRY_MISSIONS: InquiryMission[] = [
  {
    id: 'mission-h2o',
    title: 'Misi 1: Membangun Istana Molekul Air (H₂O vs CO₂)',
    subtitle: 'Skenario Inkuiri Terbimbing · Mengapa H₂O Bengkok sedangkan CO₂ Lurus?',
    badgeText: 'Misi Utama Fase F',
    phenomenonIntro:
      'Air (H₂O) dan Karbon Dioksida (CO₂) sama-sama merupakan molekul triatomik (tersusun atas 3 atom). Namun pada suhu ruang, CO₂ berwujud gas nonpolar dengan sudut 180°, sedangkan H₂O berwujud cair yang sangat polar dengan sudut ikatan 104,5°.',
    researchQuestion:
      'Mengapa molekul H₂O memiliki bentuk ruang yang berbeda drastis dengan CO₂ padahal keduanya sama-sama tersusun dari 1 atom pusat dan 2 atom pengikat?',
    steps: [
      {
        stepNumber: 1,
        phaseTitle: 'Langkah 1: Eksplorasi Bebas (Hipotesis Awal)',
        pedagogicalPhase: 'Orientasi & Eksplorasi',
        instruction:
          'Pilih Atom Pusat O (Oksigen), lalu atur jumlah Pasangan Elektron Ikatan (PEI / X) = 2 dan Pasangan Elektron Bebas (PEB / E) = 0.',
        cognitivePrompt:
          'Amati geometri ruang ketika hanya ada 2 ikatan tanpa elektron bebas. Bentuk apakah yang terbentuk dan berapa sudut ikatannya?',
        targetCentralAtom: 'O',
        targetX: 2,
        targetE: 0,
      },
      {
        stepNumber: 2,
        phaseTitle: 'Langkah 2: Konflik Kognitif',
        pedagogicalPhase: 'Konflik Kognitif',
        instruction:
          'Pada Langkah 1, molekul dengan rumus AX₂ berbentuk Linear (180°). Namun data spektroskopi laboratorium nyata membuktikan bahwa molekul air (H₂O) TIDAK berbentuk linear, melainkan Bengkok (Bentuk V) dengan sudut 104,5°!',
        cognitivePrompt:
          'Atom Oksigen (Golongan VIA) memiliki 6 elektron valensi. Setelah 2 elektron digunakan untuk berikatan dengan 2 atom H, masih tersisa 4 elektron (2 pasang) yang tidak berikatan. Ke manakah perginya 2 pasang elektron tersebut?',
        reflectionQuestion: {
          question: 'Mengapa model AX₂ (Linear 180°) gagal menjelaskan bentuk molekul H₂O yang sebenarnya?',
          options: [
            'Karena atom Oksigen masih memiliki 2 Pasangan Elektron Bebas (PEB) di kulit valensinya yang ikut menempati ruang 3D.',
            'Karena atom Hidrogen saling tarik-menarik membentuk ikatan hidrogen di dalam satu molekul yang sama.',
            'Karena massa atom Oksigen lebih berat sehingga menarik kedua atom Hidrogen jatuh ke bawah akibat gravitasi.',
          ],
          correctIndex: 0,
          explanation:
            'Tepat! Oksigen memiliki 6 elektron valensi: 2 elektron berpasangan dengan 2 atom H (2 PEI), dan 4 elektron sisanya membentuk 2 Pasangan Elektron Bebas (PEB / E) yang memiliki tolakan elektrostatik kuat.',
        },
      },
      {
        stepNumber: 3,
        phaseTitle: 'Langkah 3: Investigasi Virtual (Uji Tolakan PEB)',
        pedagogicalPhase: 'Investigasi Virtual',
        instruction:
          'Tambahkan 2 Pasangan Elektron Bebas (PEB / E) pada atom pusat O sehingga notasi menjadi AX₂E₂, lalu aktifkan kotak centang "Tampilkan Garis Gaya Tolakan".',
        cognitivePrompt:
          'Perhatikan animasi garis putus-putus merah (Tolakan PEB–PEB) dan oranye (Tolakan PEB–PEI) yang mendesak kedua ikatan O–H ke bawah!',
        targetCentralAtom: 'O',
        targetX: 2,
        targetE: 2,
        requireRepulsionView: true,
      },
      {
        stepNumber: 4,
        phaseTitle: 'Langkah 4: Refleksi & Abstraksi Aturan VSEPR',
        pedagogicalPhase: 'Refleksi & Abstraksi',
        instruction:
          'Berdasarkan pengamatan sudut ikatan H₂O (104,5°) yang menyimpang dari sudut tetrahedral ideal (109,5°), simpulkan urutan kekuatan gaya tolakan antar domain elektron.',
        cognitivePrompt:
          'Mengapa awan Pasangan Elektron Bebas (PEB) memberikan gaya tolakan yang lebih besar dibandingkan Pasangan Elektron Ikatan (PEI)?',
        reflectionQuestion: {
          question: 'Manakah urutan kekuatan gaya tolakan domain elektron yang benar menurut hasil eksperimen Anda?',
          options: [
            'Tolakan PEB–PEB > Tolakan PEB–PEI > Tolakan PEI–PEI',
            'Tolakan PEI–PEI > Tolakan PEB–PEI > Tolakan PEB–PEB',
            'Tolakan PEB–PEI > Tolakan PEB–PEB > Tolakan PEI–PEI',
          ],
          correctIndex: 0,
          explanation:
            'Luar biasa! PEB hanya terikat pada satu inti atom (atom pusat) sehingga awan elektronnya menyebar lebih luas dan gemuk, menghasilkan tolakan PEB–PEB > PEB–PEI > PEI–PEI.',
        },
      },
    ],
  },
  {
    id: 'mission-nh3-ch4',
    title: 'Misi 2: Tantangan Misteri Sudut Amonia (NH₃) vs Metana (CH₄)',
    subtitle: 'Mode Eksperimen Inkuiri · 4 Domain Elektron, Mengapa Sudutnya Berbeda?',
    badgeText: 'Tantangan Misteri',
    phenomenonIntro:
      'Metana (CH₄) dan Amonia (NH₃) sama-sama memiliki total 4 domain elektron di sekeliling atom pusatnya (hibridisasi sp³). Namun pengukuran difraksi menunjukkan sudut ikatan CH₄ adalah 109,5°, sedangkan NH₃ menyusut menjadi 107,0°.',
    researchQuestion:
      'Mengapa sudut ikatan pada amonia (NH₃, 107°) lebih kecil dibandingkan metana (CH₄, 109,5°), meskipun keduanya sama-sama memiliki 4 domain elektron?',
    steps: [
      {
        stepNumber: 1,
        phaseTitle: 'Langkah 1: Bangun Geometri Standar Metana (CH₄)',
        pedagogicalPhase: 'Orientasi & Eksplorasi',
        instruction:
          'Pilih Atom Pusat C (Karbon), lalu atur PEI (X) = 4 dan PEB (E) = 0 untuk membentuk molekul Metana (AX₄).',
        cognitivePrompt:
          'Putar model 3D Metana 360°. Perhatikan bahwa keempat ikatan C–H tersebar simetris sempurna dengan sudut 109,5°.',
        targetCentralAtom: 'C',
        targetX: 4,
        targetE: 0,
      },
      {
        stepNumber: 2,
        phaseTitle: 'Langkah 2: Substitusi 1 Ikatan dengan 1 PEB pada Amonia (NH₃)',
        pedagogicalPhase: 'Investigasi Virtual',
        instruction:
          'Sekarang pilih Atom Pusat N (Nitrogen), atur PEI (X) = 3 dan PEB (E) = 1 (notasi AX₃E), serta aktifkan "Tampilkan Garis Gaya Tolakan".',
        cognitivePrompt:
          'Bandingkan sudut ikatan yang terukur sekarang (107,0°) dengan sudut CH₄ tadi (109,5°). Berapa derajat penyimpangannya?',
        targetCentralAtom: 'N',
        targetX: 3,
        targetE: 1,
        requireRepulsionView: true,
      },
      {
        stepNumber: 3,
        phaseTitle: 'Langkah 3: Analisis Perbandingan CH₄ (109,5°) → NH₃ (107°) → H₂O (104,5°)',
        pedagogicalPhase: 'Refleksi & Abstraksi',
        instruction:
          'Amati pola pada deret isoelektronik 4 domain: AX₄ (0 PEB = 109,5°), AX₃E (1 PEB = 107,0°), dan AX₂E₂ (2 PEB = 104,5°).',
        cognitivePrompt:
          'Setiap penambahan 1 PEB pada sistem 4 domain elektron ternyata menyempitkan sudut ikatan sekitar ~2,5°.',
        reflectionQuestion: {
          question:
            'Apa penyebab utama menyempitnya sudut ikatan H–N–H pada NH₃ menjadi 107° dibandingkan CH₄ (109,5°)?',
          options: [
            'Adanya 1 PEB pada atom N yang mendesak 3 ikatan N–H lebih kuat karena tolakan PEB–PEI > PEI–PEI.',
            'Jumlah atom H pada NH₃ lebih sedikit sehingga ikatan otomatis merapat untuk menghemat ruang.',
            'Atom Nitrogen memiliki jari-jari yang jauh lebih besar daripada Karbon sehingga sudutnya mengecil.',
          ],
          correctIndex: 0,
          explanation:
            'Benar! Pada NH₃ (AX₃E), 1 PEB di puncak memberikan 3 interaksi tolakan PEB–PEI yang lebih besar daripada tolakan antar-ikatan PEI–PEI di bagian bawah, sehingga sudut menyempit sebesar 2,5°.',
        },
      },
    ],
  },
  {
    id: 'mission-octa-trigonal',
    title: 'Misi 3: Misteri Sabuk Ekuatorial & Kutub Aksial (SF₄ vs XeF₄)',
    subtitle: 'Inkuiri Lanjutan · Kemana Perginya PEB pada Domain 5 dan 6?',
    badgeText: 'Tantangan Lanjutan',
    phenomenonIntro:
      'Pada molekul dengan ekspansi oktet (5 dan 6 domain elektron), posisi ruang tidak lagi semuanya identik. Pada Bipiramida Trigonal (5 domain), terdapat posisi Aksial (90°) dan Ekuatorial (120°).',
    researchQuestion:
      'Ketika 1 PEB masuk ke sistem 5 domain (seperti SF₄) atau 2 PEB masuk ke sistem 6 domain (seperti XeF₄), posisi manakah yang dipilih PEB agar energi tolakan minimum?',
    steps: [
      {
        stepNumber: 1,
        phaseTitle: 'Langkah 1: Eksperimen Belerang Tetrafluorida (SF₄ — AX₄E)',
        pedagogicalPhase: 'Investigasi Virtual',
        instruction:
          'Pilih Atom Pusat S (Belerang), atur PEI (X) = 4 dan PEB (E) = 1 untuk membentuk notasi AX₄E.',
        cognitivePrompt:
          'Amati posisi balon PEB berwarna kuning-oranye: PEB menempati posisi Ekuatorial sehingga keempat ikatan S–F membentuk Jungkat-jungkit (Seesaw).',
        targetCentralAtom: 'S',
        targetX: 4,
        targetE: 1,
      },
      {
        stepNumber: 2,
        phaseTitle: 'Langkah 2: Eksperimen Xenon Tetrafluorida (XeF₄ — AX₄E₂)',
        pedagogicalPhase: 'Investigasi Virtual',
        instruction:
          'Pilih Atom Pusat Xe (Xenon), atur PEI (X) = 4 dan PEB (E) = 2 untuk membentuk notasi AX₄E₂.',
        cognitivePrompt:
          'Perhatikan bagaimana kedua PEB mengambil posisi berseberangan 180° (trans), menyisakan 4 ikatan Xe–F pada satu bidang datar (Segi Empat Planar)!',
        targetCentralAtom: 'Xe',
        targetX: 4,
        targetE: 2,
      },
      {
        stepNumber: 3,
        phaseTitle: 'Langkah 3: Simpulkan Aturan Posisi PEB Domain 5 & 6',
        pedagogicalPhase: 'Refleksi & Abstraksi',
        instruction:
          'Evaluasi mengapa molekul XeF₄ (AX₄E₂) bersifat Nonpolar meskipun memiliki 2 PEB, sedangkan SF₄ (AX₄E) bersifat Polar.',
        cognitivePrompt:
          'Hubungkan simetri vektor tolakan PEB dengan kepolaran molekul akhir.',
        reflectionQuestion: {
          question: 'Mengapa pada molekul XeF₄ (AX₄E₂) kedua PEB memilih posisi berseberangan 180° (trans)?',
          options: [
            'Agar tolakan PEB–PEB yang paling kuat berada pada jarak sudut terjauh (180°), bukan berdekatan (90°).',
            'Karena atom Fluor menolak PEB hanya pada arah horizontal.',
            'Karena ikatan Xe–F merupakan ikatan ionik yang hanya stabil pada bidang datar.',
          ],
          correctIndex: 0,
          explanation:
            'Tepat sekali! Jika kedua PEB berdekatan (cis, 90°), tolakan PEB–PEB akan sangat besar dan tidak stabil. Dengan posisi trans (180°), tolakan PEB–PEB diminimalkan dan molekul menjadi Segi Empat Planar yang Nonpolar.',
        },
      },
    ],
  },
];
