# Web Modul Ajar Interaktif: Simulasi Dasar Teknik Elektro

Aplikasi web modul ajar laboratorium virtual interaktif untuk mahasiswa tingkat awal program studi Teknik Elektro dan Rekayasa Sistem. Dibangun menggunakan teknologi modern di sisi klien (**client-side only**), siap di-deploy secara instan ke **GitHub Pages**.

---

## 🚀 Fitur Utama & Arsitektur

### 1. Modul Simulasi Standar Teknik Elektro
- **Modul 1 (Contoh Lengkap): Hukum Ohm & Daya Listrik**
  - Slider interaktif Tegangan ($0 - 30\text{ V}$) dan Resistansi ($1 - 1000\ \Omega$).
  - Animasi aliran muatan real-time (bisa dipilih: Arus Konvensional $+ \to -$ atau Aliran Elektron $- \to +$). Kecepatan aliran partikel disesuaikan secara proporsional dengan besar arus $I$.
  - Saklar sirkuit ON/OFF interaktif.
  - Multimeter LCD digital (Tegangan $V$, Arus $I$, Hambatan $R$, Daya $P$).
  - **Sistem Proteksi Termal Resistor**: visualisasi bara panas jika daya aktual melampaui batas rating daya fisik ($0.25\text{W}, 0.5\text{W}, 1\text{W}, 2\text{W}, 5\text{W}$).
  - **Grafik Karakteristik Linear $V-I$ Dinamis** menggunakan Recharts dengan pelacakan titik kerja aktif.
  - **Kalkulator Kode Warna Resistor 4 Gelang**: visualisasi pita warna badan resistor secara nyata dan akurat.
- **Daftar Silabus Modul Lainnya (Tahap Pengembangan Berikutnya)**:
  - Rangkaian Seri & Paralel (Pembagi Tegangan & Arus)
  - Wiring Dasar & Kanvas Komponen Drag-and-Drop
  - Power Supply (PSU) & Gelombang Penyearah
  - Kapasitor & Transien Rangkaian RC
  - Multimeter Virtual & Proteksi Pengukuran Titik Rangkaian
  - Osiloskop Virtual Sederhana (Sinus, Kotak, Segitiga)

### 2. Solver Rangkaian Ilmiah
- **Modified Nodal Analysis (MNA)**: Solver matriks $A \cdot x = z$ dengan eliminasi Gauss partial pivoting untuk menyelesaikan tegangan simpul dan arus cabang rangkaian linear DC.
- **Integrasi Numerik RC**: Metode Trapezoidal (Tustin) dan Euler orde-1 untuk menyelesaikan persamaan diferensial transien pengisian dan pengosongan kapasitor.

### 3. Mode Ganda: Mahasiswa vs Guru/Dosen
- **Mode Mahasiswa**:
  - Mengerjakan kuis interaktif dengan umpan balik otomatis (benar/salah).
  - Pembahasan langkah demi langkah dengan rumus matematis.
  - Nilai otomatis disimpan ke `localStorage`.
- **Mode Guru/Dosen**:
  - Dosen dapat mengedit pertanyaan kuis, kunci jawaban benar, dan teks pembahasan langsung dari antarmuka web.

### 4. Standar Simbol IEC 60617 & IEEE Std 315
- Pengguna dapat mengganti tampilan resistor antara standar Eropa (IEC 60617: kotak persegi panjang) dan standar Amerika (IEEE Std 315 / ANSI: garis zigzag).

### 5. Penyimpanan Data & Cadangan
- Semua progres, jawaban kuis, dan rangkaian tersimpan di `localStorage` peramban.
- Fitur **Ekspor / Impor JSON** untuk mencadangkan atau memulihkan data antar perangkat.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Mendukung Mode Gelap & Mode Terang)
- **State Management**: Zustand (dengan persistensi `localStorage`)
- **Grafik & Visualisasi**: Recharts
- **Simbol & Ikon**: Skematik SVG Vektor Standar IEC/IEEE Mandiri (tanpa dependensi eksternal)

---

## 📁 Struktur Direktori Proyek

```
simulasi-elektro/
├── public/                     # Aset statis & favicon
├── src/
│   ├── components/
│   │   ├── common/             # Navbar, Footer, Icons, ExportImportModal
│   │   └── schematics/         # Simbol skematik IEC/IEEE & animasi kawat
│   ├── data/
│   │   ├── modules.json        # Katalog silabus semua modul
│   │   └── ohmModule.json      # Konten modul Hukum Ohm (Teori, Tujuan, Kuis, Ringkasan)
│   ├── pages/
│   │   ├── HomePage.tsx        # Dashboard beranda kartu modul & filter
│   │   └── ModulePage.tsx      # Kontainer modul & tab navigasi
│   ├── simulations/
│   │   └── ohm/
│   │       ├── OhmSimulation.tsx   # Laboratorium interaktif & grafik V-I
│   │       ├── OhmTheory.tsx       # Teori & segitiga rumus interaktif
│   │       ├── OhmQuiz.tsx         # Kuis interaktif (Mode Mahasiswa & Dosen)
│   │       ├── OhmSummary.tsx      # Ringkasan rumus & tabel satuan SI
│   │       └── ResistorColorCode.tsx # Kalkulator kode warna 4 gelang
│   ├── solver/
│   │   ├── mna.ts              # Solver Modified Nodal Analysis (MNA)
│   │   └── rcIntegration.ts    # Integrasi numerik Trapezoidal/Euler RC
│   ├── store/
│   │   └── useAppStore.ts      # Zustand store (Tema, Role, Progres, Backup)
│   ├── types/
│   │   └── index.ts            # Definisi antarmuka TypeScript
│   ├── App.tsx                 # Root router & layout
│   ├── main.tsx                # Entri React
│   └── index.css               # Tailwind CSS v4 & styling animasi
├── package.json
├── tsconfig.json
└── vite.config.ts              # Konfigurasi Vite (base: './' untuk GitHub Pages)
```

---

## 💻 Cara Menjalankan Secara Lokal

### Prasyarat
- Node.js (versi 18 ke atas disarankan)
- npm atau pnpm

### Langkah Menjalankan:
1. Masuk ke direktori proyek:
   ```bash
   cd simulasi-elektro
   ```

2. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```

3. Buka peramban Anda di alamat yang tertera (biasanya `http://localhost:5173`).

---

## 📦 Cara Membangun (Build) & Deploy ke GitHub Pages

Proyek ini telah dikonfigurasi dengan `base: './'` pada `vite.config.ts`, sehingga siap di-host pada sub-direktori GitHub Pages tanpa konfigurasi tambahan:

1. Jalankan build produksi:
   ```bash
   npm run build
   ```
2. Hasil build akan berada di direktori `dist/`.
3. Anda dapat mempublikasikan folder `dist/` ke GitHub Pages melalui branch `gh-pages` atau GitHub Actions Workflow.
