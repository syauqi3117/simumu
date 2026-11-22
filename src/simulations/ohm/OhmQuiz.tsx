/**
 * Komponen Kuis & Latihan Soal Modul 1: Hukum Ohm
 * Dilengkapi Mode Mahasiswa (evaluasi otomatis & penjelasan)
 * dan Mode Guru/Dosen (pengaturan parameter soal & kunci jawaban).
 */

import React, { useState } from 'react';
import type { QuizQuestion } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  Edit3Icon,
  RotateCcwIcon,
  UserCogIcon,
  GraduationCapIcon,
  SparklesIcon,
} from '../../components/common/Icons';

interface OhmQuizProps {
  questions: QuizQuestion[];
  moduleId: string;
}

export const OhmQuiz: React.FC<OhmQuizProps> = ({ questions, moduleId }) => {
  const {
    role,
    saveQuizScore,
    quizScores,
    teacherOverrides,
    updateTeacherOverride,
  } = useAppStore();

  const savedScore = quizScores[moduleId];

  // State Mahasiswa
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(savedScore !== undefined);

  // State Guru/Dosen (Editor Soal)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editExplanationText, setEditExplanationText] = useState('');
  const [editCorrectId, setEditCorrectId] = useState('a');

  // Ambil soal yang mungkin telah diedit oleh Dosen
  const activeQuestions = questions.map((q) => {
    const override = teacherOverrides[q.id];
    if (override) {
      return {
        ...q,
        question: override.customQuestion || q.question,
        correctOptionId: override.customCorrectId || q.correctOptionId,
        explanation: override.customExplanation || q.explanation,
      };
    }
    return q;
  });

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    activeQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / activeQuestions.length) * 100);
    saveQuizScore(moduleId, finalScore, selectedAnswers);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const handleStartEdit = (q: QuizQuestion) => {
    setEditingQuestionId(q.id);
    setEditQuestionText(q.question);
    setEditExplanationText(q.explanation);
    setEditCorrectId(q.correctOptionId);
  };

  const handleSaveEdit = (qId: string) => {
    updateTeacherOverride({
      id: qId,
      customQuestion: editQuestionText,
      customCorrectId: editCorrectId,
      customExplanation: editExplanationText,
    });
    setEditingQuestionId(null);
  };

  const currentScore = savedScore ?? 0;
  const isPassed = currentScore >= 70;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner Peran: Mahasiswa vs Dosen */}
      <div
        className={`p-4 rounded-2xl flex items-center justify-between border ${
          role === 'dosen'
            ? 'bg-amber-500/10 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            : 'bg-indigo-500/10 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          {role === 'dosen' ? <UserCogIcon size={22} /> : <GraduationCapIcon size={22} />}
          <div>
            <h4 className="font-bold text-sm">
              {role === 'dosen'
                ? 'Mode Guru/Dosen Aktif: Kustomisasi & Manajemen Soal'
                : 'Mode Mahasiswa: Evaluasi Mandiri Pemahaman Teori'}
            </h4>
            <p className="text-xs opacity-85">
              {role === 'dosen'
                ? 'Sebagai dosen, Anda dapat mengubah teks pertanyaan, opsi jawaban benar, dan rumus pembahasan untuk disesuaikan dengan kurikulum kelas Anda.'
                : 'Jawab semua pertanyaan untuk mengukur pemahaman Anda. Pembahasan langkah demi langkah akan ditampilkan secara instan.'}
            </p>
          </div>
        </div>
      </div>

      {/* Skor Hasil Evaluasi (jika sudah submit) */}
      {isSubmitted && (
        <div
          className={`p-6 rounded-2xl border text-center space-y-2 ${
            isPassed
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
          }`}
        >
          <div className="flex justify-center">
            {isPassed ? (
              <div className="p-3 bg-emerald-500 text-white rounded-full shadow-lg">
                <CheckCircleIcon size={32} />
              </div>
            ) : (
              <div className="p-3 bg-rose-500 text-white rounded-full shadow-lg">
                <AlertTriangleIcon size={32} />
              </div>
            )}
          </div>
          <h3 className="text-xl font-black">
            {isPassed ? 'Selamat! Anda Telah Lulus Kuis Modul 1' : 'Perlu Pendalaman Materi'}
          </h3>
          <p className="text-sm font-semibold">
            Skor Anda: <span className="text-2xl font-mono">{currentScore} / 100</span>
          </p>
          <p className="text-xs max-w-md mx-auto text-slate-600 dark:text-slate-300">
            {isPassed
              ? 'Pemahaman Anda mengenai hubungan V-I-R dan disipasi daya Joule sudah sangat baik. Progres modul telah disimpan.'
              : 'Pelajari kembali pembahasan di bawah ini atau tinjau simulasi laboratorium untuk memperkuat pemahaman.'}
          </p>
          <div className="pt-3">
            <button
              type="button"
              onClick={handleRetake}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs inline-flex items-center space-x-1.5 shadow"
            >
              <RotateCcwIcon size={14} />
              <span>Ulangi Kuis</span>
            </button>
          </div>
        </div>
      )}

      {/* Daftar Soal */}
      <div className="space-y-6">
        {activeQuestions.map((q, qIndex) => {
          const isCorrect = selectedAnswers[q.id] === q.correctOptionId;
          const isEditing = editingQuestionId === q.id;

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              {/* Header Soal & Aksi Dosen */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <div>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={editQuestionText}
                        onChange={(e) => setEditQuestionText(e.target.value)}
                        className="w-full p-2 text-xs font-medium rounded-lg border border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    ) : (
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-relaxed">
                        {q.question}
                      </h4>
                    )}
                  </div>
                </div>

                {role === 'dosen' && (
                  <div>
                    {isEditing ? (
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(q.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-bold"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingQuestionId(null)}
                          className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(q)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Edit soal ini (Fitur Guru/Dosen)"
                      >
                        <Edit3Icon size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Opsi Pilihan Ganda */}
              <div className="space-y-2 pt-1 pl-9">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt.id;
                  let optionClass =
                    'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

                  if (isSubmitted) {
                    if (opt.id === q.correctOptionId) {
                      optionClass =
                        'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionClass =
                        'border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-300 line-through';
                    }
                  } else if (isSelected) {
                    optionClass = 'border-blue-600 bg-blue-500/15 text-blue-900 dark:text-blue-200 font-bold';
                  }

                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`flex items-center space-x-3 p-3 rounded-xl border text-xs cursor-pointer transition ${optionClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[11px] shrink-0 uppercase">
                        {opt.id}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                    </label>
                  );
                })}
              </div>

              {/* Form Editor Kunci Jawaban Dosen */}
              {isEditing && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 text-xs space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-amber-800 dark:text-amber-200">
                    <UserCogIcon size={14} />
                    <span>Konfigurasi Jawaban Dosen</span>
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1">
                      Kunci Pilihan Benar:
                    </label>
                    <select
                      value={editCorrectId}
                      onChange={(e) => setEditCorrectId(e.target.value)}
                      className="px-2 py-1 rounded border bg-white dark:bg-slate-900"
                    >
                      {q.options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          Opsi {opt.id.toUpperCase()} - {opt.text}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1">
                      Teks Penjelasan / Pembahasan:
                    </label>
                    <textarea
                      rows={2}
                      value={editExplanationText}
                      onChange={(e) => setEditExplanationText(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Penjelasan Pembahasan Soal (Muncul Setelah Submit) */}
              {isSubmitted && (
                <div
                  className={`mt-3 p-4 rounded-xl text-xs space-y-1.5 ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold">
                    {isCorrect ? <CheckCircleIcon size={16} /> : <XCircleIcon size={16} />}
                    <span>{isCorrect ? 'Jawaban Anda Tepat!' : 'Jawaban Anda Kurang Tepat'}</span>
                  </div>
                  {q.formula && (
                    <div className="font-mono font-bold bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg text-slate-900 dark:text-cyan-300">
                      Rumus: {q.formula}
                    </div>
                  )}
                  <p className="leading-relaxed opacity-95">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tombol Submit Kuis */}
      {!isSubmitted && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Terjawab:{' '}
            <strong className="text-blue-600 dark:text-blue-400">
              {Object.keys(selectedAnswers).length}
            </strong>{' '}
            dari {activeQuestions.length} pertanyaan
          </div>

          <button
            type="button"
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length < activeQuestions.length}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow transition ${
              Object.keys(selectedAnswers).length === activeQuestions.length
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <SparklesIcon size={16} />
            <span>Kirim & Evaluasi Jawaban</span>
          </button>
        </div>
      )}
    </div>
  );
};
