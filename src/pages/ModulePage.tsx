/**
 * Halaman Kontainer Modul Pembelajaran
 * Memfasilitasi perpindahan tab (Teori, Simulasi, Kuis, Ringkasan)
 * serta integrasi konten JSON dan evaluasi progres.
 */

import React, { useState } from 'react';
import type { ModuleContent } from '../types';
import ohmModuleData from '../data/ohmModule.json';
import { OhmTheory } from '../simulations/ohm/OhmTheory';
import { OhmSimulation } from '../simulations/ohm/OhmSimulation';
import { OhmQuiz } from '../simulations/ohm/OhmQuiz';
import { OhmSummary } from '../simulations/ohm/OhmSummary';
import { useAppStore } from '../store/useAppStore';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  ZapIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '../components/common/Icons';

interface ModulePageProps {
  moduleId?: string;
  onNavigateHome: () => void;
}

export const ModulePage: React.FC<ModulePageProps> = ({ onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'quiz' | 'summary'>('simulation');
  const { completedModules, quizScores } = useAppStore();

  // Saat ini modul Hukum Ohm adalah contoh lengkap
  const content = ohmModuleData as ModuleContent;
  const isCompleted = completedModules.includes(content.id);
  const score = quizScores[content.id];

  const tabs = [
    { id: 'theory', label: '1. Teori & Tujuan', icon: <BookOpenIcon size={16} /> },
    { id: 'simulation', label: '2. Laboratorium Interaktif', icon: <ZapIcon size={16} /> },
    { id: 'quiz', label: '3. Latihan & Kuis', icon: <SparklesIcon size={16} /> },
    { id: 'summary', label: '4. Ringkasan & Rumus', icon: <CheckCircleIcon size={16} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigasi Breadcrumb & Tombol Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1 font-medium transition"
          >
            <ArrowLeftIcon size={14} />
            <span>Kembali ke Beranda</span>
          </button>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">
            {content.title}
          </span>
        </div>

        {/* Badge Progres Modul */}
        <div className="flex items-center space-x-2">
          {score !== undefined && (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Skor Kuis: {score}/100
            </span>
          )}
          {isCompleted && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center space-x-1">
              <CheckCircleIcon size={14} />
              <span>Modul Selesai</span>
            </span>
          )}
        </div>
      </div>

      {/* Header Modul */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
            Modul 1 (Pemula)
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400">{content.standardInfo}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {content.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          {content.subtitle}
        </p>

        {/* Tab Navigation Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Konten Tab Aktif */}
      <div>
        {activeTab === 'theory' && <OhmTheory content={content} />}
        {activeTab === 'simulation' && <OhmSimulation />}
        {activeTab === 'quiz' && <OhmQuiz questions={content.quizQuestions} moduleId={content.id} />}
        {activeTab === 'summary' && (
          <OhmSummary
            content={content}
            onNavigateTab={(tabId) => setActiveTab(tabId as any)}
            onNavigateHome={onNavigateHome}
          />
        )}
      </div>
    </div>
  );
};
