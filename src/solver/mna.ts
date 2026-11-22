/**
 * Solver Sirkuit DC Berbasis Modified Nodal Analysis (MNA)
 * Menggunakan eliminasi Gauss dengan partial pivoting untuk presisi numerik tinggi.
 * Mendukung simpul referensi tanah (Node 0), resistor, sumber tegangan ideal, dan sumber arus.
 */

import type { CircuitElement, MNAResult } from '../types';

/**
 * Menyelesaikan sistem persamaan linear A * x = z
 * menggunakan eliminasi Gauss dengan partial pivoting.
 */
function solveLinearSystem(A: number[][], z: number[]): number[] {
  const n = A.length;
  // Gandakan matriks augmented [A | z]
  const M: number[][] = A.map((row, i) => [...row, z[i]]);

  for (let col = 0; col < n; col++) {
    // Cari baris pivot terbesar
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > maxVal) {
        maxVal = Math.abs(M[row][col]);
        maxRow = row;
      }
    }

    if (maxVal < 1e-12) {
      throw new Error(`Matriks singular pada kolom ${col}. Rangkaian mungkin memiliki simpul mengambang atau loop sumber tegangan tidak valid.`);
    }

    // Tukar baris jika diperlukan
    if (maxRow !== col) {
      const temp = M[col];
      M[col] = M[maxRow];
      M[maxRow] = temp;
    }

    // Eliminasi baris di bawahnya
    for (let row = col + 1; row < n; row++) {
      const factor = M[row][col] / M[col][col];
      for (let j = col; j <= n; j++) {
        M[row][j] -= factor * M[col][j];
      }
    }
  }

  // Substitusi mundur (back-substitution)
  const x = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    let sum = M[row][n];
    for (let col = row + 1; col < n; col++) {
      sum -= M[row][col] * x[col];
    }
    x[row] = sum / M[row][row];
  }

  return x;
}

/**
 * Solver MNA Utama
 */
