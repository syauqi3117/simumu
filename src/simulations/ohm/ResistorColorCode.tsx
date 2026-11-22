/**
 * Kalkulator & Visualisasi Interaktif Kode Warna Resistor 4 Gelang
 */

import React, { useState } from 'react';
import {
  RESISTOR_COLOR_PALETTE,
  TOLERANCE_PALETTE,
  getResistorColorBands,
} from '../../components/schematics/CircuitSymbols';

interface ResistorColorCodeProps {
  currentResistance: number;
  onSelectResistance: (r: number) => void;
}

export const ResistorColorCode: React.FC<ResistorColorCodeProps> = ({
  currentResistance,
  onSelectResistance,
}) => {
  const bands = getResistorColorBands(currentResistance);
  const [selectedB1, setSelectedB1] = useState(bands.band1);
  const [selectedB2, setSelectedB2] = useState(bands.band2);
  const [selectedMult, setSelectedMult] = useState(bands.multiplier);
  const [selectedTol, setSelectedTol] = useState('gold');

  // Hitung resistansi dari pilihan gelang
  const calculateResistanceFromBands = (b1: number, b2: number, mult: number) => {
    const val = (b1 * 10 + b2) * Math.pow(10, mult);
    return Math.min(Math.max(1, val), 1000); // Batasi 1 - 1000 Ohm untuk modul ini
  };

  const handleBand1Change = (val: number) => {
    setSelectedB1(val);
    const r = calculateResistanceFromBands(val, selectedB2, selectedMult);
    onSelectResistance(r);
  };

  const handleBand2Change = (val: number) => {
    setSelectedB2(val);
    const r = calculateResistanceFromBands(selectedB1, val, selectedMult);
    onSelectResistance(r);
  };

  const handleMultChange = (val: number) => {
    setSelectedMult(val);
    const r = calculateResistanceFromBands(selectedB1, selectedB2, val);
    onSelectResistance(r);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            Kalkulator Kode Warna Resistor (Standar 4 Gelang)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pilih warna gelang untuk membaca nilai resistansi atau gunakan nilai simulasi saat ini.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Nilai Terbaca:</div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            {currentResistance.toFixed(0)} Ω {TOLERANCE_PALETTE[selectedTol]?.percent}
          </div>
        </div>
      </div>

      {/* Visualisasi Badan Resistor Nyata */}
      <div className="flex justify-center items-center py-4 px-6 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
        <div className="relative flex items-center">
          {/* Kawat Kiri */}
          <div className="w-12 h-1.5 bg-slate-400 rounded-l" />

          {/* Badan Keramik Resistor */}
          <div className="w-48 h-14 bg-amber-100 dark:bg-amber-200/90 rounded-2xl border-2 border-amber-300 dark:border-amber-400 relative flex items-center justify-between px-6 shadow-inner">
            {/* Gelang 1 */}
            <div
              className="w-3.5 h-full transition-all shadow"
              style={{ backgroundColor: bands.band1Color }}
              title={`Gelang 1: ${RESISTOR_COLOR_PALETTE[bands.band1]?.name}`}
            />
            {/* Gelang 2 */}
            <div
              className="w-3.5 h-full transition-all shadow"
              style={{ backgroundColor: bands.band2Color }}
              title={`Gelang 2: ${RESISTOR_COLOR_PALETTE[bands.band2]?.name}`}
            />
            {/* Gelang Multiplier */}
            <div
              className="w-3.5 h-full transition-all shadow"
              style={{ backgroundColor: bands.multiplierColor }}
              title={`Pengali: 10^${bands.multiplier}`}
            />
            {/* Spacer */}
            <div className="w-4" />
            {/* Gelang Toleransi */}
            <div
              className="w-3.5 h-full transition-all shadow"
              style={{ backgroundColor: bands.toleranceColor }}
              title={`Toleransi: ${TOLERANCE_PALETTE[selectedTol]?.name}`}
            />
          </div>

          {/* Kawat Kanan */}
          <div className="w-12 h-1.5 bg-slate-400 rounded-r" />
        </div>
      </div>

      {/* Selector Gelang 1, 2, Multiplier, Toleransi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Gelang 1 */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Gelang 1 (Digit Pertama):
          </label>
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleBand1Change(val)}
                style={{ backgroundColor: RESISTOR_COLOR_PALETTE[val].hex }}
                className={`h-7 rounded flex items-center justify-center font-bold text-[11px] shadow-sm transition-transform ${
                  bands.band1 === val ? 'ring-2 ring-blue-500 scale-105' : 'opacity-85 hover:opacity-100'
                } ${RESISTOR_COLOR_PALETTE[val].textDark ? 'text-slate-900' : 'text-white'}`}
                title={`${val}: ${RESISTOR_COLOR_PALETTE[val].name}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Gelang 2 */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Gelang 2 (Digit Kedua):
          </label>
          <div className="grid grid-cols-5 gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleBand2Change(val)}
                style={{ backgroundColor: RESISTOR_COLOR_PALETTE[val].hex }}
                className={`h-7 rounded flex items-center justify-center font-bold text-[11px] shadow-sm transition-transform ${
                  bands.band2 === val ? 'ring-2 ring-blue-500 scale-105' : 'opacity-85 hover:opacity-100'
                } ${RESISTOR_COLOR_PALETTE[val].textDark ? 'text-slate-900' : 'text-white'}`}
                title={`${val}: ${RESISTOR_COLOR_PALETTE[val].name}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Multiplier */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Gelang 3 (Pengali 10ⁿ):
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleMultChange(val)}
                style={{ backgroundColor: RESISTOR_COLOR_PALETTE[val].hex }}
                className={`h-7 rounded flex items-center justify-center font-bold text-[10px] shadow-sm transition-transform ${
                  bands.multiplier === val ? 'ring-2 ring-blue-500 scale-105' : 'opacity-85 hover:opacity-100'
                } ${RESISTOR_COLOR_PALETTE[val].textDark ? 'text-slate-900' : 'text-white'}`}
                title={`10^${val} (${Math.pow(10, val)}): ${RESISTOR_COLOR_PALETTE[val].name}`}
              >
                10^{val}
              </button>
            ))}
          </div>
        </div>

        {/* Toleransi */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Gelang 4 (Toleransi):
          </label>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(TOLERANCE_PALETTE).map(([key, tol]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedTol(key)}
                style={{ backgroundColor: tol.hex }}
                className={`h-7 rounded flex items-center justify-center font-bold text-[10px] text-white shadow-sm transition-transform ${
                  selectedTol === key ? 'ring-2 ring-blue-500 scale-105' : 'opacity-85 hover:opacity-100'
                }`}
                title={`${tol.name}: ${tol.percent}`}
              >
                {tol.percent}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
