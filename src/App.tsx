/**
 * Komponen Induk Aplikasi Web Simulasi Dasar Teknik Elektro
 */

import { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ExportImportModal } from './components/common/ExportImportModal';
import { HomePage } from './pages/HomePage';
import { ModulePage } from './pages/ModulePage';

export function App() {
  const { theme } = useAppStore();
  const [currentView, setCurrentView] = useState<'home' | 'hukum-ohm'>('home');
  const [isExportImportOpen, setIsExportImportOpen] = useState<boolean>(false);

  // Inisialisasi tema gelap/terang pada dokumen HTML
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sinkronisasi navigasi dengan window hash untuk GitHub Pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'hukum-ohm') {
        setCurrentView('hukum-ohm');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: 'home' | 'hukum-ohm') => {
    setCurrentView(view);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navbar Global */}
      <Navbar
        onOpenExportImport={() => setIsExportImportOpen(true)}
        onNavigateHome={() => navigateTo('home')}
        activeModuleTitle={currentView === 'hukum-ohm' ? 'Modul 1: Hukum Ohm' : undefined}
      />

      {/* Konten Utama */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <HomePage onSelectModule={(moduleId) => navigateTo(moduleId as any)} />
        )}
        {currentView === 'hukum-ohm' && (
          <ModulePage moduleId="hukum-ohm" onNavigateHome={() => navigateTo('home')} />
        )}
      </main>

      {/* Footer Global */}
      <Footer />

      {/* Modal Ekspor/Impor JSON */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
      />
    </div>
  );
}

export default App;
