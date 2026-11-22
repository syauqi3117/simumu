/**
 * Solver Integrasi Numerik untuk Rangkaian Transien Kapasitor (RC)
 * Menggunakan metode Euler (Eksplisit/Implisit) dan Metode Trapezoidal (Tustin)
 * untuk menyelesaikan persamaan diferensial orde-1: C * (dv_c / dt) + (v_c / R) = V_in / R
 */

import type { RCDataPoint } from '../types';

export interface RCSimulationParams {
  resistance: number;      // R dalam Ohm
  capacitance: number;     // C dalam Farad
  vSource: number;         // Tegangan sumber DC (Volt)
  vInitial: number;        // Tegangan mula-mula kapasitor (Volt)
  totalTime: number;       // Waktu total simulasi (detik)
  stepSize?: number;       // Ukuran langkah waktu dt (detik)
  method?: 'euler-forward' | 'euler-backward' | 'trapezoidal';
  isDischarging?: boolean; // Apakah mode pengosongan (tanpa sumber DC)
}

/**
 * Menghitung transien RC menggunakan integrasi numerik
 */
export function simulateRCNumerical({
  resistance,
  capacitance,
  vSource,
  vInitial = 0,
  totalTime,
  stepSize,
  method = 'trapezoidal',
  isDischarging = false,
}: RCSimulationParams): RCDataPoint[] {
  const tau = resistance * capacitance; // Konstanta waktu tau = R * C (detik)
  
  // Jika stepSize tidak diberikan, tentukan resolusi yang cukup halus (minimal 100 poin per tau)
  const dt = stepSize ?? Math.min(tau / 50, totalTime / 300);
  const steps = Math.ceil(totalTime / dt);

  const points: RCDataPoint[] = [];

  let t = 0;
  let vc = vInitial;
  const targetV = isDischarging ? 0 : vSource;

  // Titik awal t = 0
  const vr0 = targetV - vc;
  const i0 = vr0 / resistance;
  points.push({
    time: Number(t.toFixed(5)),
    vCapacitor: Number(vc.toFixed(4)),
    vResistor: Number(vr0.toFixed(4)),
    iCircuit: Number(i0.toFixed(6)),
  });

  for (let step = 1; step <= steps; step++) {
    t += dt;

    if (method === 'euler-forward') {
      // Forward Euler (Eksplisit): dv_c/dt = (V_in - v_c) / tau
      const dvc = (targetV - vc) / tau;
      vc = vc + dt * dvc;
    } else if (method === 'euler-backward') {
      // Backward Euler (Implisit): vc(k+1) = (vc(k) + (dt/tau)*targetV) / (1 + dt/tau)
      const alpha = dt / tau;
      vc = (vc + alpha * targetV) / (1 + alpha);
    } else {
      // Metode Trapezoidal (Tustin/Bilineal): stabil tanpa syarat dan akurat orde-2
      const alpha = dt / (2 * tau);
      vc = (vc * (1 - alpha) + 2 * alpha * targetV) / (1 + alpha);
    }

    const vr = targetV - vc;
    const i = vr / resistance;

    // Simpan sampel ke array (hindari terlalu banyak titik untuk performa Recharts)
    if (step % Math.max(1, Math.floor(steps / 150)) === 0 || step === steps) {
      points.push({
        time: Number(t.toFixed(5)),
        vCapacitor: Number(vc.toFixed(4)),
        vResistor: Number(vr.toFixed(4)),
        iCircuit: Number(i.toFixed(6)),
      });
    }
  }

  return points;
}

/**
 * Solusi analitik eksak untuk perbandingan validasi
 * Pengisian: vc(t) = V_in * (1 - e^(-t / tau))
 * Pengosongan: vc(t) = V_0 * e^(-t / tau)
 */
export function getAnalyticalRCValue(
  t: number,
  r: number,
  c: number,
  vSource: number,
  vInitial: number,
  isDischarging: boolean
): number {
  const tau = r * c;
  if (isDischarging) {
    return vInitial * Math.exp(-t / tau);
  }
  return vInitial * Math.exp(-t / tau) + vSource * (1 - Math.exp(-t / tau));
}

