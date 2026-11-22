/**
 * Halaman Ringkasan & Lembar Rumus Modul 1: Hukum Ohm
 */

import React from 'react';
import type { ModuleContent } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import {
  CheckCircleIcon,
  SparklesIcon,
  BookOpenIcon,
} from '../../components/common/Icons';

interface OhmSummaryProps {
  content: ModuleContent;
  onNavigateTab?: (tabId: string) => void;
  onNavigateHome: () => void;
}

export const OhmSummary: React.FC<OhmSummaryProps> = ({
  content,
  onNavigateHome,
}) => {
  const { completedModules, markModuleCompleted } = useAppStore();
  const isCompleted = completedModules.includes(content.id);

  const handleMarkComplete = () => {
    markModuleCompleted(content.id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Poin-Poin Inti Ringkasan */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
          <SparklesIcon size={18} />
          <span>RINGKASAN ESENSIAL MATERI</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Poin-Poin Kunci yang Harus Diingat Setiap Calon Insinyur Elektro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {content.summaryPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start space-x-3 text-xs text-slate-700 dark:text-slate-300"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                ✓
              </span>
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lembar Rumus Lengkap (Formula Cheat Sheet) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
          <BookOpenIcon size={16} className="text-blue-500" />
          <span>Matriks Formula Hukum Ohm & Daya Joule</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
          {/* Rumus V */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Tegangan (V)
            </span>
            <div className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
              V = I · R
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              V = √(P · R)
            </div>
          </div>

          {/* Rumus I */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Kuat Arus (I)
            </span>
            <div className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
              I = V / R
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              I = √(P / R) = P / V
            </div>
          </div>

          {/* Rumus R */}
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Resistansi (R)
            </span>
            <div className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
              R = V / I
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              R = V² / P = P / I²
            </div>
          </div>

          {/* Rumus P */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Daya Disipasi (P)
            </span>
            <div className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
              P = V · I
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              P = I² · R = V² / R
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Satuan Standar Internasional (SI) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
          Tabel Standar Besaran & Satuan SI Teknik Elektro
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4 rounded-l-lg">Besaran Fisis</th>
                <th className="py-2.5 px-4">Simbol</th>
                <th className="py-2.5 px-4">Satuan SI</th>
                <th className="py-2.5 px-4">Simbol Satuan</th>
                <th className="py-2.5 px-4 rounded-r-lg">Definisi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              {content.siUnits.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">
                    {u.quantity}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {u.symbol}
                  </td>
                  <td className="py-2.5 px-4">{u.unit}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {u.unitSymbol}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">{u.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tombol Penyelesaian Modul & Navigasi */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold">
            {isCompleted ? '✓ Anda Telah Menyelesaikan Modul 1!' : 'Siap Menyelesaikan Modul Ini?'}
          </h4>
          <p className="text-xs text-blue-100 mt-1 max-w-lg">
            {isCompleted
              ? 'Progres modul telah tercatat dalam riwayat belajar Anda. Anda dapat kembali ke Beranda atau mengulang kuis kapan saja.'
              : 'Klik tombol di samping untuk mencatat status penyelesaian ke localStorage browser Anda.'}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {!isCompleted ? (
            <button
              type="button"
              onClick={handleMarkComplete}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition shadow"
            >
              Tandai Modul Selesai
            </button>
          ) : (
            <span className="px-4 py-2 rounded-xl bg-emerald-500/30 border border-emerald-300 text-white font-bold text-xs flex items-center space-x-1.5">
              <CheckCircleIcon size={16} />
              <span>Selesai</span>
            </span>
          )}

          <button
            type="button"
            onClick={onNavigateHome}
            className="px-4 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-bold text-xs transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};
