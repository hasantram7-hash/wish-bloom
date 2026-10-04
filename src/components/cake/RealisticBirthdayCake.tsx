import React, { useState, useEffect } from 'react';
import { RealisticCakeConfig, CakeCutState } from '../../types/cake';
import { CakeTopper } from './CakeTopper';
import { CakeDecorations } from './CakeDecorations';

interface RealisticBirthdayCakeProps {
  config: RealisticCakeConfig;
  candlesLit?: boolean;
  isCut?: boolean;
  interactive?: boolean;
  onCandleTap?: () => void;
  className?: string;
}

export const RealisticBirthdayCake: React.FC<RealisticBirthdayCakeProps> = ({
  config,
  candlesLit = true,
  isCut = false,
  interactive = false,
  onCandleTap,
  className = '',
}) => {
  const [extinguishedCandles, setExtinguishedCandles] = useState<number[]>([]);
  const candleCount = config.candleCount || 3;

  // Staggered candle extinction animation when candlesLit turns false
  useEffect(() => {
    if (!candlesLit) {
      const timers: NodeJS.Timeout[] = [];
      for (let i = 0; i < candleCount; i++) {
        const timer = setTimeout(() => {
          setExtinguishedCandles((prev) => [...prev, i]);
        }, i * 110);
        timers.push(timer);
      }
      return () => timers.forEach(clearTimeout);
    } else {
      setExtinguishedCandles([]);
    }
  }, [candlesLit, candleCount]);

  const {
    shape = 'round',
    frostingColor = '#FAF5EE',
    baseColor = '#E6D3B3',
    icingStyle = 'textured_floral',
    plateStyle = 'gold_metallic',
    decorations = ['edible_flowers', 'gold_leaf_flakes'],
    decorationIntensity = 'balanced',
    topperText = 'Happy Birthday',
    topperFont,
    topperMaterial = 'gold_acrylic',
    topperPosition = 'center_top',
    age,
    candleColor = '#F59E0B',
  } = config;

  // Plate style fills & metallic rim gradients
  const getPlateFill = () => {
    switch (plateStyle) {
      case 'gold_metallic':
        return 'url(#goldPlateLuxury)';
      case 'black_marble':
        return 'url(#blackMarbleGrad)';
      case 'pastel_ceramic':
        return '#FDF2F8';
      case 'white_porcelain':
      default:
        return 'url(#porcelainWhiteGrad)';
    }
  };

  const getPlateStroke = () => {
    switch (plateStyle) {
      case 'gold_metallic':
        return '#D97706';
      case 'black_marble':
        return '#334155';
      case 'pastel_ceramic':
        return '#F472B6';
      case 'white_porcelain':
      default:
        return '#E2E8F0';
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Cake Topper (Center or Floating) */}
      <CakeTopper
        text={topperText}
        material={topperMaterial}
        position={topperPosition}
        font={topperFont}
      />

      {/* SVG Canvas for Photorealistic Layered Bakery Cake */}
      <svg
        viewBox="0 0 360 330"
        className="w-full max-w-[340px] sm:max-w-[370px] drop-shadow-2xl overflow-visible transition-transform duration-500"
        role="img"
        aria-label={`Realistic birthday cake: ${topperText}`}
        style={{
          transform: 'perspective(600px) rotateX(2deg)',
        }}
      >
        <defs>
          {/* Studio Ambient Shadow Filter */}
          <filter id="cakeStudioShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="0" dy="16" result="offsetblur" />
            <feFlood floodColor="#000000" floodOpacity="0.65" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Candle Flame Glow Filter */}
          <filter id="flameBloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0.8 0 0 0  0 0 0.3 0 0  0 0 0 2 0" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Luxury Metallic Gold Plate Gradient */}
          <linearGradient id="goldPlateLuxury" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="75%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Black Marble Plate Gradient */}
          <linearGradient id="blackMarbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#262626" />
            <stop offset="45%" stopColor="#0F172A" />
            <stop offset="70%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Porcelain White Gradient */}
          <linearGradient id="porcelainWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Sponge Cake Texture Pattern */}
          <pattern id="spongeTexture" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill={baseColor} />
            <circle cx="2" cy="2" r="0.75" fill="#000000" opacity="0.12" />
            <circle cx="5" cy="5" r="0.7" fill="#FFFFFF" opacity="0.1" />
          </pattern>

          {/* Realistic Frosting Depth Gradient */}
          <linearGradient id="frostingCylinder" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={frostingColor} stopOpacity="0.82" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="70%" stopColor={frostingColor} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>

          {/* High-Gloss Drip Gradient */}
          <linearGradient id="glossGanache" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="35%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#27140B" />
          </linearGradient>
        </defs>

        {/* 1. GROUND REFLECTION & SOFT FLOOR SHADOW */}
        <g id="ground-shadow">
          <ellipse cx="180" cy="285" rx="155" ry="22" fill="#000000" opacity="0.55" filter="url(#cakeStudioShadow)" />
          <ellipse cx="180" cy="282" rx="130" ry="16" fill="#000000" opacity="0.7" />
        </g>

        {/* 2. REALISTIC CAKE STAND / PLATE */}
        <g id="plate-assembly">
          {/* Plate Rim */}
          <ellipse
            cx="180"
            cy="276"
            rx="155"
            ry="24"
            fill={getPlateFill()}
            stroke={getPlateStroke()}
            strokeWidth="3.5"
          />
          {/* Specular Glaze Highlight along the plate bevel */}
          <path
            d="M 50 274 Q 180 292 310 274"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            fill="none"
          />
          {/* Inner Base Inset */}
          <ellipse cx="180" cy="273" rx="135" ry="19" fill="none" stroke={getPlateStroke()} strokeWidth="1" opacity="0.4" />
        </g>

        {/* 3. MAIN CAKE BODY */}
        <g id="cake-main" filter="url(#cakeStudioShadow)">
          {/* A. If shape is Two-Tier */}
          {shape === 'two_tier' ? (
            <g id="tier-assembly">
              {/* Bottom Tier Sponge */}
              <path d="M 65 210 L 65 260 C 65 285 295 285 295 260 L 295 210 Z" fill="url(#spongeTexture)" />
              {/* Bottom Tier Frosting Overlay */}
              <path d="M 65 210 L 65 260 C 65 285 295 285 295 260 L 295 210 Z" fill={frostingColor} opacity="0.9" />
              <ellipse cx="180" cy="210" rx="115" ry="24" fill={frostingColor} />

              {/* Top Tier Sponge & Frosting */}
              <path d="M 105 145 L 105 195 C 105 215 255 215 255 195 L 255 145 Z" fill={frostingColor} />
              <ellipse cx="180" cy="145" rx="75" ry="18" fill={frostingColor} />

              {/* Glossy Chocolate Drip */}
              {icingStyle === 'drip_icing' && (
                <path
                  d="M 105 145 C 114 165 120 152 130 172 C 140 155 152 176 165 154 C 178 178 190 152 205 174 C 218 155 230 170 242 153 C 248 162 252 152 255 145"
                  fill="none"
                  stroke="#381E11"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              )}
            </g>
          ) : shape === 'heart' ? (
            /* Heart Shape Cake */
            <g id="heart-assembly">
              <path
                d="M 95 180 L 95 240 C 95 272 180 292 180 292 C 180 292 265 272 265 240 L 265 180 Z"
                fill="url(#spongeTexture)"
              />
              <path
                d="M 95 180 L 95 240 C 95 272 180 292 180 292 C 180 292 265 272 265 240 L 265 180 Z"
                fill={frostingColor}
                opacity="0.9"
              />
              <path
                d="M 180 175 C 152 140 85 150 95 180 C 105 210 180 240 180 240 C 180 240 255 210 265 180 C 275 150 208 140 180 175 Z"
                fill={frostingColor}
              />
            </g>
          ) : (
            /* Round Master Cake (Supports Slice Separation) */
            <g id="round-assembly">
              {/* Main Base Cylinder */}
              <path
                d="M 80 175 L 80 245 C 80 278 280 278 280 245 L 280 175 Z"
                fill="url(#spongeTexture)"
              />
              {/* Frosting Covering */}
              <path
                d="M 80 175 L 80 245 C 80 278 280 278 280 245 L 280 175 Z"
                fill={frostingColor}
                opacity="0.95"
              />

              {/* Frosting Shading Mask for 3D Volume */}
              <path
                d="M 80 175 L 80 245 C 80 278 280 278 280 245 L 280 175 Z"
                fill="url(#frostingCylinder)"
              />

              {/* Top Surface Cream */}
              <ellipse cx="180" cy="175" rx="100" ry="24" fill={frostingColor} />
              {/* Top Surface Center Glaze Specular Highlight */}
              <ellipse cx="165" cy="170" rx="60" ry="12" fill="#FFFFFF" opacity="0.22" />

              {/* Glossy Ganache Drip for Chocolate Drip Cake */}
              {icingStyle === 'drip_icing' && (
                <path
                  d="M 80 175 C 90 205 102 184 116 215 C 130 188 144 216 158 186 C 172 220 188 184 204 218 C 220 186 235 212 250 186 C 265 215 272 188 280 175"
                  fill="none"
                  stroke="#381E11"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              )}

              {/* Sliced Wedge Separation Visual if isCut == true */}
              {isCut && (
                <g id="cut-slice-reveal" transform="translate(18, 12)">
                  {/* Exposed Sponge Interior Layer */}
                  <path d="M 180 175 L 235 200 L 235 255 L 180 230 Z" fill="#92400E" stroke="#78350F" strokeWidth="1" />
                  {/* Jam / Cream Layer in Cut */}
                  <line x1="180" y1="202" x2="235" y2="227" stroke="#FDE047" strokeWidth="3.5" />
                  <line x1="180" y1="216" x2="235" y2="241" stroke="#F472B6" strokeWidth="2.5" />

                  {/* Falling Crumbs */}
                  <circle cx="242" cy="265" r="1.5" fill="#78350F" />
                  <circle cx="248" cy="268" r="1.2" fill="#92400E" />
                  <circle cx="238" cy="272" r="1.6" fill="#FBBF24" />
                </g>
              )}
            </g>
          )}
        </g>

        {/* 4. REALISTIC EDIBLE DECORATIONS */}
        <CakeDecorations
          decorations={decorations}
          intensity={decorationIntensity}
        />

        {/* 5. REALISTIC WAX CANDLES WITH WARM FLICKERING FLAMES */}
        <g
          id="realistic-candles-layer"
          className={interactive ? 'cursor-pointer' : ''}
          onClick={interactive ? onCandleTap : undefined}
        >
          {age ? (
            /* Realistic Numbered Wax Candle */
            <g id="number-wax-candle">
              {/* Wax Body */}
              <rect
                x="166"
                y="125"
                width="28"
                height="38"
                rx="5"
                fill={candleColor}
                stroke="#FFFFFF"
                strokeWidth="1.8"
                filter="url(#cakeStudioShadow)"
              />
              <text
                x="180"
                y="151"
                textAnchor="middle"
                fontSize="20"
                fontWeight="900"
                fill="#FFFFFF"
                fontFamily="sans-serif"
              >
                {age}
              </text>
              {/* Cotton Wick */}
              <line x1="180" y1="125" x2="180" y2="116" stroke="#27272A" strokeWidth="2" strokeLinecap="round" />

              {/* Flame or Rising Smoke */}
              {!extinguishedCandles.includes(0) ? (
                <g className="animate-pulse origin-bottom" filter="url(#flameBloom)">
                  {/* Warm Outer Aura */}
                  <circle cx="180" cy="104" r="16" fill="#F59E0B" opacity="0.4" />
                  {/* Outer Flame */}
                  <path
                    d="M 180 92 C 188 104 186 114 180 114 C 174 114 172 104 180 92 Z"
                    fill="#F97316"
                  />
                  {/* Inner Pure Core */}
                  <path
                    d="M 180 98 C 184 106 183 114 180 114 C 177 114 176 106 180 98 Z"
                    fill="#FEF08A"
                  />
                </g>
              ) : (
                /* Delicate Smoke Wisps Rising */
                <g className="transition-opacity duration-1000 ease-out">
                  <path
                    d="M 180 114 Q 174 100 183 85 T 178 68"
                    stroke="#94A3B8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.75"
                    className="animate-pulse"
                  />
                </g>
              )}
            </g>
          ) : (
            /* Multi-Candle Array */
            <g id="multi-candles">
              {Array.from({ length: Math.min(candleCount, 5) }).map((_, idx) => {
                const total = Math.min(candleCount, 5);
                const step = 90 / (total + 1);
                const cx = 135 + (idx + 1) * step;
                const cy = 136 + Math.abs(idx - (total - 1) / 2) * 3;
                const isExtinguished = extinguishedCandles.includes(idx);

                return (
                  <g key={idx}>
                    {/* Wax Pillar */}
                    <rect x={cx - 3.5} y={cy} width="7" height="32" rx="3" fill={candleColor} />
                    {/* Candle Wick */}
                    <line x1={cx} y1={cy} x2={cx} y2={cy - 7} stroke="#27272A" strokeWidth="1.8" strokeLinecap="round" />

                    {/* Flame vs Smoke */}
                    {!isExtinguished ? (
                      <g className="animate-pulse origin-bottom" filter="url(#flameBloom)">
                        <circle cx={cx} cy={cy - 16} r="13" fill="#F59E0B" opacity="0.35" />
                        <path
                          d={`M ${cx} ${cy - 24} C ${cx + 6} ${cy - 14} ${cx + 5} ${cy - 7} ${cx} ${cy - 7} C ${cx - 5} ${cy - 7} ${cx - 6} ${cy - 14} ${cx} ${cy - 24} Z`}
                          fill="#F97316"
                        />
                        <path
                          d={`M ${cx} ${cy - 19} C ${cx + 3.2} ${cy - 12} ${cx + 2.8} ${cy - 7} ${cx} ${cy - 7} C ${cx - 2.8} ${cy - 7} ${cx - 3.2} ${cy - 12} ${cx} ${cy - 19} Z`}
                          fill="#FEF08A"
                        />
                      </g>
                    ) : (
                      <g className="transition-opacity duration-1000 ease-out">
                        <path
                          d={`M ${cx} ${cy - 7} Q ${cx - 4} ${cy - 20} ${cx + 3} ${cy - 34} T ${cx - 2} ${cy - 48}`}
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
              })}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
