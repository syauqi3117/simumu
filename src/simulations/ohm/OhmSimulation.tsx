/**
 * Simulasi Interaktif Hukum Ohm
 * Menyajikan visualisasi skematik rangkaian real-time, animasi aliran elektron/arus konvensional,
 * pembacaan multimeter LCD, indikator proteksi disipasi daya panas, dan grafik V-I dinamis (Recharts).
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import {
  DCSourceSymbol,
  ResistorSymbol,
  SwitchSymbol,
  AmmeterSymbol,
  VoltmeterSymbol,
  GroundSymbol,
} from '../../components/schematics/CircuitSymbols';
import { ResistorColorCode } from './ResistorColorCode';
import {
  FlameIcon,
  RotateCcwIcon,
  SlidersIcon,
  ActivityIcon,
} from '../../components/common/Icons';

export const OhmSimulation: React.FC = () => {
  const { schematicStandard, setSchematicStandard } = useAppStore();

  // State Parameter Rangkaian
  const [voltage, setVoltage] = useState<number>(12); // Volt
  const [resistance, setResistance] = useState<number>(100); // Ohm
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);
  const [powerRating, setPowerRating] = useState<number>(0.5); // Watt (Rating daya resistor: 0.25W, 0.5W, 1W, 2W, 5W)
  const [currentFlowType, setCurrentFlowType] = useState<'conventional' | 'electron'>('conventional');
  const [showColorCalculator, setShowColorCalculator] = useState<boolean>(false);

  // Kalkulasi Fisika Real-Time
  const calculations = useMemo(() => {
    if (!isSwitchClosed) {
      return {
        vResistor: 0,
        current: 0,
        power: 0,
        heatRatio: 0,
        isOverheated: false,
      };
    }

    const vRes = voltage;
    const i = vRes / Math.max(0.1, resistance); // Ampere
    const p = vRes * i; // Watt (P = V * I = V^2 / R)
    const ratio = p / powerRating;
    const isOver = ratio >= 1.0;

    return {
      vResistor: vRes,
      current: i,
      power: p,
      heatRatio: ratio,
      isOverheated: isOver,
    };
  }, [voltage, resistance, isSwitchClosed, powerRating]);

  // Data Titik Grafik Karakteristik V-I (Hukum Ohm: V = I * R)
  const chartData = useMemo(() => {
    const points = [];
    const maxV = 30;
    const step = 2;
    for (let v = 0; v <= maxV; v += step) {
      const i = v / Math.max(0.1, resistance);
      points.push({
        voltage: v,
        current: Number((i * 1000).toFixed(1)), // mA
        currentAmps: Number(i.toFixed(4)),
      });
    }
    return points;
  }, [resistance]);

  // Presets Rangkaian Populer
  const handleApplyPreset = (v: number, r: number, pr: number) => {
    setVoltage(v);
    setResistance(r);
    setPowerRating(pr);
    setIsSwitchClosed(true);
  };

  const handleReset = () => {
    setVoltage(12);
    setResistance(100);
    setPowerRating(0.5);
    setIsSwitchClosed(true);
  };

  // Kecepatan animasi kawat sebanding arus (durasi 0.3s s.d. 3s)
  const flowDuration = useMemo(() => {
    if (!isSwitchClosed || calculations.current <= 0) return 0;
    // Semakin besar arus, durasi putaran semakin kecil (semakin cepat mengalir)
    const dur = Math.max(0.3, Math.min(3.0, 1.5 / Math.sqrt(calculations.current * 10)));
    return Number(dur.toFixed(2));
  }, [isSwitchClosed, calculations.current]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Peringatan Bahaya Panas Lebih (Overheating Alert) */}
      {calculations.isOverheated && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500 text-rose-700 dark:text-rose-300 flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-500 text-white shadow-lg">
              <FlameIcon size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide">
                PERINGATAN: RESISTOR MENGALAMI OVERHEATING!
              </h4>
              <p className="text-xs text-rose-600 dark:text-rose-300/90 mt-0.5">
                Daya disipasi aktual (<strong className="font-mono">{calculations.power.toFixed(2)} W</strong>) telah
                melampaui rating komponen (<strong className="font-mono">{powerRating} W</strong>). Pada kondisi riil di
                laboratorium, resistor akan memanas membara, berbau hangus, dan putus terbakar!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPowerRating(5)}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs whitespace-nowrap shadow transition"
          >
            Tingkatkan ke 5W
          </button>
        </div>
      )}

      {/* Grid Utama: Skematik Interaktif (Kiri) & Panel Kontrol / Meter (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri (Skematik & Kanvas Rangkaian) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Skematik Rangkaian Tertutup Hukum Ohm
              </h3>
            </div>

            {/* Opsi Tampilan Skematik */}
            <div className="flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  setCurrentFlowType(currentFlowType === 'conventional' ? 'electron' : 'conventional')
                }
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Ganti arah panah: Konvensional (+ ke -) atau Aliran Elektron (- ke +)"
              >
                Aliran: <strong className="text-cyan-500">{currentFlowType === 'conventional' ? 'Konvensional (+ → -)' : 'Elektron (- → +)'}</strong>
              </button>
              <button
                type="button"
                onClick={() => setSchematicStandard(schematicStandard === 'IEC' ? 'IEEE' : 'IEC')}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Standar: <strong className="text-indigo-500">{schematicStandard}</strong>
              </button>
            </div>
          </div>

          {/* Kanvas SVG Skematik Rangkaian */}
          <div className="relative w-full h-80 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
            <svg
              viewBox="0 0 540 320"
              className="w-full h-full text-slate-100 select-none"
              style={{
                stroke: '#94a3b8',
              }}
            >
              <defs>
                {/* Pola grid latar belakang laboratorium */}
                <pattern id="labGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>

                {/* Marker Panah Aliran Arus Konvensional */}
                <marker
                  id="arrowConventional"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
                </marker>

                <marker
                  id="arrowElectron"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 9 1 L 0 5 L 9 9 z" fill="#eab308" />
                </marker>
              </defs>

              {/* Latar Belakang Kotak Laboratorium */}
              <rect width="100%" height="100%" fill="url(#labGrid)" />

              {/* JALUR KAWAT UTAMA SIRKUIT (Loop Persegi 4 Titik: (70,60) -> (470,60) -> (470,250) -> (70,250) -> loop) */}
              
              {/* Kawat Statis Dasar */}
              <path
                d="M 70 120 L 70 60 L 220 60 M 320 60 L 470 60 L 470 120 M 470 200 L 470 250 L 70 250 L 70 200"
                fill="none"
                stroke="#475569"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Kawat Animasi Aliran Muatan (Hanya aktif jika saklar tertutup dan arus > 0) */}
              {isSwitchClosed && calculations.current > 0 && (
                <path
                  d="M 70 160 L 70 60 L 270 60 L 470 60 L 470 160 L 470 250 L 70 250 Z"
                  fill="none"
                  stroke={currentFlowType === 'conventional' ? '#38bdf8' : '#eab308'}
                  strokeWidth="3.5"
                  strokeDasharray="6 8"
                  style={{
                    animation: `dash-flow ${flowDuration}s linear infinite`,
                    animationDirection: currentFlowType === 'conventional' ? 'normal' : 'reverse',
                  }}
                />
              )}

              {/* KOMPONEN SIRKUIT PADA KANVAS */}

              {/* 1. Sumber Tegangan DC / Baterai di Sisi Kiri (x=70, y=160) */}
              <g transform="rotate(90, 70, 160)">
                <DCSourceSymbol x={70} y={160} voltage={voltage} isActive={isSwitchClosed} />
              </g>

              {/* 2. Saklar Mekanik di Sisi Atas Kiri (x=270, y=60) */}
              <SwitchSymbol
                x={270}
                y={60}
                isOpen={!isSwitchClosed}
                onToggle={() => setIsSwitchClosed(!isSwitchClosed)}
              />

              {/* 3. Amperemeter Terpasang Seri di Sisi Atas Kanan (x=390, y=60) */}
              <AmmeterSymbol x={390} y={60} currentAmps={calculations.current} />

              {/* 4. Resistor Beban di Sisi Kanan (x=470, y=160) */}
              <g transform="rotate(90, 470, 160)">
                <ResistorSymbol
                  x={470}
                  y={160}
                  resistance={resistance}
                  standard={schematicStandard}
                  heatRatio={calculations.heatRatio}
                  width={75}
                />
              </g>

              {/* 5. Voltmeter Terpasang Paralel Melintasi Resistor Beban */}
              <g>
                {/* Kawat Cabang Pengukuran Paralel */}
                <line x1="470" y1="90" x2="520" y2="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="520" y1="90" x2="520" y2="230" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="520" y1="230" x2="470" y2="230" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

                {/* Probe Probe Pengukuran */}
                <circle cx="470" cy="90" r="3.5" fill="#ef4444" />
                <circle cx="470" cy="230" r="3.5" fill="#3b82f6" />

                <VoltmeterSymbol x={520} y={160} voltage={calculations.vResistor} />
              </g>

              {/* 6. Simbol Referensi Ground di Kawat Bawah (x=270, y=250) */}
              <GroundSymbol x={270} y={260} />
            </svg>
          </div>

          {/* Quick Presets & Switch Action Bar */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-500">Preset Praktikum:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset(5, 220, 0.25)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
              >
                5V / 220Ω (TTL)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(12, 10, 5)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
              >
                12V / 10Ω (Mobil)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(24, 100, 2)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
              >
                24V / 100Ω (PLC)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(20, 10, 0.25)}
                className="px-2.5 py-1 rounded-md bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-medium transition"
                title="Simulasi kelebihan daya (overpower)"
              >
                Overpower Uji Bahaya
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center space-x-1"
            >
              <RotateCcwIcon size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Kolom Kanan (Multimeter Digital Display & Slider Kontrol) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Panel Instrumen LCD Digital (Volt, Arus, Ohm, Daya) */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Panel Multimeter Digital Lab
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                AUTO-RANGING
              </span>
            </div>

            {/* Grid 4 Display Meter */}
            <div className="grid grid-cols-2 gap-3">
              {/* Tegangan V */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>Tegangan (V)</span>
                  <span className="text-cyan-400 font-bold">V_drop</span>
                </div>
                <div className="text-2xl font-mono font-black text-cyan-400 mt-1">
                  {calculations.vResistor.toFixed(2)}
                  <span className="text-xs text-slate-500 font-normal ml-1">V</span>
                </div>
              </div>

              {/* Kuat Arus I */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>Kuat Arus (I)</span>
                  <span className="text-emerald-400 font-bold">I_loop</span>
                </div>
                <div className="text-2xl font-mono font-black text-emerald-400 mt-1">
                  {calculations.current >= 1
                    ? calculations.current.toFixed(3)
                    : (calculations.current * 1000).toFixed(1)}
                  <span className="text-xs text-slate-500 font-normal ml-1">
                    {calculations.current >= 1 ? 'A' : 'mA'}
                  </span>
                </div>
              </div>

              {/* Resistansi R */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>Hambatan (R)</span>
                  <span className="text-indigo-400 font-bold">R_load</span>
                </div>
                <div className="text-2xl font-mono font-black text-indigo-400 mt-1">
                  {resistance >= 1000 ? (resistance / 1000).toFixed(2) : resistance.toFixed(0)}
                  <span className="text-xs text-slate-500 font-normal ml-1">
                    {resistance >= 1000 ? 'kΩ' : 'Ω'}
                  </span>
                </div>
              </div>

              {/* Daya Disipasi Joule P */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>Daya Panas (P)</span>
                  <span className="text-amber-400 font-bold">P_Joule</span>
                </div>
                <div
                  className={`text-2xl font-mono font-black mt-1 ${
                    calculations.isOverheated ? 'text-rose-500 animate-pulse' : 'text-amber-400'
                  }`}
                >
                  {calculations.power >= 1
                    ? calculations.power.toFixed(2)
                    : (calculations.power * 1000).toFixed(1)}
                  <span className="text-xs text-slate-500 font-normal ml-1">
                    {calculations.power >= 1 ? 'W' : 'mW'}
                  </span>
                </div>
              </div>
            </div>

            {/* Batang Termal Disipasi Resistor */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Beban Termal Resistor:</span>
                <span
                  className={`font-mono font-bold ${
                    calculations.isOverheated
                      ? 'text-rose-400'
                      : calculations.heatRatio > 0.7
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {(calculations.heatRatio * 100).toFixed(0)}% dari batas rating {powerRating}W
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    calculations.isOverheated
                      ? 'bg-rose-500'
                      : calculations.heatRatio > 0.7
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, calculations.heatRatio * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Slider Kontrol Tegangan & Hambatan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
              <SlidersIcon size={16} className="text-cyan-500" />
              <span>Pengaturan Variabel Eksperimen</span>
            </h4>

            {/* 1. Slider Tegangan Sumber DC (V) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Tegangan Baterai / Catu Daya (V):
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={voltage}
                    onChange={(e) => setVoltage(Math.max(0, Math.min(30, Number(e.target.value))))}
                    className="w-16 px-2 py-0.5 text-right font-mono text-xs font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-slate-400">V</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="0.1"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 V</span>
                <span>15 V</span>
                <span>30 V</span>
              </div>
            </div>

            {/* 2. Slider Hambatan Resistor (R) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Resistansi Komponen (R):
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    value={resistance}
                    onChange={(e) => setResistance(Math.max(1, Math.min(1000, Number(e.target.value))))}
                    className="w-16 px-2 py-0.5 text-right font-mono text-xs font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-slate-400">Ω</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 Ω</span>
                <span>500 Ω</span>
                <span>1000 Ω (1 kΩ)</span>
              </div>
            </div>

            {/* 3. Pemilih Rating Daya Maksimum Resistor */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Rating Daya Fisik Resistor (P_rating):
              </label>
              <div className="grid grid-cols-5 gap-1.5 text-xs">
                {[0.25, 0.5, 1, 2, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setPowerRating(rating)}
                    className={`py-1.5 rounded-lg font-mono text-xs font-bold border transition ${
                      powerRating === rating
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {rating < 1 ? `1/${1 / rating}W` : `${rating}W`}
                  </button>
                ))}
              </div>
            </div>

            {/* Saklar & Toggle Alat Kode Warna */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center space-x-2 transition shadow-sm ${
                  isSwitchClosed
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <span>Saklar Sirkuit:</span>
                <span className="uppercase">{isSwitchClosed ? 'Tertutup (ON)' : 'Terbuka (OFF)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowColorCalculator(!showColorCalculator)}
                className="py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {showColorCalculator ? 'Tutup Kode Warna' : 'Buka Kode Warna'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kalkulator Kode Warna Resistor (Dapat dibuka / ditutup) */}
      {showColorCalculator && (
        <ResistorColorCode
          currentResistance={resistance}
          onSelectResistance={(r) => setResistance(r)}
        />
      )}

      {/* Grafik Karakteristik V-I Dinamis (Recharts) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <ActivityIcon size={18} className="text-cyan-500" />
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Kurva Karakteristik Linear V - I (Hukum Ohm)
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Menunjukkan kemiringan garis (slope) = 1/R. Titik oranye adalah titik operasi kerja aktif saat ini.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              R = {resistance} Ω
            </span>
            <span className="px-2.5 py-1 rounded bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              Titik: ({calculations.vResistor.toFixed(1)}V, {(calculations.current * 1000).toFixed(1)}mA)
            </span>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 30, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="voltage"
                unit=" V"
                stroke="#64748b"
                fontSize={11}
                label={{ value: 'Tegangan V (Volt)', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11 }}
              />
              <YAxis
                unit=" mA"
                stroke="#64748b"
                fontSize={11}
                label={{ value: 'Arus I (mA)', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-lg bg-slate-900 text-white text-xs border border-slate-700 shadow-xl space-y-1">
                        <div className="font-bold text-cyan-400">Tegangan: {data.voltage} V</div>
                        <div>Arus: {data.current} mA ({data.currentAmps} A)</div>
                        <div className="text-[10px] text-slate-400">
                          Daya: {(data.voltage * data.currentAmps).toFixed(3)} W
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={false}
                name="Kurva V-I"
              />
              {/* Titik Kerja Saat Ini */}
              {isSwitchClosed && (
                <ReferenceDot
                  x={calculations.vResistor}
                  y={Number((calculations.current * 1000).toFixed(1))}
                  r={7}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
