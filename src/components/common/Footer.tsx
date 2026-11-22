/**
 * Footer Aplikasi Simulasi Dasar Teknik Elektro
 */

import React from 'react';
import { ZapIcon, ShieldCheckIcon } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Kolom 1 */}
          <div>
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-base mb-2">
              <ZapIcon size={18} className="text-cyan-500" />
              <span>Simulasi Dasar Teknik Elektro</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Platform laboratorium virtual interaktif untuk mata kuliah Rangkaian Listrik I dan
              Dasar Teknik Elektro. Berjalan 100% di browser sisi klien tanpa server backend.
            </p>
          </div>

          {/* Kolom 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2">
              Standar Rujukan & Solver
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Simbol Skematik: IEC 60617 & IEEE Std 315</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Solver Sirkuit DC: Modified Nodal Analysis (MNA)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Transien RC: Integrasi Numerik Trapezoidal & Euler</span>
              </li>
            </ul>
          </div>

          {/* Kolom 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2">
              Kemandirian & Penyimpanan
            </h4>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                <ShieldCheckIcon size={14} />
                <span>Privasi & Keamanan Penuh</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Data jawaban kuis dan rangkaian tersimpan di <code className="text-cyan-600">localStorage</code> browser Anda. Siap di-deploy langsung ke GitHub Pages.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Modul Ajar Interaktif Teknik Elektro. Dikembangkan untuk Pendidikan Tinggi.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span>React + Vite + TypeScript + Tailwind CSS</span>
            <span>•</span>
            <span className="text-emerald-500 font-medium">Client-Side Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
