import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Volume2, Sparkles, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { useMicrophoneBlowDetection } from '../../hooks/useMicrophoneBlowDetection';

interface CandleBlowInteractionProps {
  candlesLit: boolean;
  onCandlesExtinguished: () => void;
  candleCount?: number;
  microphoneBlowEnabled?: boolean;
  defaultSensitivity?: 'low' | 'normal' | 'high';
}

export const CandleBlowInteraction: React.FC<CandleBlowInteractionProps> = ({
  candlesLit,
  onCandlesExtinguished,
  candleCount = 3,
  microphoneBlowEnabled = true,
  defaultSensitivity = 'normal',
}) => {
  const [sensitivity, setSensitivity] = useState<'low' | 'normal' | 'high'>(defaultSensitivity);
  const [blownState, setBlownState] = useState(!candlesLit);

  const handleSuccessBlow = () => {
    if (blownState) return;
    setBlownState(true);

    // Haptic vibration feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 100]);
      } catch (e) {
        // Ignored
      }
    }

    // Celebration Confetti burst
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.62 },
      colors: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6', '#F43F5E'],
    });

    onCandlesExtinguished();
  };

  const {
    status,
    currentEnergy,
    sustainedProgress,
    errorMessage,
    startListening,
    stopListening,
  } = useMicrophoneBlowDetection({
    onBlowDetected: handleSuccessBlow,
    sensitivity,
    enabled: candlesLit && !blownState,
  });

  if (blownState) {
    return (
      <div className="text-center py-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm font-semibold shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Your wish has been sent to the stars ✨</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Microphone Interaction Card */}
      {microphoneBlowEnabled && (
        <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl text-center space-y-4">
          {status === 'idle' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={startListening}
                className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Mic className="w-5 h-5" />
                <span>Enable Mic & Blow Candles 💨</span>
              </button>
              <p className="text-[11px] text-slate-400">
                Blow into your device's mic to extinguish the birthday candles!
              </p>
            </div>
          )}

          {status === 'requesting' && (
            <div className="flex items-center justify-center gap-2 text-xs text-amber-300 py-3">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Requesting microphone permission...</span>
            </div>
          )}

          {status === 'listening' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Listening… Blow continuously now!
                </span>
                <button
                  type="button"
                  onClick={stopListening}
                  className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Live Audio Energy Visualizer Meter */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 transition-all duration-75"
                    style={{ width: `${Math.round(currentEnergy * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Soft Breath</span>
                  <span>
                    {sustainedProgress > 0 ? `Holding: ${Math.round(sustainedProgress * 100)}%` : 'Target Sustained Blow'}
                  </span>
                  <span>Strong Blow</span>
                </div>
              </div>

              {/* Sensitivity Selector */}
              <div className="flex items-center justify-center gap-2 text-xs pt-1">
                <span className="text-slate-400 text-[11px]">Sensitivity:</span>
                {(['low', 'normal', 'high'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSensitivity(s)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition ${
                      sensitivity === s
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error / Denied notice */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-white/5">
            <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Mic is used on-device only. Audio is never recorded, uploaded, or stored.</span>
          </div>
        </div>
      )}

      {/* Accessible Manual Fallback Button (ALWAYS Available) */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleSuccessBlow}
          className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 px-5 py-2.5 rounded-full border border-white/10 transition shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
        >
          <span>🎂</span>
          <span>Can’t use mic? Tap to blow out candles</span>
        </button>
      </div>
    </div>
  );
};
