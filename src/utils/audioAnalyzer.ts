export interface StemDspMetrics {
  durationSec: number;
  sampleRate: number;
  peakDb: number;
  rmsDb: number;
  crestFactorDb: number;
  spectralCentroidHz: number;
  spectralRolloff85Hz: number;
  sub120HzEnergyPct: number;
  sourceVerdict: "Isolated Guitar Stem (<5% sub-120Hz)" | "Uncertain / Bleed (5-10% sub-120Hz)" | "Full Mix (>=10% sub-120Hz)";
  estimatedBpm: number | null;
}

function fftRadix2(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  let j = 0;
  for (let i = 0; i < n; i++) {
    if (i < j) {
      const tr = re[i];
      const ti = im[i];
      re[i] = re[j];
      im[i] = im[j];
      re[j] = tr;
      im[j] = ti;
    }
    let m = n >> 1;
    while (m >= 1 && j >= m) {
      j -= m;
      m >>= 1;
    }
    j += m;
  }

  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const angle = (-2 * Math.PI) / len;
    const wLenRe = Math.cos(angle);
    const wLenIm = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let wRe = 1;
      let wIm = 0;
      for (let k = 0; k < halfLen; k++) {
        const uRe = re[i + k];
        const uIm = im[i + k];
        const vIdx = i + k + halfLen;
        const tRe = wRe * re[vIdx] - wIm * im[vIdx];
        const tIm = wRe * im[vIdx] + wIm * re[vIdx];

        re[vIdx] = uRe - tRe;
        im[vIdx] = uIm - tIm;
        re[i + k] = uRe + tRe;
        im[i + k] = uIm + tIm;

        const nextWRe = wRe * wLenRe - wIm * wLenIm;
        wIm = wRe * wLenIm + wIm * wLenRe;
        wRe = nextWRe;
      }
    }
  }
}

