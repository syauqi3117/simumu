/**
 * Navbar Utama Aplikasi Simulasi Dasar Teknik Elektro
 */

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  ZapIcon,
  SunIcon,
  MoonIcon,
  GraduationCapIcon,
  UserCogIcon,
  DownloadIcon,
} from './Icons';

interface NavbarProps {
  onOpenExportImport: () => void;
  onNavigateHome: () => void;
  activeModuleTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenExportImport,
  onNavigateHome,
  activeModuleTitle,
}) => {
  const {
    theme,
    toggleTheme,
    role,
    toggleRole,
    schematicStandard,
    toggleSchematicStandard,
    completedModules,
  } = useAppStore();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ZapIcon size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Simulasi Dasar Teknik Elektro
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Laboratorium Virtual & Modul Ajar Interaktif S1 Teknik Elektro
            </p>
          </div>
        </div>

        {/* Status Modul Aktif (jika di dalam modul) */}
        {activeModuleTitle && (
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate max-w-xs">
              {activeModuleTitle}
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Progres Badge */}
          <div
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
            title="Total modul yang telah diselesaikan"
          >
            <span>Progres:</span>
            <span className="font-bold">{completedModules.length} / 7</span>
          </div>

          {/* Toggle Standar Skematik IEC / IEEE */}
          <button
            type="button"
            onClick={toggleSchematicStandard}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="Ganti Standar Simbol Resistor: IEC (Kotak) vs IEEE (Zigzag)"
          >
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">STANDAR:</span>
            <span className="text-cyan-600 dark:text-cyan-400">{schematicStandard}</span>
          </button>

          {/* Role Toggle (Mahasiswa / Dosen) */}
          <button
            type="button"
            onClick={toggleRole}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm ${
              role === 'dosen'
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-400 dark:border-amber-700/60 hover:bg-amber-500/20'
                : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-400 dark:border-indigo-700/60 hover:bg-indigo-500/20'
            }`}
            title="Ganti Mode: Mahasiswa (mengerjakan kuis) atau Dosen (mengatur parameter soal)"
          >
            {role === 'dosen' ? (
              <>
                <UserCogIcon size={14} />
                <span>Mode Dosen</span>
              </>
            ) : (
              <>
                <GraduationCapIcon size={14} />
                <span>Mode Mahasiswa</span>
              </>
            )}
          </button>

          {/* Backup / Export-Import JSON */}
          <button
            type="button"
            onClick={onOpenExportImport}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Cadangkan / Pulihkan Data Progres (Ekspor/Impor JSON)"
          >
            <DownloadIcon size={16} />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};
