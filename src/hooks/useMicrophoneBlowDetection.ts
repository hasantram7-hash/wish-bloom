import { useState, useRef, useEffect, useCallback } from 'react';
import {
  AudioAnalysisSession,
  isAudioAnalysisSupported,
  createAudioSession,
  calculateAudioEnergy,
  closeAudioSession,
} from '../lib/audioAnalysis';

export type MicBlowStatus =
  | 'idle'
  | 'requesting'
  | 'ready'
  | 'listening'
  | 'detected'
  | 'denied'
  | 'unsupported'
  | 'insecure'
  | 'error';

interface UseMicrophoneBlowDetectionProps {
  onBlowDetected: () => void;
  sensitivity?: 'low' | 'normal' | 'high';
  enabled?: boolean;
}

export function useMicrophoneBlowDetection({
  onBlowDetected,
  sensitivity = 'normal',
  enabled = true,
}: UseMicrophoneBlowDetectionProps) {
  const [status, setStatus] = useState<MicBlowStatus>('idle');
  const [currentEnergy, setCurrentEnergy] = useState<number>(0);
  const [sustainedProgress, setSustainedProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sessionRef = useRef<AudioAnalysisSession | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const sustainedStartRef = useRef<number | null>(null);
  const onBlowDetectedRef = useRef(onBlowDetected);
  onBlowDetectedRef.current = onBlowDetected;

  // Thresholds based on sensitivity
  const config = {
    low: { energyThreshold: 0.45, requiredDurationMs: 750 },
    normal: { energyThreshold: 0.32, requiredDurationMs: 600 },
    high: { energyThreshold: 0.20, requiredDurationMs: 500 },
  }[sensitivity];

  const stopListening = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    closeAudioSession(sessionRef.current);
    sessionRef.current = null;
    sustainedStartRef.current = null;
    setCurrentEnergy(0);
    setSustainedProgress(0);
  }, []);

  const startListening = useCallback(async () => {
    // 1. Check secure context
    if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
      setStatus('insecure');
      setErrorMessage('Microphone candle blowing requires an HTTPS connection.');
      return;
    }

    // 2. Check browser support
    if (!isAudioAnalysisSupported()) {
      setStatus('unsupported');
      setErrorMessage('Audio analysis is not supported on this browser.');
      return;
    }

    stopListening();
    setStatus('requesting');
    setErrorMessage(null);

    try {
      const session = await createAudioSession();
      sessionRef.current = session;
      setStatus('listening');

      const dataArray = new Uint8Array(session.analyser.fftSize);

      const checkLoop = () => {
        if (!sessionRef.current) return;

        const energy = calculateAudioEnergy(session.analyser, dataArray);
        setCurrentEnergy(energy);

        const now = performance.now();
        if (energy >= config.energyThreshold) {
          if (sustainedStartRef.current === null) {
            sustainedStartRef.current = now;
          }
          const elapsed = now - sustainedStartRef.current;
          const progress = Math.min(1, elapsed / config.requiredDurationMs);
          setSustainedProgress(progress);

          if (elapsed >= config.requiredDurationMs) {
            // Sustained blow detected!
            setStatus('detected');
            stopListening();
            onBlowDetectedRef.current();
            return;
          }
        } else {
          // Reset progress if energy drops significantly
          sustainedStartRef.current = null;
          setSustainedProgress(0);
        }

        animFrameRef.current = requestAnimationFrame(checkLoop);
      };

      animFrameRef.current = requestAnimationFrame(checkLoop);
    } catch (err: unknown) {
      console.warn('Microphone access issue:', err);
      const error = err as { name?: string; message?: string };
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setStatus('denied');
        setErrorMessage('Microphone permission was denied. Tap the candle button to blow manually.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setStatus('error');
        setErrorMessage('No microphone detected on your device.');
      } else if (error.name === 'NotReadableError') {
        setStatus('error');
        setErrorMessage('Microphone is in use by another application.');
      } else {
        setStatus('error');
        setErrorMessage(error.message || 'Unable to access microphone.');
      }
    }
  }, [config.energyThreshold, config.requiredDurationMs, stopListening]);

  // Clean up session on unmount or when disabled
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  useEffect(() => {
    if (!enabled && status === 'listening') {
      stopListening();
      setStatus('idle');
    }
  }, [enabled, status, stopListening]);

  return {
    status,
    currentEnergy,
    sustainedProgress,
    errorMessage,
    startListening,
    stopListening,
  };
}
