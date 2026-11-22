/**
 * Komponen Simbol Skematik Standar IEC 60617 dan IEEE Std 315
 * Dilengkapi animasi aliran elektron/arus konvensional dan visualisasi gelang kode warna resistor.
 */

import React from 'react';
import type { SchematicStandard } from '../../types';

// Tabel warna resistor 4 gelang
export const RESISTOR_COLOR_PALETTE: Record<number, { name: string; hex: string; textDark?: boolean }> = {
  0: { name: 'Hitam', hex: '#1e293b', textDark: false },
  1: { name: 'Cokelat', hex: '#78350f', textDark: false },
  2: { name: 'Merah', hex: '#dc2626', textDark: false },
  3: { name: 'Oranye', hex: '#ea580c', textDark: false },
  4: { name: 'Kuning', hex: '#facc15', textDark: true },
  5: { name: 'Hijau', hex: '#16a34a', textDark: false },
  6: { name: 'Biru', hex: '#2563eb', textDark: false },
  7: { name: 'Ungu', hex: '#9333ea', textDark: false },
  8: { name: 'Abu-abu', hex: '#64748b', textDark: false },
  9: { name: 'Putih', hex: '#f8fafc', textDark: true },
};

export const TOLERANCE_PALETTE: Record<string, { name: string; hex: string; percent: string }> = {
  gold: { name: 'Emas', hex: '#d97706', percent: '±5%' },
  silver: { name: 'Perak', hex: '#94a3b8', percent: '±10%' },
  brown: { name: 'Cokelat', hex: '#78350f', percent: '±1%' },
  red: { name: 'Merah', hex: '#dc2626', percent: '±2%' },
};

/**
 * Mengonversi nilai resistansi (Ohm) ke 4 kode warna resistor
 */
export function getResistorColorBands(resistance: number): {
  band1: number;
  band2: number;
  multiplier: number;
  band1Color: string;
  band2Color: string;
  multiplierColor: string;
  toleranceColor: string;
} {
  const r = Math.max(1, Math.round(resistance));
  const digits = r.toString();

  let b1 = 1;
  let b2 = 0;
  let mult = 0;

  if (digits.length === 1) {
    b1 = parseInt(digits[0], 10);
    b2 = 0;
    mult = 0;
  } else {
    b1 = parseInt(digits[0], 10);
    b2 = parseInt(digits[1], 10);
    mult = digits.length - 2;
  }

  // Batasi multiplier maksimal 9
  mult = Math.min(Math.max(0, mult), 9);

  return {
    band1: b1,
    band2: b2,
    multiplier: mult,
    band1Color: RESISTOR_COLOR_PALETTE[b1]?.hex || '#78350f',
    band2Color: RESISTOR_COLOR_PALETTE[b2]?.hex || '#1e293b',
    multiplierColor: RESISTOR_COLOR_PALETTE[mult]?.hex || '#78350f',
    toleranceColor: TOLERANCE_PALETTE.gold.hex, // Standar laboratorium 5% (Emas)
  };
}

/**
 * Simbol Baterai / Sumber Tegangan DC
 */
export const DCSourceSymbol: React.FC<{
  x: number;
  y: number;
  voltage: number;
  isActive?: boolean;
}> = ({ x, y, voltage, isActive = true }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className="select-none">
      {/* Garis koneksi kiri & kanan */}
      <line x1="-30" y1="0" x2="-14" y2="0" stroke="currentColor" strokeWidth="2.5" />
      <line x1="14" y1="0" x2="30" y2="0" stroke="currentColor" strokeWidth="2.5" />

      {/* Terminal Negatif (-) Pendek & Tebal */}
      <line x1="-6" y1="-12" x2="-6" y2="12" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      {/* Terminal Positif (+) Panjang & Tipis */}
      <line x1="6" y1="-20" x2="6" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

      {/* Tanda Positif (+) dan Negatif (-) */}
      <text x="14" y="-12" fill="#ef4444" fontSize="12" fontWeight="bold">
        +
      </text>
      <text x="-18" y="-12" fill="#3b82f6" fontSize="14" fontWeight="bold">
        -
      </text>

      {/* Label Tegangan */}
      <text
        x="0"
        y="32"
        textAnchor="middle"
        fill={isActive ? '#38bdf8' : '#94a3b8'}
        fontSize="12"
        fontWeight="600"
      >
        {voltage.toFixed(1)} V
      </text>
    </g>
  );
};

