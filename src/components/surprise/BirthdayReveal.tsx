import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  Lock,
  ArrowRight,
  Gift,
  Film,
  Share2,
} from 'lucide-react';
import { BirthdaySurprise } from '../../types/birthday';
import { RealisticCakeConfig } from '../../types/cake';
import { CakeScene } from '../cake/CakeScene';
import { MemoryGallery } from '../gallery/MemoryGallery';
import { ReactionBar } from '../reactions/ReactionBar';
import { Guestbook } from '../guestbook/Guestbook';
import { SpecialFeatures } from './SpecialFeatures';
import { MemoryJourney } from './MemoryJourney';
import { ShareActions } from '../share/ShareActions';
import { recordSurpriseView } from '../../services/firestoreService';

interface BirthdayRevealProps {
  surprise: BirthdaySurprise;
  isPreview?: boolean;
}

export const BirthdayReveal: React.FC<BirthdayRevealProps> = ({
  surprise,
  isPreview = false,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordUnlocked, setPasswordUnlocked] = useState(!surprise.specialSettings?.passwordEnabled);
  const [passwordError, setPasswordError] = useState(false);
  const [hiddenNoteUnlocked, setHiddenNoteUnlocked] = useState(false);
  const [cakeSliced, setCakeSliced] = useState(false);

  // Audio synthesis or safe royalty-free audio context
  const audioContextRef = useRef<AudioContext | null>(null);

  // Record view on recipient open
  useEffect(() => {
    if (!isPreview && surprise.id && isRevealed) {
      recordSurpriseView(surprise.id);
    }
  }, [isPreview, surprise.id, isRevealed]);

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
      console.warn('Audio playback not supported or user interaction needed:', e);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#38BDF8'],
    });

    if (surprise.music?.enabled) {
      setAudioPlaying(true);
      playSynthesizedBirthdayMelody();
    }
  };

  const replayCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
    });
    if (surprise.music?.enabled) {
      playSynthesizedBirthdayMelody();
    }
  };

  const toggleAudio = () => {
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

  const heroPhoto = surprise.memories?.find((m) => m.isHero) || surprise.memories?.[0];
  const videoMemory = surprise.memories?.find((m) => m.type === 'video');

  const theme = surprise.theme || {
    primaryColor: '#F59E0B',
    secondaryColor: '#EC4899',
    accentColor: '#FDE68A',
    textColor: '#FFFFFF',
    fontStyle: 'playful',
    backgroundType: 'gradient',
  };

  // Convert or merge cake config into RealisticCakeConfig
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
              Crafted with deep love and unforgettable memories by {surprise.senderName}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReveal}
            className="w-full py-4 px-8 rounded-full text-base sm:text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Tap to Open Your Surprise</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-[11px] text-slate-500">Best experienced with sound enabled 🎶</p>
        </div>
      </div>
    );
  }

  // 3. Cinematic Revealed Experience
  return (
    <div className={`min-h-screen ${getBackgroundStyle()} text-slate-100 relative pb-20`}>
      {/* Floating Audio Controls */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/15 p-1.5 rounded-full shadow-lg">
        {surprise.music?.enabled && (
          <>
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2 rounded-full text-slate-300 hover:text-white transition cursor-pointer"
              title={audioPlaying ? 'Pause Melody' : 'Play Melody'}
            >
              {audioPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-full text-slate-300 hover:text-white transition cursor-pointer"
              title={audioMuted ? 'Unmute' : 'Mute'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={replayCelebration}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition cursor-pointer"
          title="Replay Celebration Confetti"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Replay
        </button>
      </div>

      {/* Main Content Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 space-y-16">
        {/* HERO GREETING HEADER */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{surprise.relationship} Birthday Special</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-400 leading-tight">
            Happy Birthday, {surprise.recipientName}! 🎉
          </h1>

          {surprise.recipientNickname && (
            <p className="text-base sm:text-lg text-pink-300 font-caveat tracking-wider">
              aka "{surprise.recipientNickname}"
            </p>
          )}

          {surprise.customTitle && (
            <p className="text-lg sm:text-xl font-medium text-slate-300 max-w-xl mx-auto">
              {surprise.customTitle}
            </p>
          )}
        </header>

        {/* HERO PHOTO DISPLAY */}
        {heroPhoto && (
          <div className="relative max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-900 group">
            <img
              src={heroPhoto.downloadUrl}
              alt={heroPhoto.caption || surprise.recipientName}
              className="w-full h-auto max-h-[460px] object-cover"
            />
            {heroPhoto.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 text-center">
                <p className="text-white text-base sm:text-lg font-caveat">
                  "{heroPhoto.caption}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* REALISTIC 3D BAKERY CAKE SCENE (Candle Blow + Cake Cut) */}
        <section aria-label="Birthday Cake Experience" className="py-4">
          <CakeScene
            config={cakeConfig}
            recipientName={surprise.recipientName}
            onCandlesBlown={() => setHiddenNoteUnlocked(true)}
            onCakeSliced={() => setCakeSliced(true)}
          />
        </section>

        {/* VIDEO MESSAGE WALL (Optional) */}
        {(videoMemory || surprise.videoMessageUrl) && (
          <section className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400">
              <Film className="w-4 h-4" />
              <span>A Video Message From {surprise.senderName}</span>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg">
              <video
                src={videoMemory?.downloadUrl || surprise.videoMessageUrl}
                controls
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>
          </section>
        )}

        {/* HEARTFELT MESSAGE CARD */}
        <section className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-amber-500/10 pointer-events-none select-none text-8xl font-serif">
            “
          </div>

          <div className="relative space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <Heart className="w-4 h-4 fill-current text-rose-500" />
              <span>A Personal Message for You</span>
            </div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-outfit whitespace-pre-wrap">
              {surprise.message}
            </p>

            {surprise.quote && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm sm:text-base italic text-amber-200 font-serif">
                  — "{surprise.quote}"
                </p>
              </div>
            )}
          </div>
        </section>

        {/* BEST FRIEND MEMORY JOURNEY TIMELINE */}
        <section className="py-2">
          <MemoryJourney
            recipientName={surprise.recipientName}
            senderName={surprise.senderName}
            milestones={surprise.milestones}
            personalLetter={surprise.personalLetter}
          />
        </section>

        {/* REASONS YOU ARE AMAZING */}
        {surprise.reasons && surprise.reasons.length > 0 && (
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Reasons You Are Truly Amazing ✨
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Just a few of the million things that make you so special
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {surprise.reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/70 border border-white/10 shadow-lg hover:border-amber-400/40 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MEMORY GALLERY */}
        {surprise.memories && surprise.memories.length > 1 && (
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Our Precious Memories 📸
              </h2>
              <p className="text-xs text-slate-400 mt-1">Click any photo to view in full screen</p>
            </div>

            <MemoryGallery
              memories={surprise.memories}
              polaroidStyle={theme.toggles?.polaroidStyle}
              accentColor={theme.primaryColor}
            />
          </section>
        )}

        {/* SPECIAL INTERACTIVE FEATURES (Balloon game, wheel, scratch card, quiz, gift reveal) */}
        {surprise.specialSettings && (
          <SpecialFeatures
            specialSettings={surprise.specialSettings}
            accentColor={theme.primaryColor}
          />
        )}

        {/* REACTIONS BAR */}
        <section className="py-4 text-center space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Send Birthday Love to {surprise.recipientName}
          </p>
          <ReactionBar surpriseId={surprise.id || 'preview'} reactions={surprise.reactions} />
        </section>

        {/* GUESTBOOK */}
        {surprise.guestbookEnabled && (
          <section className="pt-6 border-t border-white/10">
            <Guestbook surpriseId={surprise.id || 'preview'} accentColor={theme.primaryColor} />
          </section>
        )}

        {/* SHARE THIS SURPRISE ON WHATSAPP, INSTAGRAM, ETC. */}
        <section className="pt-8 border-t border-white/10 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5 text-amber-400" />
              Share this Birthday Surprise
            </h3>
            <p className="text-xs text-slate-400">
              Share the magic with friends & family on WhatsApp, Instagram, Telegram & more!
            </p>
          </div>
          <ShareActions
            slug={surprise.slug}
            recipientName={surprise.recipientName}
            senderName={surprise.senderName}
            className="max-w-xl mx-auto"
          />
        </section>

        {/* FINAL SENDER SIGNATURE & MADE BY RAM FOOTER */}
        <footer className="text-center pt-10 space-y-6 border-t border-white/10">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-slate-400">Made with infinite love</p>
            <p className="text-2xl sm:text-3xl font-caveat font-bold text-amber-300">
              With lots of love, {surprise.senderName} ❤️
            </p>
          </div>

          {/* Made by RAM Signature Pill */}
          <div className="flex flex-col items-center justify-center gap-2 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs text-amber-300 font-semibold shadow-lg shadow-amber-500/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Made with ❤️ by RAM</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              WishVerse • Magical Birthday Surprises
            </p>
          </div>

          <div className="pt-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/15 shadow-xl transition cursor-pointer"
            >
              <span>Turn a birthday wish into a whole universe with WishVerse →</span>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};
