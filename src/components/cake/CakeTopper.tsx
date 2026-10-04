import React from 'react';
import { TopperMaterial, TopperPosition } from '../../types/cake';

interface CakeTopperProps {
  text: string;
  material?: TopperMaterial;
  position?: TopperPosition;
  color?: string;
  font?: string;
  cakeWidth?: number;
  cakeHeight?: number;
}

export const CakeTopper: React.FC<CakeTopperProps> = ({
  text,
  material = 'gold_acrylic',
  position = 'center_top',
  color = '#F59E0B',
  font = "'Caveat', 'Playfair Display', 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
  cakeWidth = 320,
  cakeHeight = 280,
}) => {
  if (!text || text.trim().length === 0) return null;

  const cleanText = text.trim();

  // Material-based text styling & gradients
  const getMaterialClasses = () => {
    switch (material) {
      case 'gold_acrylic':
        return 'text-amber-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)] bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent';
      case 'silver_acrylic':
        return 'text-slate-200 drop-shadow-[0_2px_8px_rgba(203,213,225,0.6)] bg-gradient-to-r from-slate-100 via-gray-300 to-slate-400 bg-clip-text text-transparent';
      case 'neon_acrylic':
        return 'text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)] bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent';
      case 'chocolate_lettering':
        return 'text-amber-950 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]';
      case 'fondant_lettering':
        return 'text-rose-200 drop-shadow-[0_2px_4px_rgba(244,63,94,0.4)]';
      case 'edible_plaque':
      default:
        return 'text-amber-950 font-serif';
    }
  };

  // Acrylic sticks for center-top or rear-floating
  if (position === 'center_top' || position === 'floating_rear') {
    return (
      <div
        className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-30 transition-transform ${
          position === 'floating_rear' ? '-top-14 opacity-95 scale-95' : '-top-10'
        }`}
      >
        {/* Topper Sign Plaque or Script Text */}
        <div
          className={`relative px-5 py-2 rounded-2xl flex items-center justify-center text-center max-w-[280px] sm:max-w-[320px] backdrop-blur-[2px] ${
            material === 'edible_plaque'
              ? 'bg-amber-100/95 border border-amber-300 shadow-md text-slate-900 rounded-lg'
              : 'border border-white/20 shadow-2xl bg-black/40'
          }`}
          style={{
            transform: 'perspective(400px) rotateX(4deg)',
          }}
        >
          {/* Subtle reflection shimmer for acrylics */}
          {(material === 'gold_acrylic' || material === 'silver_acrylic') && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 rounded-2xl pointer-events-none" />
          )}

          <span
            className={`font-bold tracking-wide leading-tight break-words text-sm sm:text-base ${getMaterialClasses()}`}
            style={{ fontFamily: font }}
          >
            {cleanText}
          </span>
        </div>

        {/* Support Sticks penetrating cake */}
        <div className="flex justify-between w-32 -mt-1 z-0">
          <div className="w-[3px] h-10 bg-gradient-to-b from-white/70 to-white/10 rounded-full shadow-sm" />
          <div className="w-[3px] h-10 bg-gradient-to-b from-white/70 to-white/10 rounded-full shadow-sm" />
        </div>
      </div>
    );
  }

  // Front Plaque Position
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
      <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-400/50 shadow-lg text-amber-950 font-bold text-xs sm:text-sm tracking-wide text-center max-w-[220px] truncate">
        {cleanText}
      </div>
    </div>
  );
};
