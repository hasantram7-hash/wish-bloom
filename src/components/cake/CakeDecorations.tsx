import React from 'react';
import { CakeDecorationItem, DecorationIntensity } from '../../types/cake';

interface CakeDecorationsProps {
  decorations: CakeDecorationItem[];
  intensity?: DecorationIntensity;
  cakeWidth?: number;
  cakeHeight?: number;
}

export const CakeDecorations: React.FC<CakeDecorationsProps> = ({
  decorations,
  intensity = 'balanced',
  cakeWidth = 320,
  cakeHeight = 280,
}) => {
  if (!decorations || decorations.length === 0) return null;

  const countMultiplier = intensity === 'minimal' ? 0.6 : intensity === 'rich' ? 1.4 : 1.0;

  return (
    <g className="cake-realistic-decorations pointer-events-none select-none">
      <defs>
        {/* Specular filter for cherries and berries */}
        <radialGradient id="cherrySpecular" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="25%" stopColor="#EF4444" />
          <stop offset="70%" stopColor="#991B1B" />
          <stop offset="100%" stopColor="#450A0A" />
        </radialGradient>

        <radialGradient id="berrySpecular" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.7" />
          <stop offset="35%" stopColor="#7C3AED" />
          <stop offset="80%" stopColor="#4C1D95" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </radialGradient>

        <linearGradient id="goldLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="chocoShardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5E3023" />
          <stop offset="50%" stopColor="#351B12" />
          <stop offset="100%" stopColor="#1F0F0A" />
        </linearGradient>

        {/* Macaron Gradient */}
        <radialGradient id="macaronShell" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FCE7F3" />
          <stop offset="70%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </radialGradient>
      </defs>

      {/* 1. METALLIC SPRINKLES */}
      {decorations.includes('metallic_sprinkles') && (
        <g opacity="0.95" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.4))">
          <ellipse cx="110" cy="172" rx="4" ry="1.8" fill="#F59E0B" transform="rotate(25 110 172)" />
          <ellipse cx="140" cy="180" rx="3.5" ry="1.6" fill="#10B981" transform="rotate(-35 140 180)" />
          <ellipse cx="165" cy="174" rx="4" ry="1.8" fill="#EC4899" transform="rotate(15 165 174)" />
          <ellipse cx="195" cy="182" rx="4" ry="1.8" fill="#3B82F6" transform="rotate(45 195 182)" />
          <ellipse cx="225" cy="175" rx="3.5" ry="1.6" fill="#FBBF24" transform="rotate(-20 225 175)" />

          {intensity !== 'minimal' && (
            <>
              <ellipse cx="125" cy="192" rx="4" ry="1.8" fill="#8B5CF6" transform="rotate(60 125 192)" />
              <ellipse cx="150" cy="198" rx="3.5" ry="1.6" fill="#F59E0B" transform="rotate(-15 150 198)" />
              <ellipse cx="180" cy="194" rx="4" ry="1.8" fill="#EF4444" transform="rotate(30 180 194)" />
              <ellipse cx="210" cy="190" rx="3.5" ry="1.6" fill="#06B6D4" transform="rotate(-50 210 190)" />
            </>
          )}
        </g>
      )}

      {/* 2. GLOSSY CHERRIES */}
      {decorations.includes('cherries') && (
        <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))">
          {/* Left Cherry */}
          <circle cx="120" cy="155" r="9.5" fill="url(#cherrySpecular)" />
          <path d="M 120 148 Q 128 132 135 136" stroke="#372016" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Center Cherry */}
          <circle cx="170" cy="150" r="10.5" fill="url(#cherrySpecular)" />
          <path d="M 170 142 Q 178 125 186 130" stroke="#372016" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Right Cherry */}
          <circle cx="220" cy="156" r="9.5" fill="url(#cherrySpecular)" />
          <path d="M 220 149 Q 228 133 234 138" stroke="#372016" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* 3. FRESH WILD BERRIES */}
      {decorations.includes('fresh_berries') && (
        <g filter="drop-shadow(0 3px 4px rgba(0,0,0,0.4))">
          <circle cx="132" cy="162" r="7.5" fill="url(#berrySpecular)" />
          <circle cx="145" cy="167" r="6.5" fill="url(#berrySpecular)" />
          <circle cx="195" cy="165" r="7.5" fill="url(#berrySpecular)" />
          <circle cx="208" cy="161" r="6.8" fill="url(#berrySpecular)" />
        </g>
      )}

      {/* 4. EDIBLE SUGAR FLOWERS */}
      {decorations.includes('edible_flowers') && (
        <g filter="drop-shadow(0 3px 6px rgba(0,0,0,0.3))">
          {/* Flower 1 */}
          <g transform="translate(100, 160)">
            <circle cx="0" cy="-6" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="6" cy="-2" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="4" cy="5" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="-4" cy="5" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="-6" cy="-2" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="0" cy="1" r="3.2" fill="#FDE047" />
          </g>

          {/* Flower 2 */}
          <g transform="translate(240, 162)">
            <circle cx="0" cy="-6" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="6" cy="-2" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="4" cy="5" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="-4" cy="5" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="-6" cy="-2" r="5" fill="#FCE7F3" opacity="0.9" />
            <circle cx="0" cy="1" r="3.2" fill="#FDE047" />
          </g>
        </g>
      )}

      {/* 5. 24K GOLD LEAF FLAKES */}
      {decorations.includes('gold_leaf_flakes') && (
        <g fill="url(#goldLeafGrad)" opacity="0.95" filter="drop-shadow(0 1px 2px rgba(217,119,6,0.5))">
          <polygon points="128,168 135,164 133,172 126,171" />
          <polygon points="155,160 162,158 159,166 153,164" />
          <polygon points="185,162 192,159 190,167 183,165" />
          <polygon points="212,170 219,166 216,174 210,172" />
          <polygon points="142,185 148,181 146,189 140,187" />
          <polygon points="198,184 204,180 202,188 196,186" />
        </g>
      )}

      {/* 6. CHOCOLATE SHARDS */}
      {decorations.includes('chocolate_shards') && (
        <g fill="url(#chocoShardGrad)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))">
          <polygon points="112,168 126,132 134,166" transform="rotate(-8 126 150)" />
          <polygon points="208,166 216,130 230,168" transform="rotate(10 216 150)" />
        </g>
      )}

      {/* 7. FRENCH MACARONS */}
      {decorations.includes('macarons') && (
        <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))">
          {/* Left Macaron */}
          <g transform="translate(108, 168) rotate(-15)">
            <ellipse cx="0" cy="-3" rx="10" ry="4" fill="url(#macaronShell)" />
            <rect x="-9.5" y="-2" width="19" height="3" rx="1" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="0" cy="2" rx="10" ry="4" fill="url(#macaronShell)" />
          </g>

          {/* Right Macaron */}
          <g transform="translate(232, 170) rotate(15)">
            <ellipse cx="0" cy="-3" rx="10" ry="4" fill="url(#macaronShell)" />
            <rect x="-9.5" y="-2" width="19" height="3" rx="1" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="0" cy="2" rx="10" ry="4" fill="url(#macaronShell)" />
          </g>
        </g>
      )}
    </g>
  );
};
