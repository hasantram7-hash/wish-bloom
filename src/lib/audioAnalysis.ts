/**
 * Web Audio API Audio Level & Blow Detection Utility
 * Evaluates raw time-domain sound energy strictly on-device.
 * Zero recording, zero audio streaming, zero transmission.
 */

export interface AudioAnalysisSession {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  stream: MediaStream;
  source: MediaStreamAudioSourceNode;
}

export function isAudioAnalysisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const hasAudioContext = !!(window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
  return hasMediaDevices && hasAudioContext;
}

export async function createAudioSession(): Promise<AudioAnalysisSession> {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  // Request audio input track
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
    video: false,
  });

  const audioContext = new AudioCtx();
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.3;

  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);

  return {
    audioContext,
    analyser,
    stream,
    source,
  };
}

/**
 * Calculates current normalized sound energy [0 - 1] from time-domain waveform data
 */
export function calculateAudioEnergy(analyser: AnalyserNode, buffer: Uint8Array): number {
  (analyser as any).getByteTimeDomainData(buffer);
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i++) {
    const normalized = (buffer[i] - 128) / 128;
    sumSquares += normalized * normalized;
  }
  const rms = Math.sqrt(sumSquares / buffer.length);
  // Scale and clamp [0 - 1]
  return Math.min(1, rms * 4.5);
}

/**
 * Cleanly closes the audio session and releases all microphone tracks
 */
export function closeAudioSession(session: AudioAnalysisSession | null): void {
  if (!session) return;
  try {
    session.stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (e) {
        // Ignored
      }
    });
    if (session.audioContext && session.audioContext.state !== 'closed') {
      session.audioContext.close().catch(() => {});
    }
  } catch (err) {
    console.warn('Error closing audio session:', err);
  }
}
