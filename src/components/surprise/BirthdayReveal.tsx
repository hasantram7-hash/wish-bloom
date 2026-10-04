import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Heart,
  Lock,
  ArrowRight,
  ArrowLeft,
  Gift,
  Film,
  Share2,
  BookOpen,
  ListFilter,
  CheckCircle2,
  Smile,
  ChevronRight,
  ChevronLeft,
  Clock,
} from 'lucide-react';
import { BirthdaySurprise } from '../../types/birthday';
import { RealisticCakeConfig } from '../../types/cake';
import { CakeScene } from '../cake/CakeScene';
import { MemoryGallery } from '../gallery/MemoryGallery';
import { ReactionBar } from '../reactions/ReactionBar';
import { Guestbook } from '../guestbook/Guestbook';
import { SpecialFeatures } from './SpecialFeatures';
import { ShareActions } from '../share/ShareActions';
import { recordSurpriseView } from '../../services/firestoreService';
import { BirthdayWrapped } from './BirthdayWrapped';

interface BirthdayRevealProps {
  surprise: BirthdaySurprise;
  isPreview?: boolean;
  remainingTimeStr?: string;
}

const CHAPTERS = [
  { id: 1, title: 'Birthday Cake & Wish', icon: '🎂' },
  { id: 2, title: 'Heartfelt Words & Reasons', icon: '💖' },
  { id: 3, title: 'Memory Journey', icon: '📸' },
  { id: 4, title: 'Fun & Birthday Games', icon: '🎈' },
  { id: 5, title: 'Personal Keepsake Letter', icon: '💌' },
  { id: 6, title: 'Guestbook & Love', icon: '🎉' },
];

