import React, { useState } from 'react';
import { Sparkles, Heart, Compass, Star, Smile, Gift, ChevronDown, ChevronUp } from 'lucide-react';

export interface JourneyMilestone {
  label: string;
  title: string;
  description: string;
  icon: string;
}

interface MemoryJourneyProps {
  recipientName: string;
  senderName: string;
  milestones?: JourneyMilestone[];
  personalLetter?: string;
  className?: string;
}

const DEFAULT_MILESTONES: JourneyMilestone[] = [
  {
    label: 'Chapter 1',
    title: 'The Day We First Met',
    description: 'Looking back at the very beginning, who knew that one random introduction or casual hello would turn into the deepest bond in my life?',
    icon: '✨',
  },
  {
    label: 'Chapter 2',
    title: 'Our Funniest Memory',
    description: 'From laughing till our stomachs hurt over inside jokes that make zero sense to anyone else, to surviving our wildest misadventures together.',
    icon: '😂',
  },
  {
    label: 'Chapter 3',
    title: 'The Moment I Knew You Were Special',
    description: 'When times were tough, you stood by me without a second thought. Your kindness, loyalty, and heart of gold are unmatched.',
    icon: '💛',
  },
  {
    label: 'Chapter 4',
    title: 'What I Admire Most About You',
    description: 'Your resilience, your infectious passion for living, and how you make every single room brighter simply by walking into it.',
    icon: '🌟',
  },
  {
    label: 'Chapter 5',
    title: 'My Wish For Your Next Year',
    description: 'May the universe reward your generosity with boundless success, unshakable peace, wild adventures, and genuine love.',
    icon: '🎉',
  },
];

export const MemoryJourney: React.FC<MemoryJourneyProps> = ({
  recipientName,
  senderName,
  milestones = DEFAULT_MILESTONES,
  personalLetter,
  className = '',
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className={`w-full max-w-3xl mx-auto space-y-10 ${className}`}>
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
          <Compass className="w-3.5 h-3.5" />
          <span>Our Story & Milestones</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          The Journey of {recipientName} & {senderName} 📖
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-outfit">
          Every chapter with you has been a gift. Tap each milestone to walk down memory lane.
        </p>
      </div>

      {/* Interactive Milestone Cards */}
      <div className="space-y-4">
        {milestones.map((item, index) => {
          const isExpanded = activeStep === index;

          return (
            <div
              key={index}
              onClick={() => setActiveStep(isExpanded ? -1 : index)}
              className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 cursor-pointer backdrop-blur-md shadow-xl ${
                isExpanded
                  ? 'bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border-amber-400/50 ring-1 ring-amber-400/20'
                  : 'bg-slate-900/70 border-white/10 hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      {item.label}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-1 rounded-full text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-300" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in space-y-2">
                  <p className="text-sm text-slate-200 leading-relaxed font-outfit">
                    {item.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Handwritten-Style Personal Letter from Sender */}
      {personalLetter && (
        <div className="bg-gradient-to-br from-amber-50/10 via-amber-100/5 to-slate-900/90 border border-amber-400/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
            <Heart className="w-4 h-4 fill-current text-rose-500" />
            <span>A Letter Just For You</span>
          </div>

          <p className="text-base sm:text-xl text-amber-100/90 leading-relaxed font-caveat whitespace-pre-wrap">
            {personalLetter}
          </p>

          <div className="mt-6 text-right">
            <p className="text-xs uppercase tracking-widest text-slate-400">Always your friend,</p>
            <p className="text-xl sm:text-2xl font-caveat font-bold text-amber-300">
              {senderName} ❤️
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
