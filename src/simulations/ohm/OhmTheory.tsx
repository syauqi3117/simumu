/**
 * Halaman Teori & Tujuan Pembelajaran Modul 1: Hukum Ohm
 */

import React, { useState } from 'react';
import type { ModuleContent } from '../../types';
import { BookOpenIcon, SparklesIcon } from '../../components/common/Icons';

interface OhmTheoryProps {
  content: ModuleContent;
}

export const OhmTheory: React.FC<OhmTheoryProps> = ({ content }) => {
  // Interaktif Segitiga Rumus Hukum Ohm: klik V, I, atau R
  const [selectedVariable, setSelectedVariable] = useState<'V' | 'I' | 'R'>('V');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Kartu Tujuan Pembelajaran */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-200 dark:border-blue-900/60 shadow-sm">
        <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 font-bold text-sm mb-3">
          <SparklesIcon size={18} />
          <span>CAPAIAN PEMBELAJARAN (LEARNING OBJECTIVES)</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Apa yang Akan Anda Kuasai Setelah Menyelesaikan Modul Ini?
        </h3>
        <ul className="space-y-2.5">
          {content.learningObjectives.map((obj, idx) => (
            <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Segitiga Interaktif Hukum Ohm */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md space-y-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300">
              Alat Bantu Visual
            </span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Segitiga Rumus Hukum Ohm Interaktif
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Klik salah satu besaran (<strong className="text-cyan-500">V</strong>,{' '}
              <strong className="text-emerald-500">I</strong>, atau{' '}
              <strong className="text-indigo-500">R</strong>) pada segitiga di samping untuk
              melihat perumusan matematis dan penjelasan aplikasinya dalam analisis sirkuit.
            </p>

            {/* Kotak Penjelasan Variabel Terpilih */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm">
              {selectedVariable === 'V' && (
                <div>
                  <div className="font-bold text-cyan-600 dark:text-cyan-400 text-base mb-1">
                    V = I · R (Mencari Beda Potensial / Tegangan)
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Beda potensial (tegangan jatuh) yang melintasi suatu resistor sebanding dengan kuat arus yang
                    mengalir dikalikan nilai resistansinya.
                  </p>
                </div>
              )}
              {selectedVariable === 'I' && (
                <div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-base mb-1">
                    I = V / R (Mencari Kuat Arus Listrik)
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Kuat arus yang mengalir berbanding lurus dengan tegangan sumber dan berbanding terbalik
                    dengan hambatan kawat/komponen.
                  </p>
                </div>
              )}
              {selectedVariable === 'R' && (
                <div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 text-base mb-1">
                    R = V / I (Mencari Hambatan / Resistansi)
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Besar resistansi suatu komponen ditentukan dari rasio beda potensial yang diberikan terhadap
                    arus listrik yang melewatinya.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SVG Segitiga Ohm */}
          <div className="relative w-64 h-56 flex items-center justify-center select-none">
            <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-md">
              {/* Segitiga Luar */}
              <polygon
                points="100,10 10,170 190,170"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-300 dark:text-slate-700"
              />

              {/* Garis Pembagi Horizontal */}
              <line
                x1="45"
                y1="100"
                x2="155"
                y2="100"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-slate-400 dark:text-slate-600"
              />

              {/* Garis Pembagi Vertikal */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="170"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-slate-400 dark:text-slate-600"
              />

              {/* Tombol Segitiga Atas: V */}
              <g
                onClick={() => setSelectedVariable('V')}
                className="cursor-pointer group"
              >
                <polygon
                  points="100,16 50,96 150,96"
                  fill={selectedVariable === 'V' ? 'rgba(56, 189, 248, 0.3)' : 'transparent'}
                  className="transition-colors group-hover:fill-cyan-500/20"
                />
                <text
                  x="100"
                  y="70"
                  textAnchor="middle"
                  fill={selectedVariable === 'V' ? '#0284c7' : '#38bdf8'}
                  fontSize="28"
                  fontWeight="bold"
                >
                  V
                </text>
              </g>

              {/* Tombol Segitiga Bawah Kiri: I */}
              <g
                onClick={() => setSelectedVariable('I')}
                className="cursor-pointer group"
              >
                <polygon
                  points="45,104 96,104 96,166 18,166"
                  fill={selectedVariable === 'I' ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}
                  className="transition-colors group-hover:fill-emerald-500/20"
                />
                <text
                  x="60"
                  y="145"
                  textAnchor="middle"
                  fill={selectedVariable === 'I' ? '#059669' : '#10b981'}
                  fontSize="28"
                  fontWeight="bold"
                >
                  I
                </text>
              </g>

              {/* Tombol Segitiga Bawah Kanan: R */}
              <g
                onClick={() => setSelectedVariable('R')}
                className="cursor-pointer group"
              >
                <polygon
                  points="104,104 155,104 182,166 104,166"
                  fill={selectedVariable === 'R' ? 'rgba(99, 102, 241, 0.3)' : 'transparent'}
                  className="transition-colors group-hover:fill-indigo-500/20"
                />
                <text
                  x="140"
                  y="145"
                  textAnchor="middle"
                  fill={selectedVariable === 'R' ? '#4f46e5' : '#6366f1'}
                  fontSize="28"
                  fontWeight="bold"
                >
                  R
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Rangkaian Teori Penjelasan Terstruktur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.theorySections.map((section) => (
          <div
            key={section.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
              <BookOpenIcon size={16} />
              <span>{section.title}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {section.content}
            </p>

            {section.formula && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-center text-xs font-bold text-slate-800 dark:text-cyan-300 border border-slate-200 dark:border-slate-700">
                {section.formula}
              </div>
            )}

            {section.bulletPoints && (
              <ul className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400">
                {section.bulletPoints.map((pt, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-cyan-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