export const BirthdayReveal: React.FC<BirthdayRevealProps> = ({
  surprise,
  isPreview = false,
  remainingTimeStr = '24h left',
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [viewMode, setViewMode] = useState<'story' | 'scroll'>('story');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordUnlocked, setPasswordUnlocked] = useState(!surprise.specialSettings?.passwordEnabled);
  const [passwordError, setPasswordError] = useState(false);
  const [candlesBlownOut, setCandlesBlownOut] = useState(false);
  const [activeReasonIndex, setActiveReasonIndex] = useState(0);

  // Audio synthesis
  const audioContextRef = useRef<AudioContext | null>(null);
  const uploadedMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioPath = surprise.music?.audioPath;
    if (!audioPath) return;

    const player = new Audio(audioPath);
    player.loop = true;
    player.preload = 'none';
    uploadedMusicRef.current = player;

    return () => {
      player.pause();
      player.src = '';
      if (uploadedMusicRef.current === player) uploadedMusicRef.current = null;
    };
  }, [surprise.music?.audioPath]);

  // Record view on recipient open
  useEffect(() => {
    if (!isPreview && surprise.id && isRevealed) {
      recordSurpriseView(surprise.id);
    }
  }, [isPreview, surprise.id, isRevealed]);

  // Keyboard navigation for story mode
  useEffect(() => {
    if (!isRevealed || viewMode !== 'story') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentChapter < CHAPTERS.length) {
        goToChapter(currentChapter + 1);
      } else if (e.key === 'ArrowLeft' && currentChapter > 1) {
        goToChapter(currentChapter - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, viewMode, currentChapter]);

  // Cheerful soft birthday synth chime melody
  const playSynthesizedBirthdayMelody = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.0, 349.23];
      const durations = [0.4, 0.4, 0.8, 0.8, 0.8, 1.2, 0.4, 0.4, 0.8, 0.8, 0.8, 1.4];

      let delay = 0;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(audioMuted ? 0 : 0.08, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + durations[i]);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + durations[i]);
        delay += durations[i] * 0.7;
      });
    } catch (e) {
      console.warn('Audio playback not supported:', e);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    setCurrentChapter(1);

    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#38BDF8'],
    });

    if (surprise.music?.enabled) {
      if (surprise.music.audioPath) {
        const player = uploadedMusicRef.current;
        if (player) {
          player.play().then(() => setAudioPlaying(true)).catch(() => setAudioPlaying(false));
        }
      } else {
        setAudioPlaying(true);
        playSynthesizedBirthdayMelody();
      }
    }
  };

  const goToChapter = (chapterNum: number) => {
    setCurrentChapter(chapterNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Subtle celebration pop between chapters
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#EC4899', '#8B5CF6'],
    });
  };

  const toggleAudio = () => {
    if (surprise.music?.audioPath) {
      const player = uploadedMusicRef.current;
      if (!player) return;
      if (audioPlaying) {
        player.pause();
        setAudioPlaying(false);
      } else {
        player.play().then(() => setAudioPlaying(true)).catch(() => setAudioPlaying(false));
      }
      return;
    }

    if (!audioPlaying) {
      setAudioPlaying(true);
      playSynthesizedBirthdayMelody();
    } else {
      setAudioPlaying(false);
      if (audioContextRef.current) {
        audioContextRef.current.suspend();
      }
    }
  };

  const toggleMute = () => {
    setAudioMuted((prev) => !prev);
  };

  const theme = surprise.theme || {
    primaryColor: '#F59E0B',
    secondaryColor: '#EC4899',
    accentColor: '#FDE68A',
    textColor: '#FFFFFF',
    fontStyle: 'playful',
    backgroundType: 'gradient',
  };

  const heroPhoto = surprise.memories?.find((m) => m.isHero) || surprise.memories?.[0];

  // Cake Config
  const cakeConfig: RealisticCakeConfig = {
    enabled: true,
    style: (surprise.cake as any)?.style || 'luxury_floral',
    shape: (surprise.cake as any)?.shape === 'tiered' ? 'two_tier' : (surprise.cake?.shape as any) || 'round',
    size: (surprise.cake as any)?.size || 'medium',
    flavorLabel: (surprise.cake as any)?.flavorLabel || (surprise.cake as any)?.flavor || 'vanilla',
    frostingColor: surprise.cake?.frostingColor || '#FAF5EE',
    baseColor: surprise.cake?.baseColor || '#E6D3B3',
    accentColor: theme.primaryColor || '#F59E0B',
    icingStyle: (surprise.cake?.icingStyle as any) === 'drip' ? 'drip_icing' : (surprise.cake?.icingStyle as any) || 'smooth_buttercream',
    borderStyle: (surprise.cake as any)?.borderStyle || 'pearl_border',
    plateStyle: (surprise.cake?.plateStyle as any) === 'gold_plate' ? 'gold_metallic' : (surprise.cake?.plateStyle as any) || 'gold_metallic',
    decorations: (surprise.cake?.decorations as any) || ['gold_leaf_flakes', 'edible_flowers'],
    decorationIntensity: (surprise.cake as any)?.decorationIntensity || 'balanced',
    topperText: surprise.cake?.topperText || `Happy Birthday ${surprise.recipientName}`,
    topperFont: (surprise.cake as any)?.topperFont,
    topperColor: (surprise.cake as any)?.topperColor || '#F59E0B',
    topperMaterial: (surprise.cake as any)?.topperMaterial || 'gold_acrylic',
    topperPosition: (surprise.cake as any)?.topperPosition || 'center_top',
    age: surprise.cake?.age || null,
    candleColor: surprise.cake?.candleColor || '#F59E0B',
    candleCount: (surprise.cake as any)?.candleCount || 3,
    candlesLit: surprise.cake?.candlesLit ?? true,
    microphoneBlowEnabled: (surprise.cake as any)?.microphoneBlowEnabled ?? true,
    blowSensitivity: (surprise.cake as any)?.blowSensitivity || 'normal',
    cakeCutEnabled: (surprise.cake as any)?.cakeCutEnabled ?? true,
    hiddenNoteAfterBlow: (surprise.cake as any)?.hiddenNoteAfterBlow || null,
    memorySliceReward: (surprise.cake as any)?.memorySliceReward || {
      type: 'message',
      content: "May every wish you made while blowing these candles come true in the most magical way!",
      mediaUrl: null,
    },
  };

  const getBackgroundStyle = () => {
    switch (theme.backgroundType) {
      case 'stars':
        return 'bg-gradient-to-b from-slate-950 via-indigo-950 to-black';
      case 'galaxy':
        return 'bg-gradient-to-b from-purple-950 via-slate-950 to-black';
      case 'floating_hearts':
        return 'bg-gradient-to-b from-pink-950 via-slate-950 to-black';
      case 'clouds':
        return 'bg-gradient-to-b from-sky-950 via-slate-900 to-black';
      case 'floral':
        return 'bg-gradient-to-b from-emerald-950 via-slate-950 to-black';
      case 'solid':
        return 'bg-slate-950';
      case 'gradient':
      default:
        return 'bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950';
    }
  };

  // 1. Password gate screen
  if (surprise.specialSettings?.passwordEnabled && !passwordUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Secret Birthday Portal</h2>
          <p className="text-xs text-slate-400">
            {surprise.specialSettings.passwordHint
              ? `Hint: ${surprise.specialSettings.passwordHint}`
              : 'Please enter the access phrase provided by the sender.'}
          </p>

          <input
            type="password"
            placeholder="Enter secret code..."
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-slate-800 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />

          {passwordError && (
            <p className="text-xs text-rose-400">Incorrect password. Please try again.</p>
          )}

          <button
            type="button"
            onClick={() => {
              if (passwordInput.trim().length > 0) {
                setPasswordUnlocked(true);
              } else {
                setPasswordError(true);
              }
            }}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition cursor-pointer"
          >
            Unlock My Surprise
          </button>
        </div>
      </div>
    );
  }

  if (surprise.theme.templateId === 'birthday-wrapped') {
    return (
      <BirthdayWrapped
        surprise={surprise}
        cakeConfig={cakeConfig}
        audioPlaying={audioPlaying}
        onOpened={() => {
          setIsRevealed(true);
          setViewMode('scroll');
        }}
        onToggleAudio={toggleAudio}
        onCandlesBlown={() => setCandlesBlownOut(true)}
      />
    );
  }

  // 2. Initial Locked Screen ("Tap to Open Your Surprise")
  if (!isRevealed) {
    return (
      <div
        className={`min-h-screen ${getBackgroundStyle()} flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none`}
      >
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-2xl shadow-amber-500/30 mx-auto animate-float">
            <Gift className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-300/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              For {surprise.recipientName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              A birthday surprise is waiting for you…
            </h1>
            <p className="text-sm text-slate-400">
              Crafted with deep love and unforgettable memories by <strong>{surprise.senderName}</strong>
            </p>
          </div>

          {/* 24-Hour Expiry Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs text-amber-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>24-Hour Celebration Window • {remainingTimeStr}</span>
          </div>

          <button
            type="button"
            onClick={handleReveal}
            className="w-full py-4 px-8 rounded-full text-base sm:text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Tap to Open Your Surprise ✨</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-[11px] text-slate-500">
            Interactive Chapter Experience • Made with ❤️ by RAM
          </p>
        </div>
      </div>
    );
  }

  // 3. Cinematic Revealed Experience
  return (
    <div className={`min-h-screen ${getBackgroundStyle()} text-slate-100 relative pb-28`}>
      {/* Top Floating Header & Controls */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Recipient Title */}
          <div className="flex items-center gap-2 truncate">
            <span className="text-base sm:text-lg font-black text-white truncate">
              {surprise.recipientName}'s Universe 🎉
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-medium">
              <Clock className="w-3 h-3 text-amber-400" /> {remainingTimeStr}
            </span>
          </div>

          {/* Mode Toggle & Audio Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle: Story Mode vs Scroll Mode */}
            <div className="flex items-center bg-slate-900 border border-white/10 rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('story')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'story'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span className="hidden sm:inline">Story Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('scroll')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'scroll'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListFilter className="w-3 h-3" />
                <span className="hidden sm:inline">Scroll View</span>
              </button>
            </div>

            {/* Audio Toggle */}
            {surprise.music?.enabled && (
              <button
                type="button"
                onClick={toggleAudio}
                className="p-2 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer shadow-md"
                title={audioPlaying ? 'Mute' : 'Play Music'}
              >
                {audioPlaying ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Story Mode Chapter Tabs */}
        {viewMode === 'story' && (
          <div className="max-w-5xl mx-auto pt-2.5 pb-1 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
            {CHAPTERS.map((ch) => {
              const isActive = currentChapter === ch.id;
              const isPast = currentChapter > ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => goToChapter(ch.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : isPast
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  <span>{ch.icon}</span>
                  <span className="hidden md:inline">{ch.title}</span>
                  <span className="md:hidden">Ch {ch.id}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">

        {/* ========================================================= */}
        {/* STORY MODE: CHAPTER-BY-CHAPTER WITH SMOOTH TRANSITIONS   */}
        {/* ========================================================= */}
        {viewMode === 'story' && (
          <div className="space-y-8 animate-fade-in">
            {/* CHAPTER 1: BIRTHDAY CAKE & MAKE A WISH */}
            {currentChapter === 1 && (
              <div className="space-y-8 text-center animate-scale-up">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest font-bold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                    Chapter 1 • The Birthday Moment
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    Happy Birthday, {surprise.recipientName}! 🎂
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed font-outfit">
                    Close your eyes, make a heartfelt wish, and blow out your birthday candles!
                  </p>
                </div>

                {/* 3D Realistic Cake Scene */}
                <div className="p-4 sm:p-8 rounded-3xl bg-slate-950/60 border border-white/10 shadow-2xl backdrop-blur-md relative overflow-hidden">
                  <CakeScene
                    config={cakeConfig}
                    recipientName={surprise.recipientName}
                    onCandlesBlown={() => {
                      setCandlesBlownOut(true);
                      confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
                    }}
                    reward={cakeConfig.memorySliceReward}
                  />
                </div>

                {/* Continue to Next Chapter Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => goToChapter(2)}
                    className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Next: Heartfelt Wishes & Reasons 💖</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* CHAPTER 2: HEARTFELT WISHES & REASONS WHY YOU'RE AMAZING */}
            {currentChapter === 2 && (
              <div className="space-y-8 animate-scale-up">
                <div className="text-center space-y-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-pink-400 bg-pink-500/10 px-4 py-1.5 rounded-full border border-pink-500/20">
                    Chapter 2 • Words from the Heart
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    Why You Make the World Brighter 🌟
                  </h2>
                </div>

                {/* Primary Message Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl space-y-4 text-center sm:text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Message from {surprise.senderName}
                    </span>
                    <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  </div>
                  <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-outfit">
                    "{surprise.message}"
                  </p>
                  {surprise.quote && (
                    <blockquote className="pt-3 border-t border-white/5 text-xs sm:text-sm italic text-amber-300/90">
                      “{surprise.quote}”
                    </blockquote>
                  )}
                </div>

                {/* Interactive Reasons Why You're Special */}
                {surprise.reasons && surprise.reasons.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white text-center">
                      Reasons Why You Are Loved So Much:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {surprise.reasons.map((reason, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            confetti({ particleCount: 20, spread: 45, origin: { y: 0.7 } });
                          }}
                          className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 hover:border-amber-400/40 transition shadow-lg space-y-2 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                              Special Quality #{idx + 1}
                            </span>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed font-outfit">
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wishes Cards */}
                {surprise.wishes && surprise.wishes.length > 0 && (
                  <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400 text-center">
                      Warm Birthday Blessings for Your Year Ahead:
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {surprise.wishes.map((wish, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs sm:text-sm text-slate-200 font-medium"
                        >
                          ✨ {wish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="pt-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goToChapter(1)}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-white/10 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous (Cake)
                  </button>
                  <button
                    type="button"
                    onClick={() => goToChapter(3)}
                    className="flex items-center gap-1.5 px-7 py-3 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 transition shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Next: Photo Memories 📸 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* CHAPTER 3: MEMORY JOURNEY (PHOTOS & VIDEOS) */}
            {currentChapter === 3 && (
              <div className="space-y-8 animate-scale-up">
                <div className="text-center space-y-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-sky-400 bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/20">
                    Chapter 3 • Walk Down Memory Lane
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    Unforgettable Moments Together 📸
                  </h2>
                  <p className="text-xs text-slate-400">
                    Tap any photo to view full size in the celebration lightbox
                  </p>
                </div>

                {/* Hero Photo Spotlight if available */}
                {heroPhoto && (
                  <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 text-center space-y-3 shadow-2xl relative overflow-hidden">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Featured Hero Memory
                    </div>
                    <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                      <img
                        src={heroPhoto.downloadUrl}
                        alt="Hero Birthday Memory"
                        className="w-full h-72 sm:h-96 object-cover object-center hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {heroPhoto.caption && (
                      <p className="text-sm font-semibold text-slate-200 font-caveat text-xl">
                        "{heroPhoto.caption}"
                      </p>
                    )}
                  </div>
                )}

                {/* Full Responsive Memory Gallery */}
                <div className="p-4 sm:p-6 rounded-3xl bg-slate-950/60 border border-white/10 shadow-xl">
                  <MemoryGallery
                    memories={surprise.memories || []}
                    polaroidStyle={theme.toggles?.polaroidStyle}
                    accentColor={theme.primaryColor}
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="pt-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goToChapter(2)}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-white/10 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous (Wishes)
                  </button>
                  <button
                    type="button"
                    onClick={() => goToChapter(4)}
                    className="flex items-center gap-1.5 px-7 py-3 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 transition shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Next: Fun & Games 🎈 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* CHAPTER 4: INTERACTIVE BIRTHDAY GAMES */}
            {currentChapter === 4 && (
              <div className="space-y-8 animate-scale-up">
                <div className="text-center space-y-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    Chapter 4 • Birthday Games & Fun
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    Interactive Birthday Activities 🎈
                  </h2>
                  <p className="text-xs text-slate-400">
                    Pop balloons for cheerful blessings and spin the birthday destiny wheel!
                  </p>
                </div>

                {/* Special Games Component */}
                <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl">
                  <SpecialFeatures
                    specialSettings={surprise.specialSettings}
                    accentColor={theme.primaryColor}
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="pt-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goToChapter(3)}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-white/10 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous (Photos)
                  </button>
                  <button
                    type="button"
                    onClick={() => goToChapter(5)}
                    className="flex items-center gap-1.5 px-7 py-3 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 transition shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Next: Secret Keepsake Letter 💌 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* CHAPTER 5: PERSONAL LETTER & SECRET NOTE */}
            {currentChapter === 5 && (
              <div className="space-y-8 animate-scale-up">
                <div className="text-center space-y-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-purple-400 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20">
                    Chapter 5 • From {surprise.senderName}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    A Keepsake Letter For You 💌
                  </h2>
                </div>

                {/* Luxury Letter Box */}
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 shadow-2xl relative space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                      Personal Note
                    </span>
                    <Heart className="w-5 h-5 text-rose-500 fill-current animate-pulse" />
                  </div>

                  <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-outfit whitespace-pre-line">
                    {surprise.personalLetter ||
                      "Looking back at everything we've shared, I couldn't have asked for a truer, kinder, more inspiring soul in my life. Thank you for every late-night conversation, every celebration, and for standing by me through thick and thin. Here is to another year of dreams turning into reality!"}
                  </p>

                  <div className="pt-6 border-t border-white/10 text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-widest">With boundless love,</p>
                    <p className="text-3xl font-caveat font-bold text-amber-300 pt-1">
                      {surprise.senderName} ❤️
                    </p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="pt-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goToChapter(4)}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-white/10 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous (Games)
                  </button>
                  <button
                    type="button"
                    onClick={() => goToChapter(6)}
                    className="flex items-center gap-1.5 px-7 py-3 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 transition shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Final Chapter: Guestbook & Share 🎉 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* CHAPTER 6: GUESTBOOK, REACTIONS & SOCIAL SHARE */}
            {currentChapter === 6 && (
              <div className="space-y-8 animate-scale-up">
                <div className="text-center space-y-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                    Final Chapter • Celebration Hub
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    Send Love & Share the Magic 🎉
                  </h2>
                </div>

                {/* Reactions */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 text-center space-y-3">
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    Send Instant Birthday Love
                  </p>
                  <ReactionBar surpriseId={surprise.id || 'preview'} reactions={surprise.reactions} />
                </div>

                {/* Guestbook */}
                {surprise.guestbookEnabled && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10">
                    <Guestbook surpriseId={surprise.id || 'preview'} accentColor={theme.primaryColor} />
                  </div>
                )}

                {/* Social Share Options (WhatsApp, Instagram, etc.) */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                      <Share2 className="w-5 h-5 text-amber-400" /> Share this Birthday Surprise
                    </h3>
                    <p className="text-xs text-slate-400">
                      Share with family & friends via WhatsApp, Instagram, Telegram & more!
                    </p>
                  </div>
                  <ShareActions
                    slug={surprise.slug}
                    recipientName={surprise.recipientName}
                    senderName={surprise.senderName}
                  />
                </div>

                {/* Restart Story / Made by RAM Footer */}
                <div className="text-center pt-6 space-y-4">
                  <button
                    type="button"
                    onClick={() => goToChapter(1)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-white/15 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" /> Replay Birthday Story From Chapter 1
                  </button>

                  <div className="pt-2 flex flex-col items-center justify-center gap-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs text-amber-300 font-semibold shadow-lg shadow-amber-500/10">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Made with ❤️ by RAM</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Turn a birthday wish into a whole universe with WishVerse
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SCROLL VIEW (Traditional Long-Page Mode for Fast Browsing) */}
        {/* ========================================================= */}
        {viewMode === 'scroll' && (
          <div className="space-y-16 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                Birthday Universe for {surprise.recipientName}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white">
                Happy Birthday, {surprise.recipientName}! 🎂
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed font-outfit">
                Crafted with boundless love by {surprise.senderName}
              </p>
            </div>

            {/* Cake Scene */}
            <section className="p-4 sm:p-8 rounded-3xl bg-slate-950/60 border border-white/10 shadow-2xl">
              <CakeScene
                config={cakeConfig}
                recipientName={surprise.recipientName}
                onCandlesBlown={() => {
                  confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
                }}
                reward={cakeConfig.memorySliceReward}
              />
            </section>

            {/* Heartfelt Message */}
            <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/15 space-y-4">
              <h3 className="text-xl font-bold text-white">A Birthday Message:</h3>
              <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-outfit">
                "{surprise.message}"
              </p>
              {surprise.quote && (
                <blockquote className="pt-2 text-xs sm:text-sm italic text-amber-300/90 border-t border-white/5">
                  “{surprise.quote}”
                </blockquote>
              )}
            </section>

            {/* Reasons */}
            {surprise.reasons && surprise.reasons.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-white text-center">Reasons Why You Are Special:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {surprise.reasons.map((r, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                      <span className="text-xs font-bold text-amber-400">#{i + 1}</span>
                      <p className="text-sm text-slate-200 font-outfit">{r}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Memories */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-white text-center">Memory Gallery 📸</h3>
              <MemoryGallery
                memories={surprise.memories || []}
                polaroidStyle={theme.toggles?.polaroidStyle}
                accentColor={theme.primaryColor}
              />
            </section>

            {/* Games */}
            <section className="p-6 rounded-3xl bg-slate-900/90 border border-white/10">
              <SpecialFeatures
                specialSettings={surprise.specialSettings}
                accentColor={theme.primaryColor}
              />
            </section>

            {/* Personal Letter */}
            {surprise.personalLetter && (
              <section className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4">
                <h3 className="text-xl font-bold text-white">Personal Letter:</h3>
                <p className="text-base text-slate-200 leading-relaxed font-outfit whitespace-pre-line">
                  {surprise.personalLetter}
                </p>
                <p className="text-right font-caveat text-2xl text-amber-300 font-bold">
                  With love, {surprise.senderName} ❤️
                </p>
              </section>
            )}

            {/* Reactions & Guestbook */}
            <section className="space-y-6">
              <div className="text-center">
                <ReactionBar surpriseId={surprise.id || 'preview'} reactions={surprise.reactions} />
              </div>
              {surprise.guestbookEnabled && (
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10">
                  <Guestbook surpriseId={surprise.id || 'preview'} accentColor={theme.primaryColor} />
                </div>
              )}
            </section>

            {/* Share */}
            <section className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white text-center">Share This Birthday Universe</h3>
              <ShareActions
                slug={surprise.slug}
                recipientName={surprise.recipientName}
                senderName={surprise.senderName}
              />
            </section>

            {/* Footer */}
            <footer className="text-center pt-8 border-t border-white/10 space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs text-amber-300 font-semibold shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Made with ❤️ by RAM</span>
              </div>
              <p className="text-xs text-slate-500">WishVerse • Turn a birthday wish into a whole universe</p>
            </footer>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Bar for Story Mode */}
      {viewMode === 'story' && isRevealed && (
        <nav
          aria-label="Story Chapter Navigation"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 backdrop-blur-xl border border-white/15 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-xs"
        >
          <button
            type="button"
            disabled={currentChapter === 1}
            onClick={() => goToChapter(currentChapter - 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <span className="text-slate-400 font-medium px-2">
            Chapter <strong className="text-white">{currentChapter}</strong> of {CHAPTERS.length}
          </span>

          <button
            type="button"
            disabled={currentChapter === CHAPTERS.length}
            onClick={() => goToChapter(currentChapter + 1)}
            className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer shadow-md shadow-amber-500/20"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
};
