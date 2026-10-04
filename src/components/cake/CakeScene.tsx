import React, { useState } from 'react';
import { RealisticCakeConfig, MemorySliceReward } from '../../types/cake';
import { RealisticBirthdayCake } from './RealisticBirthdayCake';
import { CandleBlowInteraction } from './CandleBlowInteraction';
import { CakeCutInteraction } from './CakeCutInteraction';

interface CakeSceneProps {
  config: RealisticCakeConfig;
  recipientName: string;
  onCandlesBlown?: () => void;
  onCakeSliced?: () => void;
  reward?: MemorySliceReward;
}

export const CakeScene: React.FC<CakeSceneProps> = ({
  config,
  recipientName,
  onCandlesBlown,
  onCakeSliced,
  reward,
}) => {
  const [candlesLit, setCandlesLit] = useState(config.candlesLit);
  const [isCut, setIsCut] = useState(false);

  const handleCandlesExtinguished = () => {
    setCandlesLit(false);
    if (onCandlesBlown) onCandlesBlown();
  };

  const handleCakeCut = () => {
    setIsCut(true);
    if (onCakeSliced) onCakeSliced();
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center py-6 px-4">
      {/* Ambient Bokeh & Atmospheric Party Room Lighting */}
      <div className="absolute -top-10 left-1/4 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      {/* Greeting Header */}
      <div className="text-center space-y-1 mb-6 z-10">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-400">
          Make a wish, {recipientName}…
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-caveat text-3xl">
          Blow Out Your Birthday Candles 🎂
        </h2>
      </div>

      {/* Realistic 3D/2.5D Bakery Cake Visual */}
      <div className="relative z-10 my-2 w-full flex justify-center">
        <RealisticBirthdayCake
          config={config}
          candlesLit={candlesLit}
          isCut={isCut}
          interactive={candlesLit}
          onCandleTap={handleCandlesExtinguished}
        />
      </div>

      {/* Interactive Controls Sequence */}
      <div className="w-full mt-6 z-20 space-y-6">
        {candlesLit ? (
          <CandleBlowInteraction
            candlesLit={candlesLit}
            onCandlesExtinguished={handleCandlesExtinguished}
            candleCount={config.candleCount}
            microphoneBlowEnabled={config.microphoneBlowEnabled}
            defaultSensitivity={config.blowSensitivity}
          />
        ) : config.cakeCutEnabled ? (
          <CakeCutInteraction
            onCakeCut={handleCakeCut}
            isCut={isCut}
            reward={config.memorySliceReward || reward}
          />
        ) : null}
      </div>
    </div>
  );
};
