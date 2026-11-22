/**
 * Halaman Beranda (Home Dashboard)
 * Menyajikan daftar modul simulasi dalam bentuk kartu interaktif,
 * filter kategori & tingkat kesulitan, ringkasan capaian, dan informasi role Dosen/Mahasiswa.
 */

import React, { useState } from 'react';
import type { ModuleMeta } from '../types';
import modulesData from '../data/modules.json';
import { useAppStore } from '../store/useAppStore';
import {
  ZapIcon,
  LayersIcon,
  CpuIcon,
  ActivityIcon,
  SlidersIcon,
  ShieldCheckIcon,
  ClockIcon,
  GraduationCapIcon,
  UserCogIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '../components/common/Icons';

interface HomePageProps {
  onSelectModule: (moduleId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectModule }) => {
  const { completedModules, quizScores, role, toggleRole } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const modules = modulesData as ModuleMeta[];

  // Pemetaan ikon dinamis
  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <ZapIcon size={24} className="text-cyan-500" />;
      case 'Layers':
        return <LayersIcon size={24} className="text-blue-500" />;
      case 'Cpu':
        return <CpuIcon size={24} className="text-emerald-500" />;
      case 'Activity':
        return <ActivityIcon size={24} className="text-indigo-500" />;
      case 'Sliders':
        return <SlidersIcon size={24} className="text-violet-500" />;
      case 'ShieldCheck':
        return <ShieldCheckIcon size={24} className="text-amber-500" />;
      default:
        return <ZapIcon size={24} className="text-cyan-500" />;
    }
  };

  // Filter modul berdasarkan kategori
  const filteredModules = modules.filter((m) => {
    if (selectedCategory === 'Semua') return true;
    return m.category === selectedCategory;
  });

  const categories = ['Semua', 'Dasar', 'Rangkaian', 'Instrumen', 'Sinyal'];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
            <SparklesIcon size={14} />
            <span>Laboratorium Virtual Teknik Elektro Tingkat Universitas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Kuasai Sirkuit Listrik Melalui{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Simulasi Interaktif
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Eksplorasi hukum dasar kelistrikan, karakteristik komponen pasif & aktif, pembacaan instrumen ukur,
            dan analisis rangkaian DC berbasis solver matematis <strong className="text-cyan-300">Modified Nodal Analysis (MNA)</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-slate-400">Total Silabus:</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">7 Modul</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-slate-400">Modul Selesai:</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {completedModules.length} / 7
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-slate-400">Mode Aktif:</div>
              <div className="text-xl font-bold capitalize text-amber-400 mt-0.5">{role}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-slate-400">Deployment:</div>
              <div className="text-xl font-bold text-blue-400 mt-0.5">GitHub Pages</div>
            </div>
          </div>
        </div>

        {/* Latar Belakang Efek Glow Grafis */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* BANNER MODE PERAN (MAHASISWA VS DOSEN) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div
            className={`p-2.5 rounded-xl ${
              role === 'dosen'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {role === 'dosen' ? <UserCogIcon size={24} /> : <GraduationCapIcon size={24} />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Anda Sedang Berada dalam {role === 'dosen' ? 'Mode Guru / Dosen' : 'Mode Mahasiswa'}
              </h3>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                  role === 'dosen'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}
              >
                Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {role === 'dosen'
                ? 'Mode Dosen memungkinkan Anda mengedit parameter soal kuis, mengubah kunci jawaban, dan menguji modul dari kacamata pengajar.'
                : 'Mode Mahasiswa memberikan evaluasi otomatis secara instan, pembahasan langkah demi langkah, dan penyimpanan nilai kuis.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleRole}
          className="px-4 py-2 rounded-xl text-xs font-bold border transition shadow-sm whitespace-nowrap bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700"
        >
          Ganti ke {role === 'dosen' ? 'Mode Mahasiswa' : 'Mode Dosen'}
        </button>
      </section>

      {/* FILTER KATEGORI MODUL */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Katalog Modul Pembelajaran & Simulasi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pilih modul untuk memulai eksplorasi teori, laboratorium virtual, dan evaluasi kuis.
            </p>
          </div>

          {/* Tombol Tab Kategori */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID KARTU MODUL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const isCompleted = completedModules.includes(module.id);
            const score = quizScores[module.id];

            return (
              <div
                key={module.id}
                className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                  module.isAvailable
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:-translate-y-1'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-90'
                }`}
              >
                <div className="space-y-4">
                  {/* Header Kartu: Ikon & Badge Status */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                      {getModuleIcon(module.icon)}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {/* Tingkat Kesulitan */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          module.difficulty === 'Pemula'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : module.difficulty === 'Praktikum'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : module.difficulty === 'Menengah'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        }`}
                      >
                        {module.difficulty}
                      </span>

                      {/* Status Ketersediaan & Capaian */}
                      {isCompleted ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ✓ Selesai {score !== undefined ? `(${score}%)` : ''}
                        </span>
                      ) : module.isAvailable ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                          Tersedia
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          Tahap Berikutnya
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Judul & Deskripsi */}
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {module.title}
                    </h3>
                    <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400 mt-0.5">
                      {module.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2 line-clamp-3">
                      {module.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {module.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Kartu: Estimasi Waktu & Tombol Aksi */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <ClockIcon size={14} />
                    <span>~{module.estimatedMinutes} Menit</span>
                  </div>

                  {module.isAvailable ? (
                    <button
                      type="button"
                      onClick={() => onSelectModule(module.id)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm group"
                    >
                      <span>Buka Modul</span>
                      <ArrowRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400 italic">
                      Menunggu Tahap 3
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HIGHLIGHT SOLVER & STANDAR TEKNIK ELEKTRO */}
      <section className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Landasan Ilmiah Solver & Standar Rekayasa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
              <CpuIcon size={16} className="text-cyan-500" />
              <span>Modified Nodal Analysis (MNA)</span>
            </h4>
            <p>
              Solver sirkuit resistif DC dibangun dengan formulasi matriks <code className="text-cyan-600 dark:text-cyan-400 font-mono">A · x = z</code>,
              menyelesaikan tegangan setiap simpul dan arus sumber tegangan secara simultan via eliminasi Gauss partial pivoting.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
              <ActivityIcon size={16} className="text-emerald-500" />
              <span>Integrasi Numerik RC</span>
            </h4>
            <p>
              Simulasi transien kapasitor orde-1 menggunakan metode integrasi numerik Trapezoidal (Tustin)
              yang stabil tanpa syarat untuk menghitung respons pengisian/pengosongan tegangan <code className="text-emerald-600 dark:text-emerald-400 font-mono">v_c(t)</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
              <ZapIcon size={16} className="text-indigo-500" />
              <span>Simbol Standar IEC & IEEE</span>
            </h4>
            <p>
              Mahasiswa dapat memilih antara simbol standar Eropa IEC 60617 (resistor kotak) atau Amerika IEEE Std 315 / ANSI (resistor zigzag),
              lengkap dengan kode warna 4 gelang standar industri.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
