import React from 'react';
import {
  RealisticCakeConfig,
  CakePresetStyle,
  CakeShapeType,
  CakeFlavorType,
  IcingFinishType,
  CakeBorderStyle,
  CakePlateStyleType,
  CakeDecorationItem,
  DecorationIntensity,
  TopperMaterial,
  TopperPosition,
} from '../../types/cake';
import {
  CAKE_PRESETS,
  FLAVOR_OPTIONS,
  DECORATION_OPTIONS,
  TOPPER_MATERIALS,
} from '../../config/cakeOptions';
import { RealisticBirthdayCake } from './RealisticBirthdayCake';
import { Sparkles, Mic, Cake, Gift, AlertCircle } from 'lucide-react';

interface CakeCustomizerProps {
  config: RealisticCakeConfig;
  onChange: (updated: RealisticCakeConfig) => void;
  recipientName?: string;
}

export const CakeCustomizer: React.FC<CakeCustomizerProps> = ({
  config,
  onChange,
  recipientName = 'Aarav',
}) => {
  const handlePresetSelect = (presetKey: CakePresetStyle) => {
    const preset = CAKE_PRESETS[presetKey];
    if (!preset) return;
    onChange({
      ...config,
      ...preset.defaults,
      style: presetKey,
      topperText: config.topperText || `Happy Birthday ${recipientName}`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Styles Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
              1. Choose Cake Style Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(CAKE_PRESETS) as CakePresetStyle[]).map((presetKey) => {
                const preset = CAKE_PRESETS[presetKey];
                const isSelected = config.style === presetKey;

                return (
                  <button
                    key={presetKey}
                    type="button"
                    onClick={() => handlePresetSelect(presetKey)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/30'
                        : 'bg-slate-800/80 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    <span className="text-xs font-bold truncate">{preset.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {preset.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shape, Flavor & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Shape</label>
              <select
                value={config.shape}
                onChange={(e) => onChange({ ...config, shape: e.target.value as CakeShapeType })}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="round">Round Classic</option>
                <option value="two_tier">Two-Tier Grand</option>
                <option value="heart">Romantic Heart</option>
                <option value="square">Modern Square</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Flavor</label>
              <select
                value={config.flavorLabel}
                onChange={(e) => {
                  const val = e.target.value as CakeFlavorType;
                  const opt = FLAVOR_OPTIONS.find((f) => f.id === val);
                  onChange({
                    ...config,
                    flavorLabel: val,
                    baseColor: opt ? opt.baseHex : config.baseColor,
                  });
                }}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {FLAVOR_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Plate Style</label>
              <select
                value={config.plateStyle}
                onChange={(e) =>
                  onChange({ ...config, plateStyle: e.target.value as CakePlateStyleType })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="gold_metallic">Royal Gold Metallic</option>
                <option value="white_porcelain">White Porcelain</option>
                <option value="black_marble">Black Marble</option>
                <option value="pastel_ceramic">Pastel Ceramic</option>
              </select>
            </div>
          </div>

          {/* Colors & Icing Finish */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Frosting Color</label>
              <div className="flex items-center gap-2 bg-slate-800 border border-white/10 rounded-xl px-3 py-1.5">
                <input
                  type="color"
                  value={config.frostingColor}
                  onChange={(e) => onChange({ ...config, frostingColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-slate-300 font-mono">{config.frostingColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Base Sponge</label>
              <div className="flex items-center gap-2 bg-slate-800 border border-white/10 rounded-xl px-3 py-1.5">
                <input
                  type="color"
                  value={config.baseColor}
                  onChange={(e) => onChange({ ...config, baseColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-slate-300 font-mono">{config.baseColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Icing Finish</label>
              <select
                value={config.icingStyle}
                onChange={(e) =>
                  onChange({ ...config, icingStyle: e.target.value as IcingFinishType })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="smooth_buttercream">Smooth Buttercream</option>
                <option value="drip_icing">Glossy Ganache Drip</option>
                <option value="whipped_cream">Whipped Cream</option>
                <option value="textured_floral">Textured Floral</option>
                <option value="chocolate_glaze">Mirror Glaze</option>
              </select>
            </div>
          </div>

          {/* Cake Topper Settings */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Cake Topper & Birthday Name</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Topper Text</label>
                <input
                  type="text"
                  maxLength={36}
                  placeholder="e.g. Happy Birthday Aarav"
                  value={config.topperText}
                  onChange={(e) => onChange({ ...config, topperText: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Topper Material</label>
                <select
                  value={config.topperMaterial}
                  onChange={(e) =>
                    onChange({ ...config, topperMaterial: e.target.value as TopperMaterial })
                  }
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {TOPPER_MATERIALS.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Age Candle & Multi-Candles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Age Candle (Optional)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                placeholder="e.g. 21"
                value={config.age || ''}
                onChange={(e) =>
                  onChange({
                    ...config,
                    age: e.target.value ? parseInt(e.target.value, 10) : null,
                  })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Candle Count
              </label>
              <select
                value={config.candleCount}
                onChange={(e) =>
                  onChange({ ...config, candleCount: parseInt(e.target.value, 10) })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value={1}>1 Candle</option>
                <option value={3}>3 Candles</option>
                <option value={5}>5 Candles</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Wax Candle Color
              </label>
              <div className="flex items-center gap-2 bg-slate-800 border border-white/10 rounded-xl px-3 py-1.5">
                <input
                  type="color"
                  value={config.candleColor}
                  onChange={(e) => onChange({ ...config, candleColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-slate-300 font-mono">{config.candleColor}</span>
              </div>
            </div>
          </div>

          {/* Edible Decorations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Toppings & Edible Decorations
              </label>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Density:</span>
                {(['minimal', 'balanced', 'rich'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onChange({ ...config, decorationIntensity: d })}
                    className={`px-2 py-0.5 rounded capitalize ${
                      config.decorationIntensity === d
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {DECORATION_OPTIONS.map((dec) => {
                const active = config.decorations.includes(dec.id);
                return (
                  <button
                    key={dec.id}
                    type="button"
                    onClick={() => {
                      const updated = active
                        ? config.decorations.filter((id) => id !== dec.id)
                        : [...config.decorations, dec.id];
                      onChange({ ...config, decorations: updated });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                      active
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {dec.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Feature Toggles */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={config.microphoneBlowEnabled}
                onChange={(e) =>
                  onChange({ ...config, microphoneBlowEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  Enable Microphone Blow Detection
                </span>
                <p className="text-[11px] text-slate-400">
                  Recipient can blow into their phone/laptop mic to blow out the candles (tap fallback is always included).
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={config.cakeCutEnabled}
                onChange={(e) => onChange({ ...config, cakeCutEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cake className="w-3.5 h-3.5 text-amber-400" />
                  Enable Cake Cutting Interaction
                </span>
                <p className="text-[11px] text-slate-400">
                  Allows recipient to swipe or drag a knife to separate the first birthday slice.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Sticky Preview (5 Columns) */}
        <div className="lg:col-span-5 sticky top-24 bg-slate-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Live Photorealistic Bakery Preview
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="w-full flex justify-center py-4">
            <RealisticBirthdayCake
              config={config}
              candlesLit={true}
              interactive={true}
            />
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-4 leading-relaxed font-outfit">
            Recipient can tap candle flames or blow into their mic to extinguish them, triggering smoke and starlight wishes!
          </p>
        </div>
      </div>
    </div>
  );
};