/**
 * Simbol Resistor: Mendukung IEC 60617 (Kotak) & IEEE Std 315 (Zigzag)
 * Dilengkapi gelang warna riil
 */
export const ResistorSymbol: React.FC<{
  x: number;
  y: number;
  resistance: number;
  standard: SchematicStandard;
  heatRatio?: number; // 0 (normal) sampai 1 (maksimum) atau > 1 (overheat)
  width?: number;
}> = ({ x, y, resistance, standard, heatRatio = 0, width = 70 }) => {
  const bands = getResistorColorBands(resistance);
  const isOverheated = heatRatio >= 1.0;

  // Warna bodi resistor jika panas
  const bodyFill = isOverheated
    ? '#ef4444'
    : heatRatio > 0.6
    ? '#f97316'
    : heatRatio > 0.3
    ? '#eab308'
    : '#e2e8f0';

  return (
    <g transform={`translate(${x}, ${y})`} className="select-none">
      {/* Garis koneksi kawat */}
      <line x1={-width / 2 - 20} y1="0" x2={-width / 2} y2="0" stroke="currentColor" strokeWidth="2.5" />
      <line x1={width / 2} y1="0" x2={width / 2 + 20} y2="0" stroke="currentColor" strokeWidth="2.5" />

      {standard === 'IEC' ? (
        // Simbol IEC 60617: Persegi panjang dengan gelang kode warna di dalamnya
        <g>
          {/* Badan resistor */}
          <rect
            x={-width / 2}
            y="-14"
            width={width}
            height="28"
            rx="4"
            fill={bodyFill}
            stroke="currentColor"
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />

          {/* Gelang Warna 1 */}
          <rect x={-width / 2 + 12} y="-13" width="5" height="26" fill={bands.band1Color} rx="1" />
          {/* Gelang Warna 2 */}
          <rect x={-width / 2 + 23} y="-13" width="5" height="26" fill={bands.band2Color} rx="1" />
          {/* Gelang Multiplier */}
          <rect x={-width / 2 + 34} y="-13" width="5" height="26" fill={bands.multiplierColor} rx="1" />
          {/* Gelang Toleransi */}
          <rect x={-width / 2 + 50} y="-13" width="5" height="26" fill={bands.toleranceColor} rx="1" />
        </g>
      ) : (
        // Simbol IEEE Std 315 / ANSI: Garis Zigzag
        <path
          d={`M ${-width / 2} 0 
             L ${-width / 2 + 10} -14 
             L ${-width / 2 + 24} 14 
             L ${-width / 2 + 38} -14 
             L ${-width / 2 + 52} 14 
             L ${-width / 2 + 62} -14 
             L ${width / 2} 0`}
          fill="none"
          stroke={isOverheated ? '#ef4444' : heatRatio > 0.5 ? '#f97316' : 'currentColor'}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="transition-colors duration-300"
        />
      )}

      {/* Efek asap merah / bara api jika overheat */}
      {isOverheated && (
        <circle
          cx="0"
          cy="0"
          r={width / 2 + 4}
          fill="#ef4444"
          opacity="0.25"
          className="animate-ping"
        />
      )}

      {/* Label Nilai Resistansi */}
      <text
        x="0"
        y="30"
        textAnchor="middle"
        fill={isOverheated ? '#ef4444' : '#10b981'}
        fontSize="12"
        fontWeight="600"
      >
        {resistance >= 1000 ? `${(resistance / 1000).toFixed(2)} kΩ` : `${resistance.toFixed(0)} Ω`}
      </text>
    </g>
  );
};

/**
 * Simbol Saklar Mekanik (Single Pole Single Throw - SPST)
 */