export async function analyzeAudioStem(file: File): Promise<StemDspMetrics | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    const audioCtx = new AudioCtx();
    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } finally {
      await audioCtx.close().catch(() => {});
    }

    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    const numChannels = audioBuffer.numberOfChannels;
    if (length === 0) return null;

    // Mix down to mono
    const mono = new Float32Array(length);
    for (let ch = 0; ch < numChannels; ch++) {
      const chData = audioBuffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        mono[i] += chData[i] / numChannels;
      }
    }

    // 1. Peak, RMS, Crest Factor
    let peakAmp = 0;
    let sumSq = 0;
    for (let i = 0; i < length; i++) {
      const abs = Math.abs(mono[i]);
      if (abs > peakAmp) peakAmp = abs;
      sumSq += mono[i] * mono[i];
    }

    const rmsAmp = Math.sqrt(sumSq / length);
    const eps = 1e-9;
    const peakDb = Number((20 * Math.log10(Math.max(peakAmp, eps))).toFixed(1));
    const rmsDb = Number((20 * Math.log10(Math.max(rmsAmp, eps))).toFixed(1));
    const crestFactorDb = Number(Math.max(0, peakDb - rmsDb).toFixed(1));

    // 2. Spectral Centroid, 85% Roll-off, and Sub-120 Hz Energy Ratio
    const fftSize = 2048;
    const halfFft = fftSize >> 1;
    const maxFrames = 80;
    const hop = Math.max(fftSize, Math.floor((length - fftSize) / maxFrames));

    const window = new Float64Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)));
    }

    let weightedCentroidSum = 0;
    let weightedRolloffSum = 0;
    let totalSpectralEnergy = 0;
    let sub120SpectralEnergy = 0;
    let totalFrameWeight = 0;

    const re = new Float64Array(fftSize);
    const im = new Float64Array(fftSize);
    const magSq = new Float64Array(halfFft);

    const binHz = sampleRate / fftSize;

    for (let start = 0; start + fftSize <= length; start += hop) {
      let frameEnergy = 0;
      for (let i = 0; i < fftSize; i++) {
        const s = mono[start + i];
        frameEnergy += s * s;
        re[i] = s * window[i];
        im[i] = 0;
      }

      const frameRms = Math.sqrt(frameEnergy / fftSize);
      // Skip near-silent frames
      if (frameRms < rmsAmp * 0.15) continue;

      fftRadix2(re, im);

      let frameMagSum = 0;
      let framePowerSum = 0;
      let freqWeightedMag = 0;

      for (let k = 1; k < halfFft; k++) {
        const p = re[k] * re[k] + im[k] * im[k];
        const m = Math.sqrt(p);
        magSq[k] = p;
        const freq = k * binHz;
        frameMagSum += m;
        framePowerSum += p;
        freqWeightedMag += freq * m;

        totalSpectralEnergy += p;
        if (freq < 120) {
          sub120SpectralEnergy += p;
        }
      }

      if (frameMagSum > 0 && framePowerSum > 0) {
        const frameCentroid = freqWeightedMag / frameMagSum;
        const target85 = 0.85 * framePowerSum;
        let accumPower = 0;
        let rolloffFreq = halfFft * binHz;
        for (let k = 1; k < halfFft; k++) {
          accumPower += magSq[k];
          if (accumPower >= target85) {
            rolloffFreq = k * binHz;
            break;
          }
        }

        weightedCentroidSum += frameCentroid * frameRms;
        weightedRolloffSum += rolloffFreq * frameRms;
        totalFrameWeight += frameRms;
      }
    }

    const spectralCentroidHz = totalFrameWeight > 0 ? Math.round(weightedCentroidSum / totalFrameWeight) : 1200;
    const spectralRolloff85Hz = totalFrameWeight > 0 ? Math.round(weightedRolloffSum / totalFrameWeight) : 3200;
    const sub120HzEnergyPct =
      totalSpectralEnergy > 0 ? Number(((sub120SpectralEnergy / totalSpectralEnergy) * 100).toFixed(1)) : 0;

    let sourceVerdict: StemDspMetrics["sourceVerdict"] = "Isolated Guitar Stem (<5% sub-120Hz)";
    if (sub120HzEnergyPct >= 10) {
      sourceVerdict = "Full Mix (>=10% sub-120Hz)";
    } else if (sub120HzEnergyPct >= 5) {
      sourceVerdict = "Uncertain / Bleed (5-10% sub-120Hz)";
    }

    // 3. Tempo (BPM) estimation via onset envelope autocorrelation
    const envFrameSize = Math.max(256, Math.round(sampleRate * 0.01)); // 10ms hop
    const numEnvFrames = Math.floor(length / envFrameSize);
    let estimatedBpm: number | null = null;

    if (numEnvFrames > 200) {
      const env = new Float32Array(numEnvFrames);
      for (let f = 0; f < numEnvFrames; f++) {
        let sum = 0;
        const base = f * envFrameSize;
        for (let i = 0; i < envFrameSize; i++) {
          const v = mono[base + i];
          sum += v * v;
        }
        env[f] = Math.sqrt(sum / envFrameSize);
      }

      // First-order positive onset flux
      const onset = new Float32Array(numEnvFrames);
      for (let f = 1; f < numEnvFrames; f++) {
        const diff = env[f] - env[f - 1];
        onset[f] = diff > 0 ? diff : 0;
      }

      const envRate = sampleRate / envFrameSize; // ~100 Hz
      const minLag = Math.round((envRate * 60) / 180); // 180 BPM
      const maxLag = Math.round((envRate * 60) / 65); // 65 BPM

      let bestLag = 0;
      let bestScore = -1;
      for (let lag = minLag; lag <= Math.min(maxLag, Math.floor(numEnvFrames / 2)); lag++) {
        let corr = 0;
        const limit = numEnvFrames - lag;
        for (let i = 0; i < limit; i++) {
          corr += onset[i] * onset[i + lag];
        }
        const normCorr = corr / limit;
        if (normCorr > bestScore) {
          bestScore = normCorr;
          bestLag = lag;
        }
      }

      if (bestLag > 0 && bestScore > 0) {
        let bpm = Math.round((envRate * 60) / bestLag);
        while (bpm < 70) bpm *= 2;
        while (bpm > 175) bpm = Math.round(bpm / 2);
        estimatedBpm = bpm;
      }
    }

    return {
      durationSec: Number((length / sampleRate).toFixed(1)),
      sampleRate,
      peakDb,
      rmsDb,
      crestFactorDb,
      spectralCentroidHz,
      spectralRolloff85Hz,
      sub120HzEnergyPct,
      sourceVerdict,
      estimatedBpm,
    };
  } catch (err) {
    console.warn("Web Audio DSP stem analysis failed:", err);
    return null;
  }
}

export function formatStemMetricsForPrompt(filename: string, metrics: StemDspMetrics): string {
  return [
    `--- Measured DSP Acoustic Telemetry for Uploaded Stem (${filename}) ---`,
    `- Duration: ${metrics.durationSec}s @ ${metrics.sampleRate} Hz`,
    `- Peak Level: ${metrics.peakDb} dBFS`,
    `- RMS Level: ${metrics.rmsDb} dBFS`,
    `- Crest Factor: ${metrics.crestFactorDb} dB`,
    `- Spectral Centroid: ${metrics.spectralCentroidHz} Hz`,
    `- 85% Spectral Roll-off: ${metrics.spectralRolloff85Hz} Hz`,
    `- Sub-120 Hz Energy: ${metrics.sub120HzEnergyPct}% (${metrics.sourceVerdict})`,
    `- Estimated Tempo: ${metrics.estimatedBpm ? `${metrics.estimatedBpm} BPM` : "not measured"}`,
    `Use these exact measured dB, Hz, and BPM figures in acoustic_audit and when mapping EQ, Compressor, and Delay settings per stem_analysis_reference.md.`,
  ].join("\n");
}
