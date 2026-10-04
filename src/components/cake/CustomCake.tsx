import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CakeConfig, CakeDecoration } from '../../types/birthday';

interface CustomCakeProps {
  config: CakeConfig;
  interactive?: boolean;
  onBlowCandles?: () => void;
  className?: string;
  themePrimaryColor?: string;
}

export const CustomCake: React.FC<CustomCakeProps> = ({
  config,
  interactive = false,
  onBlowCandles,
  className = '',
  themePrimaryColor,
}) => {
  const [candlesBlown, setCandlesBlown] = useState(!config.candlesLit);
  const [showWishMessage, setShowWishMessage] = useState(false);

  const handleCandleClick = () => {
    if (!interactive || candlesBlown) return;
    setCandlesBlown(true);
    setShowWishMessage(true);

    // Controlled confetti burst
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6', '#F43F5E'],
    });

    if (onBlowCandles) {
      onBlowCandles();
    }
  };

  const {
    shape = 'round',
    frostingColor = '#F472B6',
    baseColor = '#78350F',
    icingStyle = 'drip',
    topperText = 'Happy Birthday!',
    age,
    candleColor = '#F59E0B',
    decorations = ['sprinkles', 'cherries'],
    plateStyle = 'white_ceramic',
  } = config;

  // Flavor fallback hues
  const activeFrosting = frostingColor || themePrimaryColor || '#F472B6';
  const activeBase = baseColor || '#92400E';

  // Plate style gradients
  const getPlateFill = () => {
    switch (plateStyle) {
      case 'gold_plate':
        return 'url(#goldPlateGrad)';
      case 'pastel_plate':
        return '#FDF2F8';
      case 'neon_plate':
        return '#0F172A';
      case 'white_ceramic':
      default:
        return '#FFFFFF';
    }
  };

  const getPlateStroke = () => {
    switch (plateStyle) {
      case 'gold_plate':
        return '#B45309';
      case 'pastel_plate':
        return '#F472B6';
      case 'neon_plate':
        return '#06B6D4';
      case 'white_ceramic':
      default:
        return '#E2E8F0';
    }
  };

  const renderDecorations = (x: number, y: number, width: number) => {
    return (
      <g className="cake-decorations">
        {decorations.includes('sprinkles') && (
          <g opacity="0.9">
            <circle cx={x + width * 0.2} cy={y + 12} r="2.5" fill="#EF4444" />
            <circle cx={x + width * 0.35} cy={y + 18} r="2.5" fill="#10B981" />
            <circle cx={x + width * 0.5} cy={y + 14} r="2.5" fill="#3B82F6" />
            <circle cx={x + width * 0.65} cy={y + 20} r="2.5" fill="#F59E0B" />
            <circle cx={x + width * 0.8} cy={y + 13} r="2.5" fill="#8B5CF6" />
            <circle cx={x + width * 0.28} cy={y + 30} r="2.2" fill="#EC4899" />
            <circle cx={x + width * 0.55} cy={y + 32} r="2.2" fill="#06B6D4" />
            <circle cx={x + width * 0.72} cy={y + 28} r="2.2" fill="#FBBF24" />
          </g>
        )}
        {decorations.includes('cherries') && (
          <g>
            <circle cx={x + width * 0.25} cy={y + 6} r="7" fill="#DC2626" />
            <path d={`M ${x + width * 0.25} ${y + 6} Q ${x + width * 0.25 + 6} ${y - 8} ${x + width * 0.25 + 10} ${y - 4}`} stroke="#451A03" strokeWidth="1.8" fill="none" />
            <circle cx={x + width * 0.5} cy={y + 4} r="7.5" fill="#B91C1C" />
            <path d={`M ${x + width * 0.5} ${y + 4} Q ${x + width * 0.5 + 6} ${y - 10} ${x + width * 0.5 + 10} ${y - 6}`} stroke="#451A03" strokeWidth="1.8" fill="none" />
            <circle cx={x + width * 0.75} cy={y + 6} r="7" fill="#DC2626" />
            <path d={`M ${x + width * 0.75} ${y + 6} Q ${x + width * 0.75 + 6} ${y - 8} ${x + width * 0.75 + 10} ${y - 4}`} stroke="#451A03" strokeWidth="1.8" fill="none" />
          </g>
        )}
        {decorations.includes('flowers') && (
          <g>
            <path d={`M ${x + width * 0.2} ${y + 8} l 3 -3 l 3 3 l -3 3 z`} fill="#F472B6" />
            <circle cx={x + width * 0.2 + 3} cy={y + 8} r="2" fill="#FEF08A" />
            <path d={`M ${x + width * 0.5} ${y + 6} l 4 -4 l 4 4 l -4 4 z`} fill="#FB7185" />
            <circle cx={x + width * 0.5 + 4} cy={y + 6} r="2.2" fill="#FEF08A" />
            <path d={`M ${x + width * 0.8} ${y + 8} l 3 -3 l 3 3 l -3 3 z`} fill="#F472B6" />
            <circle cx={x + width * 0.8 + 3} cy={y + 8} r="2" fill="#FEF08A" />
          </g>
        )}
        {decorations.includes('stars') && (
          <g fill="#FBBF24">
            <polygon points={`${x + width * 0.3},${y + 10} ${x + width * 0.3 + 2.5},${y + 15} ${x + width * 0.3 + 8},${y + 15} ${x + width * 0.3 + 3.5},${y + 18.5} ${x + width * 0.3 + 5},${y + 24} ${x + width * 0.3},${y + 20.5} ${x + width * 0.3 - 5},${y + 24} ${x + width * 0.3 - 3.5},${y + 18.5} ${x + width * 0.3 - 8},${y + 15} ${x + width * 0.3 - 2.5},${y + 15}`} transform="scale(0.7) translate(30, 0)" />
            <polygon points={`${x + width * 0.7},${y + 10} ${x + width * 0.7 + 2.5},${y + 15} ${x + width * 0.7 + 8},${y + 15} ${x + width * 0.7 + 3.5},${y + 18.5} ${x + width * 0.7 + 5},${y + 24} ${x + width * 0.7},${y + 20.5} ${x + width * 0.7 - 5},${y + 24} ${x + width * 0.7 - 3.5},${y + 18.5} ${x + width * 0.7 - 8},${y + 15} ${x + width * 0.7 - 2.5},${y + 15}`} transform="scale(0.7) translate(70, 0)" />
          </g>
        )}
        {decorations.includes('gold_flakes') && (
          <g fill="#F59E0B" opacity="0.85">
            <rect x={x + width * 0.32} y={y + 16} width="4" height="4" transform="rotate(45)" />
            <rect x={x + width * 0.48} y={y + 22} width="5" height="5" transform="rotate(25)" />
            <rect x={x + width * 0.68} y={y + 15} width="4" height="4" transform="rotate(60)" />
          </g>
        )}
        {decorations.includes('chocolates') && (
          <g fill="#451A03" rx="1">
            <rect x={x + width * 0.22} y={y + 5} width="12" height="12" rx="2" transform="rotate(-15)" />
            <rect x={x + width * 0.72} y={y + 5} width="12" height="12" rx="2" transform="rotate(15)" />
          </g>
        )}
      </g>
    );
  };

  // Render Candles
  const renderCandleFlame = (cx: number, cy: number, candleId: string) => {
    return (
      <g key={candleId} className="candle-flame-group">
        {!candlesBlown ? (
          <g className="animate-pulse origin-bottom">
            {/* Outer Glow */}
            <circle cx={cx} cy={cy - 12} r="14" fill="#F59E0B" opacity="0.35" filter="url(#candleGlow)" />
            {/* Flame Outer */}
            <path
              d={`M ${cx} ${cy - 22} C ${cx + 7} ${cy - 12} ${cx + 6} ${cy - 4} ${cx} ${cy - 4} C ${cx - 6} ${cy - 4} ${cx - 7} ${cy - 12} ${cx} ${cy - 22} Z`}
              fill="#F97316"
            />
            {/* Flame Inner Core */}
            <path
              d={`M ${cx} ${cy - 18} C ${cx + 3.5} ${cy - 10} ${cx + 3} ${cy - 4} ${cx} ${cy - 4} C ${cx - 3} ${cy - 4} ${cx - 3.5} ${cy - 10} ${cx} ${cy - 18} Z`}
              fill="#FEF08A"
            />
          </g>
        ) : (
          /* Subtle Smoke animation */
          <g className="transition-opacity duration-1000 ease-out">
            <path
              d={`M ${cx} ${cy - 6} Q ${cx - 4} ${cy - 16} ${cx + 2} ${cy - 26} T ${cx - 3} ${cy - 38}`}
              stroke="#94A3B8"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
              className="animate-pulse"
            />
          </g>
        )}
      </g>
    );
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* SVG Canvas for Layered Cake */}
      <svg
        viewBox="0 0 340 320"
        className="w-full max-w-[320px] sm:max-w-[340px] drop-shadow-xl overflow-visible transition-transform duration-300"
        role="img"
        aria-label={`Birthday cake with ${topperText}`}
      >
        <defs>
          <filter id="candleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
          </filter>
          <linearGradient id="goldPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="cakeBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={activeBase} />
            <stop offset="100%" stopColor={activeBase} stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="frostingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={activeFrosting} />
            <stop offset="100%" stopColor={activeFrosting} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* PLATE */}
        <g id="plate">
          <ellipse
            cx="170"
            cy="275"
            rx="145"
            ry="24"
            fill={getPlateFill()}
            stroke={getPlateStroke()}
            strokeWidth="3.5"
          />
          <ellipse
            cx="170"
            cy="272"
            rx="125"
            ry="18"
            fill="none"
            stroke={getPlateStroke()}
            strokeWidth="1.2"
            opacity="0.5"
          />
        </g>

        {/* CAKE BODY BASED ON SHAPE */}
        {shape === 'tiered' ? (
          <g id="tiered-cake">
            {/* Bottom Tier */}
            <path
              d="M 55 210 L 55 260 C 55 280 285 280 285 260 L 285 210 Z"
              fill="url(#cakeBaseGrad)"
            />
            <ellipse cx="170" cy="210" rx="115" ry="24" fill={activeFrosting} />
            {renderDecorations(55, 210, 230)}

            {/* Top Tier */}
            <path
              d="M 90 145 L 90 195 C 90 215 250 215 250 195 L 250 145 Z"
              fill="url(#cakeBaseGrad)"
            />
            <ellipse cx="170" cy="145" rx="80" ry="18" fill={activeFrosting} />

            {/* Drip on top tier */}
            {icingStyle === 'drip' && (
              <path
                d="M 90 145 C 98 165 106 150 115 168 C 125 152 135 170 148 152 C 160 172 172 150 185 168 C 198 152 210 166 220 152 C 232 165 242 152 250 145"
                fill="none"
                stroke={activeFrosting}
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}
            {renderDecorations(90, 145, 160)}
          </g>
        ) : shape === 'square' ? (
          <g id="square-cake">
            <rect x="75" y="170" width="190" height="95" rx="8" fill="url(#cakeBaseGrad)" />
            {/* Top surface */}
            <path d="M 75 170 L 105 145 L 235 145 L 265 170 Z" fill={activeFrosting} />
            <rect x="75" y="170" width="190" height="22" rx="4" fill={activeFrosting} />
            {renderDecorations(75, 170, 190)}
          </g>
        ) : shape === 'heart' ? (
          <g id="heart-cake">
            <path
              d="M 85 185 L 85 245 C 85 275 170 295 170 295 C 170 295 255 275 255 245 L 255 185 Z"
              fill="url(#cakeBaseGrad)"
            />
            {/* Heart top */}
            <path
              d="M 170 180 C 145 145 75 155 85 185 C 95 215 170 245 170 245 C 170 245 245 215 255 185 C 265 155 195 145 170 180 Z"
              fill={activeFrosting}
            />
            {renderDecorations(95, 170, 150)}
          </g>
        ) : shape === 'cupcake_tower' ? (
          <g id="cupcake-tower">
            {/* Tier 1 Cupcakes */}
            <ellipse cx="110" cy="245" rx="25" ry="12" fill={activeBase} />
            <path d="M 95 245 Q 110 220 125 245 Z" fill={activeFrosting} />
            <ellipse cx="170" cy="245" rx="25" ry="12" fill={activeBase} />
            <path d="M 155 245 Q 170 220 185 245 Z" fill={activeFrosting} />
            <ellipse cx="230" cy="245" rx="25" ry="12" fill={activeBase} />
            <path d="M 215 245 Q 230 220 245 245 Z" fill={activeFrosting} />

            {/* Stand */}
            <ellipse cx="170" cy="210" rx="75" ry="14" fill={getPlateFill()} stroke={getPlateStroke()} strokeWidth="2" />

            {/* Top Cupcake */}
            <ellipse cx="170" cy="180" rx="35" ry="16" fill={activeBase} />
            <path d="M 145 180 Q 170 145 195 180 Z" fill={activeFrosting} />
          </g>
        ) : (
          /* Default Round Cake */
          <g id="round-cake">
            <path
              d="M 70 180 L 70 245 C 70 275 270 275 270 245 L 270 180 Z"
              fill="url(#cakeBaseGrad)"
            />
            <ellipse cx="170" cy="180" rx="100" ry="24" fill={activeFrosting} />

            {/* Drip or Swirl Details */}
            {icingStyle === 'drip' && (
              <path
                d="M 70 180 C 80 205 92 186 105 210 C 118 188 132 212 145 188 C 158 215 172 185 188 212 C 202 186 216 208 230 188 C 245 210 258 188 270 180"
                fill="none"
                stroke={activeFrosting}
                strokeWidth="7"
                strokeLinecap="round"
              />
            )}
            {renderDecorations(70, 180, 200)}
          </g>
        )}

        {/* TOPPER TEXT */}
        {topperText && (
          <g id="cake-topper">
            {/* Sticks */}
            <line x1="125" y1={shape === 'tiered' ? 120 : 150} x2="125" y2={shape === 'tiered' ? 85 : 110} stroke="#CBD5E1" strokeWidth="2.5" />
            <line x1="215" y1={shape === 'tiered' ? 120 : 150} x2="215" y2={shape === 'tiered' ? 85 : 110} stroke="#CBD5E1" strokeWidth="2.5" />
            {/* Banner */}
            <rect
              x="95"
              y={shape === 'tiered' ? 70 : 92}
              width="150"
              height="26"
              rx="13"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="2"
              filter="url(#candleGlow)"
            />
            <text
              x="170"
              y={shape === 'tiered' ? 87 : 109}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill="#1E293B"
              className="font-caveat tracking-wide"
            >
              {topperText.slice(0, 24)}
            </text>
          </g>
        )}

        {/* CANDLES */}
        <g
          id="candles-group"
          className={interactive && !candlesBlown ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
          onClick={handleCandleClick}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={(e) => {
            if (interactive && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleCandleClick();
            }
          }}
          aria-label={interactive ? 'Click to blow out candles and make a wish' : undefined}
        >
          {age ? (
            /* Number Candle */
            <g id="number-candle">
              <rect
                x="158"
                y={shape === 'tiered' ? 100 : 130}
                width="24"
                height="34"
                rx="4"
                fill={candleColor}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <text
                x="170"
                y={shape === 'tiered' ? 124 : 154}
                textAnchor="middle"
                fontSize="18"
                fontWeight="900"
                fill="#FFFFFF"
                fontFamily="sans-serif"
              >
                {age}
              </text>
              {/* Flame */}
              {renderCandleFlame(170, shape === 'tiered' ? 100 : 130, 'flame-age')}
            </g>
          ) : (
            /* 3 Standard Candles */
            <g id="trio-candles">
              {/* Left Candle */}
              <rect x="135" y={shape === 'tiered' ? 105 : 138} width="6" height="26" rx="3" fill={candleColor} />
              <line x1="138" y1={shape === 'tiered' ? 105 : 138} x2="138" y2={shape === 'tiered' ? 98 : 131} stroke="#1E293B" strokeWidth="1.5" />
              {renderCandleFlame(138, shape === 'tiered' ? 105 : 138, 'flame-1')}

              {/* Center Candle */}
              <rect x="167" y={shape === 'tiered' ? 98 : 130} width="6" height="32" rx="3" fill={candleColor} />
              <line x1="170" y1={shape === 'tiered' ? 98 : 130} x2="170" y2={shape === 'tiered' ? 90 : 122} stroke="#1E293B" strokeWidth="1.5" />
              {renderCandleFlame(170, shape === 'tiered' ? 98 : 130, 'flame-2')}

              {/* Right Candle */}
              <rect x="199" y={shape === 'tiered' ? 105 : 138} width="6" height="26" rx="3" fill={candleColor} />
              <line x1="202" y1={shape === 'tiered' ? 105 : 138} x2="202" y2={shape === 'tiered' ? 98 : 131} stroke="#1E293B" strokeWidth="1.5" />
              {renderCandleFlame(202, shape === 'tiered' ? 105 : 138, 'flame-3')}
            </g>
          )}
        </g>
      </svg>

      {/* Recipient Interactive Wish Action Prompt & Confirmation */}
      {interactive && (
        <div className="mt-3 text-center">
          {!candlesBlown ? (
            <button
              type="button"
              onClick={handleCandleClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg hover:shadow-amber-500/25 active:scale-95 transition cursor-pointer"
            >
              <span>🎂</span> Tap to Blow Out the Candles! 💨
            </button>
          ) : (
            showWishMessage && (
              <div className="animate-fade-in p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm font-medium shadow-md">
                ✨ Your wish has been sent to the stars! ✨
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
