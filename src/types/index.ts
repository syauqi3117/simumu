// Tipe data utama untuk aplikasi web Simulasi Dasar Teknik Elektro

export type UserRole = 'mahasiswa' | 'dosen';
export type ThemeMode = 'light' | 'dark';
export type SchematicStandard = 'IEC' | 'IEEE';

export type ModuleDifficulty = 'Pemula' | 'Menengah' | 'Mahir' | 'Praktikum';
export type ModuleCategory = 'Dasar' | 'Rangkaian' | 'Instrumen' | 'Sinyal';

export interface ModuleMeta {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: ModuleDifficulty;
  category: ModuleCategory;
  estimatedMinutes: number;
  icon: string;
  isAvailable: boolean;
  tags: string[];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  hint?: string;
  formula?: string;
  // Parameter khusus yang dapat diedit oleh Guru/Dosen
  teacherParamKey?: string;
  customizable?: boolean;
}

export interface ModuleContent {
  id: string;
  title: string;
  subtitle: string;
  standardInfo: string;
  learningObjectives: string[];
  theorySections: {
    id: string;
    title: string;
    content: string;
    formula?: string;
    bulletPoints?: string[];
  }[];
  quizQuestions: QuizQuestion[];
  summaryPoints: string[];
  siUnits: {
    quantity: string;
    symbol: string;
    unit: string;
    unitSymbol: string;
    description: string;
  }[];
}

// Tipe data untuk MNA (Modified Nodal Analysis) Solver
export type ComponentType = 'RESISTOR' | 'VOLTAGE_SOURCE' | 'CURRENT_SOURCE' | 'CAPACITOR';

export interface CircuitElement {
  id: string;
  type: ComponentType;
  nodePositive: number; // Simpul positif (atau simpul 1)
  nodeNegative: number; // Simpul negatif (atau simpul 2)
  value: number;        // Nilai: R (Ohm), V (Volt), I (Ampere), C (Farad)
  name: string;
}

export interface MNAResult {
  nodeVoltages: Record<number, number>; // Tegangan di setiap simpul terhadap ground (Node 0)
  sourceCurrents: Record<string, number>; // Arus yang mengalir melalui sumber tegangan
  elementCurrents: Record<string, number>; // Arus pada setiap elemen
  elementPowers: Record<string, number>;   // Daya pada setiap elemen
  success: boolean;
  errorMessage?: string;
}

// Hasil integrasi numerik RC
export interface RCDataPoint {
  time: number;       // Waktu (detik atau milidetik)
  vCapacitor: number; // Tegangan kapasitor (Volt)
  vResistor: number;  // Tegangan resistor (Volt)
  iCircuit: number;   // Arus rangkaian (Ampere / mA)
}

