import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { recordReaction } from '../../services/firestoreService';

interface ReactionBarProps {
  surpriseId: string;
  reactions?: Record<string, number>;
  className?: string;
}

const EMOJIS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '🥹', label: 'Touched' },
  { emoji: '😍', label: 'Adore' },
  { emoji: '😂', label: 'Joy' },
];

export const ReactionBar: React.FC<ReactionBarProps> = ({
  surpriseId,
  reactions = {},
  className = '',
}) => {
  const [localCounts, setLocalCounts] = useState<Record<string, number>>(reactions);
  const [reactedMap, setReactedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    EMOJIS.forEach(({ emoji }) => {
      if (typeof window !== 'undefined') {
        initial[emoji] = !!localStorage.getItem(`wishverse_react_${surpriseId}_${emoji}`);
      }
    });
    return initial;
  });

  const handleReact = async (emoji: string) => {
    if (reactedMap[emoji]) return; // Already reacted

    // Optimistic update
    setReactedMap((prev) => ({ ...prev, [emoji]: true }));
    setLocalCounts((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));

    // Sparkle burst
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#EC4899', '#F59E0B', '#8B5CF6'],
    });

    try {
      await recordReaction(surpriseId, emoji);
    } catch (err) {
      console.warn('Reaction recording notice:', err);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 flex-wrap ${className}`}>
      {EMOJIS.map(({ emoji, label }) => {
        const count = localCounts[emoji] || reactions[emoji] || 0;
        const hasReacted = !!reactedMap[emoji];

        return (
          <button
            key={emoji}
            type="button"
            onClick={() => handleReact(emoji)}
            disabled={hasReacted}
            className={`group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer ${
              hasReacted
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/80 border-white/15 text-slate-300 hover:border-amber-400/50 hover:bg-slate-800'
            }`}
            title={hasReacted ? `You reacted with ${label}` : `React with ${label}`}
          >
            <span className="text-lg group-hover:scale-125 transition-transform duration-200">
              {emoji}
            </span>
            <span className="text-xs font-semibold">{count}</span>
          </button>
        );
      })}
    </div>
  );
};
