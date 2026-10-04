import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Gift,
  Camera,
  Music,
  Heart,
  QrCode,
  Smile,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { BIRTHDAY_TEMPLATES } from '../config/templates';
import { RealisticBirthdayCake } from '../components/cake/RealisticBirthdayCake';
import { RealisticCakeConfig } from '../types/cake';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const sampleCakeConfig: RealisticCakeConfig = {
    enabled: true,
    style: 'luxury_floral',
    shape: 'round',
    size: 'medium',
    flavorLabel: 'strawberry',
    frostingColor: '#FAF5EE',
    baseColor: '#E6D3B3',
    accentColor: '#F59E0B',
    icingStyle: 'drip_icing',
    borderStyle: 'pearl_border',
    plateStyle: 'gold_metallic',
    decorations: ['gold_leaf_flakes', 'cherries', 'edible_flowers'],
    decorationIntensity: 'balanced',
    topperText: 'Happy Birthday Aarav',
    topperFont: undefined,
    topperColor: '#F59E0B',
    topperMaterial: 'gold_acrylic',
    topperPosition: 'center_top',
    age: 24,
    candleColor: '#F59E0B',
    candleCount: 3,
    candlesLit: true,
    microphoneBlowEnabled: true,
    blowSensitivity: 'normal',
    cakeCutEnabled: true,
    hiddenNoteAfterBlow: null,
    memorySliceReward: {
      type: 'message',
      content: 'Wishing you boundless joy and success!',
      mediaUrl: null,
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/15 via-rose-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4" />
                <span>Turn a birthday wish into a whole universe</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-amber-500/20 text-xs text-amber-300 font-medium shadow-sm">
                Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" /> by <strong>RAM</strong>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Make their birthday feel like{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-400">
                magic.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-outfit">
              Create a personalized birthday website with multiple photos, heartfelt letters, an interactive custom cake, sweet melodies, memory timelines, and an unguessable private link.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400 hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create a Birthday Surprise</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/templates')}
                className="w-full sm:w-auto px-7 py-4 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 border border-white/15 transition cursor-pointer"
              >
                Explore 10 Templates
              </button>
            </div>

            {/* Micro Social Proof */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Works on WhatsApp & Android</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No App Download Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free to Create & Share</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual / Interactive Card Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Decorative Floating Badges */}
              <div className="absolute -top-4 -left-4 z-20 bg-slate-900/90 border border-amber-400/40 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-2.5 animate-float">
                <span className="text-xl">🎂</span>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white">Interactive Candle</p>
                  <p className="text-[9px] text-amber-300">Tap to blow out!</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 z-20 bg-slate-900/90 border border-pink-400/40 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-2.5 animate-float" style={{ animationDelay: '2s' }}>
                <span className="text-xl">💌</span>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white">Private Guestbook</p>
                  <p className="text-[9px] text-pink-300">Heartfelt guest notes</p>
                </div>
              </div>

              {/* Main Preview Glass Card */}
              <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-purple-950/40 border border-white/15 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
                <div className="text-center space-y-1 mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
                    Live Preview Sample
                  </span>
                  <h3 className="text-xl font-bold text-white font-caveat text-2xl">
                    Happy Birthday, Aarav! 🎉
                  </h3>
                </div>

                {/* Cake component preview */}
                <div className="py-2 flex justify-center">
                  <RealisticBirthdayCake config={sampleCakeConfig} interactive={true} />
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-slate-300 italic font-serif">
                    “You bring sunshine into every room you step into. Wishing you a year of boundless joy!”
                  </p>
                  <p className="text-[11px] font-bold text-amber-300 mt-1">
                    — With love, Rohan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-slate-900/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Simple 3-Step Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              How WishVerse Creates Wonder
            </h2>
            <p className="text-sm text-slate-400">
              No technical skills needed. Design a heartfelt birthday tribute in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 space-y-4 relative group hover:border-amber-400/40 transition">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-black">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Add Memories & Words</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-outfit">
                Upload up to 20 favorite photos or a video memory. Write a deeply personal message, quotes, and reasons why they are amazing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 space-y-4 relative group hover:border-rose-400/40 transition">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl font-black">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Customize Cake & Vibe</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-outfit">
                Choose from 10 distinct themes. Craft an interactive cake with custom flavor, icing drip, toppings, age candle, and cheerful melodies.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 space-y-4 relative group hover:border-purple-400/40 transition">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl font-black">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Share the Magic</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-outfit">
                Get an unguessable private link and printable QR code. Share via WhatsApp or Instagram. They open it and experience a cinematic reveal!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES PREVIEW SHOWCASE */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Curated Aesthetic Themes
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Choose from 10 Magical Templates
            </h2>
          </div>
          <Link
            to="/templates"
            className="text-sm font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 group"
          >
            <span>View All Templates</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BIRTHDAY_TEMPLATES.slice(0, 4).map((template) => (
            <div
              key={template.id}
              onClick={() => navigate(`/create?template=${template.id}`)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-slate-900 border border-white/10 hover:border-amber-400/50 transition-all duration-300 shadow-xl flex flex-col"
            >
              <div className={`h-40 bg-gradient-to-br ${template.previewGradient} p-6 flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${template.accentBadge}`}>
                    {template.tags[0]}
                  </span>
                  <span className="text-lg">✨</span>
                </div>
                <h4 className="text-lg font-bold text-white drop-shadow-md">
                  {template.title}
                </h4>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-semibold text-amber-300 group-hover:underline">
                    Use Template →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 sm:py-24 bg-slate-900/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Packed with Delightful Interactions
            </h2>
            <p className="text-sm text-slate-400">
              Everything you need to deliver an unforgettable milestone moment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Blow-Out Candle Physics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recipients tap the candle flames on their screen; flames extinguish with gentle smoke and trigger a celebratory confetti burst.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Polaroid & Masonry Gallery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload up to 20 high-res photos and video memories with dates and captions. Explore seamlessly in full-screen lightbox.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Scratch Cards & Games</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add an interactive scratch-off secret card, spin the birthday destiny wheel, pop balloons, or gift box reveals.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Guestbook & Reactions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Friends and family can leave heartfelt greetings and tap emoji reactions (❤️, 🎉, 🥹, 😍, 😂) that update in real time.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Safe Audio & Sound Controls</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No jarring autoplay! Recipients safely tap to reveal and enjoy celebratory melodies with intuitive play, pause, and mute toggles.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Private & Secure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Secured by Firebase Authentication and Firestore security rules. Scheduled unlocks, unguessable slugs, and creator management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-white/20 p-8 sm:p-14 space-y-6 shadow-2xl backdrop-blur-xl">
          <span className="text-4xl">🎂</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Ready to give them the best birthday surprise?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-outfit">
            It takes just 3 minutes to turn cherished photos and memories into an everlasting online birthday universe.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/create')}
              className="px-9 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/30 transition cursor-pointer"
            >
              Start Creating Now — It's Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
