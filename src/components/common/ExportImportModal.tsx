/**
 * Modal Ekspor & Impor Data Progres / Rangkaian (Format JSON)
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  DownloadIcon,
  UploadIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  RotateCcwIcon,
  XCircleIcon,
} from './Icons';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
  const { exportBackupJson, importBackupJson, resetAllData } = useAppStore();
  const [jsonInput, setJsonInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadFile = () => {
    const dataStr = exportBackupJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simulasi-elektro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ type: 'success', text: 'Berkas JSON berhasil diunduh ke perangkat Anda.' });
  };

  const handleImportText = () => {
    if (!jsonInput.trim()) {
      setStatusMessage({ type: 'error', text: 'Silakan tempel teks JSON terlebih dahulu.' });
      return;
    }
    const result = importBackupJson(jsonInput);
    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      setJsonInput('');
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importBackupJson(content);
        if (result.success) {
          setStatusMessage({ type: 'success', text: `Berkas "${file.name}" berhasil diimpor!` });
        } else {
          setStatusMessage({ type: 'error', text: result.message });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat progres belajar dan nilai kuis?')) {
      resetAllData();
      setStatusMessage({ type: 'success', text: 'Semua progres belajar telah direset ke kondisi awal.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <DownloadIcon className="text-cyan-500" size={20} />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cadangan & Pemulihan Data (JSON)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <XCircleIcon size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg flex items-center space-x-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircleIcon size={18} />
              ) : (
                <AlertTriangleIcon size={18} />
              )}
              <span className="text-xs font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* Section 1: Ekspor File */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center space-x-1.5">
              <DownloadIcon size={16} className="text-blue-500" />
              <span>Ekspor Progres ke File JSON</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Unduh berkas cadangan berisi progres belajar, nilai kuis, dan konfigurasi dosen.
            </p>
            <button
              type="button"
              onClick={handleDownloadFile}
              className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center space-x-2 transition shadow-sm"
            >
              <DownloadIcon size={14} />
              <span>Unduh File Cadangan (.json)</span>
            </button>
          </div>

          {/* Section 2: Impor File atau Teks */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center space-x-1.5">
              <UploadIcon size={16} className="text-emerald-500" />
              <span>Impor Cadangan Progres</span>
            </h4>

            {/* Input File */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Pilih Berkas JSON:
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
              />
            </div>

            {/* Atau tempel string JSON */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Atau Tempel Teks JSON di Sini:
              </label>
              <textarea
                rows={3}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"version": "1.0.0", "data": { ... }}'
                className="w-full p-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleImportText}
                className="mt-2 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <UploadIcon size={14} />
                <span>Terapkan Impor JSON</span>
              </button>
            </div>
          </div>

          {/* Section 3: Reset Data */}
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-slate-500">Ingin mulai dari awal?</span>
            <button
              type="button"
              onClick={handleResetData}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center space-x-1 font-medium"
            >
              <RotateCcwIcon size={12} />
              <span>Hapus Semua Progres</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