export function solveMNA(elements: CircuitElement[]): MNAResult {
  try {
    // 1. Identifikasi semua simpul unik non-ground (Node 0 dianggap tanah/referensi)
    const nodeSet = new Set<number>();
    for (const el of elements) {
      if (el.nodePositive !== 0) nodeSet.add(el.nodePositive);
      if (el.nodeNegative !== 0) nodeSet.add(el.nodeNegative);
    }

    // Buat pemetaan nomor simpul ke indeks matriks [0 .. N-1]
    const activeNodes = Array.from(nodeSet).sort((a, b) => a - b);
    const nodeIndexMap = new Map<number, number>();
    activeNodes.forEach((node, idx) => nodeIndexMap.set(node, idx));

    const numNodes = activeNodes.length;

    // 2. Identifikasi sumber tegangan (M sumber)
    const voltageSources = elements.filter((el) => el.type === 'VOLTAGE_SOURCE');
    const numVoltageSources = voltageSources.length;

    const totalVars = numNodes + numVoltageSources;
    if (totalVars === 0) {
      return {
        nodeVoltages: { 0: 0 },
        sourceCurrents: {},
        elementCurrents: {},
        elementPowers: {},
        success: true,
      };
    }

    // Matriks A berukuran (numNodes + numVoltageSources) x (numNodes + numVoltageSources)
    const A: number[][] = Array.from({ length: totalVars }, () => new Array(totalVars).fill(0));
    // Vektor z berukuran totalVars
    const z: number[] = new Array(totalVars).fill(0);

    // 3. Isi Matriks Konduktansi G (submatriks numNodes x numNodes)
    for (const el of elements) {
      if (el.type === 'RESISTOR') {
        if (el.value <= 0) {
          throw new Error(`Resistansi tidak boleh nol atau negatif (${el.name}: ${el.value} Ω)`);
        }
        const g = 1 / el.value; // Konduktansi G = 1/R

        const nPos = el.nodePositive;
        const nNeg = el.nodeNegative;

        if (nPos !== 0) {
          const iPos = nodeIndexMap.get(nPos)!;
          A[iPos][iPos] += g;
        }
        if (nNeg !== 0) {
          const iNeg = nodeIndexMap.get(nNeg)!;
          A[iNeg][iNeg] += g;
        }
        if (nPos !== 0 && nNeg !== 0) {
          const iPos = nodeIndexMap.get(nPos)!;
          const iNeg = nodeIndexMap.get(nNeg)!;
          A[iPos][iNeg] -= g;
          A[iNeg][iPos] -= g;
        }
      } else if (el.type === 'CURRENT_SOURCE') {
        // Sumber arus independen
        const currentVal = el.value;
        // Aliran dari nNeg ke nPos
        if (el.nodePositive !== 0) {
          const iPos = nodeIndexMap.get(el.nodePositive)!;
          z[iPos] += currentVal; // Masuk ke nPos
        }
        if (el.nodeNegative !== 0) {
          const iNeg = nodeIndexMap.get(el.nodeNegative)!;
          z[iNeg] -= currentVal; // Keluar dari nNeg
        }
      }
    }

    // 4. Isi Matriks B, C, dan D untuk Sumber Tegangan
    voltageSources.forEach((vSrc, vsIdx) => {
      const rowIdx = numNodes + vsIdx;
      const colIdx = numNodes + vsIdx;

      const nPos = vSrc.nodePositive;
      const nNeg = vSrc.nodeNegative;

      if (nPos !== 0) {
        const iPos = nodeIndexMap.get(nPos)!;
        A[iPos][colIdx] += 1;
        A[rowIdx][iPos] += 1;
      }

      if (nNeg !== 0) {
        const iNeg = nodeIndexMap.get(nNeg)!;
        A[iNeg][colIdx] -= 1;
        A[rowIdx][iNeg] -= 1;
      }

      // Nilai tegangan pada vektor z
      z[rowIdx] = vSrc.value;
    });

    // 5. Selesaikan sistem linear A * x = z
    const x = solveLinearSystem(A, z);

    // 6. Ekstrak hasil tegangan simpul (termasuk Ground Node 0 = 0V)
    const nodeVoltages: Record<number, number> = { 0: 0 };
    activeNodes.forEach((node, idx) => {
      nodeVoltages[node] = x[idx];
    });

    // 7. Ekstrak arus pada sumber tegangan
    const sourceCurrents: Record<string, number> = {};
    voltageSources.forEach((vSrc, vsIdx) => {
      sourceCurrents[vSrc.id] = x[numNodes + vsIdx];
    });

    // 8. Hitung arus dan disipasi daya pada setiap elemen
    const elementCurrents: Record<string, number> = {};
    const elementPowers: Record<string, number> = {};

    for (const el of elements) {
      const vPos = nodeVoltages[el.nodePositive] ?? 0;
      const vNeg = nodeVoltages[el.nodeNegative] ?? 0;
      const vDrop = vPos - vNeg;

      if (el.type === 'RESISTOR') {
        const i = vDrop / el.value;
        elementCurrents[el.id] = i;
        elementPowers[el.id] = Math.abs(vDrop * i); // Daya disipasi P = V * I
      } else if (el.type === 'VOLTAGE_SOURCE') {
        const i = sourceCurrents[el.id] ?? 0;
        elementCurrents[el.id] = i;
        elementPowers[el.id] = el.value * i;
      } else if (el.type === 'CURRENT_SOURCE') {
        elementCurrents[el.id] = el.value;
        elementPowers[el.id] = Math.abs(vDrop * el.value);
      }
    }

    return {
      nodeVoltages,
      sourceCurrents,
      elementCurrents,
      elementPowers,
      success: true,
    };
  } catch (err: unknown) {
    return {
      nodeVoltages: { 0: 0 },
      sourceCurrents: {},
      elementCurrents: {},
      elementPowers: {},
      success: false,
      errorMessage: err instanceof Error ? err.message : 'Terjadi kegagalan perhitungan solver MNA',
    };
  }
}