export const SwitchSymbol: React.FC<{
  x: number;
  y: number;
  isOpen: boolean;
  onToggle?: () => void;
}> = ({ x, y, isOpen, onToggle }) => {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onToggle}
      className="cursor-pointer select-none group"
    >
      <title>{isOpen ? 'Saklar Terbuka (Klik untuk Menutup)' : 'Saklar Tertutup (Klik untuk Membuka)'}</title>
      {/* Titik kontak terminal kiri & kanan */}
      <line x1="-30" y1="0" x2="-12" y2="0" stroke="currentColor" strokeWidth="2.5" />
      <line x1="12" y1="0" x2="30" y2="0" stroke="currentColor" strokeWidth="2.5" />

      {/* Terminal Node Bulat */}
      <circle cx="-12" cy="0" r="4" fill="currentColor" />
      <circle cx="12" cy="0" r="4" fill="currentColor" />

      {/* Bilah Tuas Saklar */}
      <line
        x1="-12"
        y1="0"
        x2={isOpen ? '8' : '12'}
        y2={isOpen ? '-18' : '0'}
        stroke={isOpen ? '#f59e0b' : '#10b981'}
        strokeWidth="3.5"
        strokeLinecap="round"
        className="transition-all duration-200"
      />

      <text
        x="0"
        y="24"
        textAnchor="middle"
        fill={isOpen ? '#f59e0b' : '#10b981'}
        fontSize="10"
        fontWeight="bold"
      >
        {isOpen ? 'TERBUKA' : 'TERHUBUNG'}
      </text>
    </g>
  );
};

/**
 * Simbol Amperemeter (Dipasang SERI)
 */
export const AmmeterSymbol: React.FC<{
  x: number;
  y: number;
  currentAmps: number;
}> = ({ x, y, currentAmps }) => {
  const currentFormatted =
    Math.abs(currentAmps) < 1
      ? `${(currentAmps * 1000).toFixed(1)} mA`
      : `${currentAmps.toFixed(3)} A`;

  return (
    <g transform={`translate(${x}, ${y})`} className="select-none">
      <line x1="-30" y1="0" x2="-18" y2="0" stroke="currentColor" strokeWidth="2.5" />
      <line x1="18" y1="0" x2="30" y2="0" stroke="currentColor" strokeWidth="2.5" />

      <circle
        cx="0"
        cy="0"
        r="18"
        fill="rgba(16, 185, 129, 0.15)"
        stroke="#10b981"
        strokeWidth="2.5"
      />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fill="#10b981"
        fontSize="14"
        fontWeight="bold"
      >
        A
      </text>

      <text
        x="0"
        y="-24"
        textAnchor="middle"
        fill="#10b981"
        fontSize="11"
        fontWeight="600"
      >
        {currentFormatted}
      </text>
    </g>
  );
};

/**
 * Simbol Voltmeter (Dipasang PARALEL)
 */
export const VoltmeterSymbol: React.FC<{
  x: number;
  y: number;
  voltage: number;
}> = ({ x, y, voltage }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className="select-none">
      <line x1="0" y1="-30" x2="0" y2="-18" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
      <line x1="0" y1="18" x2="0" y2="30" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

      <circle
        cx="0"
        cy="0"
        r="18"
        fill="rgba(56, 189, 248, 0.15)"
        stroke="#38bdf8"
        strokeWidth="2.5"
      />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="14"
        fontWeight="bold"
      >
        V
      </text>

      <text
        x="28"
        y="4"
        fill="#38bdf8"
        fontSize="11"
        fontWeight="600"
      >
        {voltage.toFixed(2)} V
      </text>
    </g>
  );
};

/**
 * Simbol Ground (IEC 60617)
 */
export const GroundSymbol: React.FC<{
  x: number;
  y: number;
}> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`} className="select-none">
    <line x1="0" y1="-10" x2="0" y2="0" stroke="currentColor" strokeWidth="2.5" />
    <line x1="-14" y1="0" x2="14" y2="0" stroke="currentColor" strokeWidth="2.5" />
    <line x1="-9" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="2" />
    <line x1="-4" y1="10" x2="4" y2="10" stroke="currentColor" strokeWidth="1.5" />
    <text x="18" y="6" fill="#94a3b8" fontSize="10">
      0V (GND)
    </text>
  </g>
);
