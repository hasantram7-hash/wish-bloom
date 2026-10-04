import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, Eye, X } from 'lucide-react';
import { BIRTHDAY_TEMPLATES } from '../config/templates';
import { TemplateDefinition } from '../types/birthday';
import { RealisticBirthdayCake } from '../components/cake/RealisticBirthdayCake';
import { RealisticCakeConfig } from '../types/cake';

const FILTER_TAGS = ['All', 'Romantic', 'Cute', 'Premium', 'Fun', 'Best Friend', 'Partner', 'Family', 'Milestone'];

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  const filteredTemplates = BIRTHDAY_TEMPLATES.filter((template) => {
    if (selectedTag === 'All') return true;
    return template.tags.includes(selectedTag);
  });

  const handleUseTemplate = (templateId: string) => {
    navigate(`/create?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{BIRTHDAY_TEMPLATES.length} Bespoke Birthday Themes</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Explore Birthday Templates
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-outfit">
            Every template sets up tailored color palettes, festive background atmospheres, fonts, and bespoke cake styling.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition active:scale-95 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-white/10 text-slate-300 hover:border-white/30'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-3xl overflow-hidden bg-slate-900/90 border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-xl flex flex-col group"
            >
              {/* Visual Card Banner */}
              <div
                className={`relative h-52 bg-gradient-to-br ${template.previewGradient} p-6 flex flex-col justify-between overflow-hidden`}
              >
                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${template.accentBadge}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(template)}
                    className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
                    title="Quick preview cake & palette"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="z-10">
                  <h3 className="text-xl font-extrabold text-white drop-shadow-md">
                    {template.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed font-outfit">
                  {template.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-400">Palette:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: template.themeDefaults.primaryColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: template.themeDefaults.secondaryColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: template.themeDefaults.accentColor }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(template)}
                      className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition cursor-pointer"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(template.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PREVIEW MODAL */}
        {previewTemplate && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setPreviewTemplate(null)}
          >
            <div
              className="bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${previewTemplate.accentBadge}`}>
                  {previewTemplate.tags.join(' • ')}
                </span>
                <h3 className="text-2xl font-black text-white">{previewTemplate.title}</h3>
                <p className="text-xs text-slate-400">{previewTemplate.description}</p>
              </div>

              {/* Live Cake Render for this template */}
              <div className="py-2 flex justify-center bg-slate-950/60 rounded-2xl border border-white/5 p-4">
                <RealisticBirthdayCake
                  config={{
                    enabled: true,
                    style: (previewTemplate.cakeDefaults.style as any) || 'luxury_floral',
                    shape: (previewTemplate.cakeDefaults.shape as any) || 'round',
                    size: 'medium',
                    flavorLabel: (previewTemplate.cakeDefaults.flavorLabel as any) || 'vanilla',
                    frostingColor: previewTemplate.cakeDefaults.frostingColor || '#FAF5EE',
                    baseColor: previewTemplate.cakeDefaults.baseColor || '#E6D3B3',
                    accentColor: previewTemplate.themeDefaults.primaryColor || '#F59E0B',
                    icingStyle: (previewTemplate.cakeDefaults.icingStyle as any) || 'textured_floral',
                    borderStyle: 'pearl_border',
                    plateStyle: (previewTemplate.cakeDefaults.plateStyle as any) || 'gold_metallic',
                    decorations: (previewTemplate.cakeDefaults.decorations as any) || ['gold_leaf_flakes'],
                    decorationIntensity: 'balanced',
                    topperText: 'Happy Birthday!',
                    topperFont: undefined,
                    topperColor: '#F59E0B',
                    topperMaterial: (previewTemplate.cakeDefaults.topperMaterial as any) || 'gold_acrylic',
                    topperPosition: 'center_top',
                    age: 21,
                    candleColor: previewTemplate.cakeDefaults.candleColor || '#F59E0B',
                    candleCount: 3,
                    candlesLit: true,
                    microphoneBlowEnabled: true,
                    blowSensitivity: 'normal',
                    cakeCutEnabled: true,
                    hiddenNoteAfterBlow: null,
                    memorySliceReward: {
                      type: 'message',
                      content: 'Happy Birthday!',
                      mediaUrl: null,
                    },
                  }}
                  candlesLit={true}
                  interactive={true}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleUseTemplate(previewTemplate.id)}
                  className="flex-1 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-lg shadow-amber-500/25 active:scale-95 transition cursor-pointer"
                >
                  Create with This Template →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
