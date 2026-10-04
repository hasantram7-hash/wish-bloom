import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, Heart, Film, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { MemorySliceReward } from '../../types/cake';

interface CakeCutInteractionProps {
  onCakeCut: () => void;
  isCut: boolean;
  reward?: MemorySliceReward;
}

export const CakeCutInteraction: React.FC<CakeCutInteractionProps> = ({
  onCakeCut,
  isCut,
  reward,
}) => {
  const [sliceOpen, setSliceOpen] = useState(isCut);
  const [swiping, setSwiping] = useState(false);
  const [startX, setStartX] = useState(0);

  const triggerCut = () => {
    if (sliceOpen) return;
    setSliceOpen(true);

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#F59E0B', '#F472B6', '#FBBF24'],
    });

    onCakeCut();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setSwiping(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swiping) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) {
      triggerCut();
    }
    setSwiping(false);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 text-center">
      {!sliceOpen ? (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-4 select-none"
        >
          <div className="space-y-1">
            <span className="text-2xl">🔪</span>
            <h3 className="text-lg font-bold text-white">Make the First Cut ✨</h3>
            <p className="text-xs text-slate-400">
              Swipe across the cake or tap the knife button below to cut a birthday slice!
            </p>
          </div>

          {/* Swipe indicator */}
          <div className="py-2 flex items-center justify-center gap-2 text-xs text-amber-300 font-semibold animate-pulse">
            <span>← Swipe to slice →</span>
          </div>

          {/* Fallback button */}
          <button
            type="button"
            onClick={triggerCut}
            className="w-full py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 active:scale-95 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            Cut the Cake 🍰
          </button>
        </div>
      ) : (
        /* Sliced completion & Memory Slice Card */
        <div className="space-y-4 animate-scale-in">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-semibold">
            “The sweetest memories are made together.” 🍰✨
          </div>

          {/* Memory Slice Reward Card */}
          {reward && (reward.content || reward.mediaUrl) && (
            <div className="bg-gradient-to-br from-slate-900/95 via-purple-950/40 to-slate-900/95 border border-amber-400/40 rounded-3xl p-6 shadow-2xl text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Unlocked Memory Slice Reward</span>
              </div>

              {reward.content && (
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-outfit">
                  {reward.content}
                </p>
              )}

              {reward.mediaUrl && reward.type === 'photo' && (
                <img
                  src={reward.mediaUrl}
                  alt="Memory slice"
                  className="rounded-2xl max-h-56 w-full object-cover border border-white/10"
                />
              )}

              {reward.mediaUrl && reward.type === 'video' && (
                <video
                  src={reward.mediaUrl}
                  controls
                  className="rounded-2xl max-h-56 w-full object-cover border border-white/10"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
