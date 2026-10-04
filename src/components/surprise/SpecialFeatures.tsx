import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, HelpCircle, Trophy, RefreshCw } from 'lucide-react';
import { SpecialSettings } from '../../types/birthday';

interface SpecialFeaturesProps {
  specialSettings: SpecialSettings;
  accentColor?: string;
}

export const SpecialFeatures: React.FC<SpecialFeaturesProps> = ({
  specialSettings,
  accentColor = '#F59E0B',
}) => {
  return (
    <div className="w-full space-y-10 my-8">
      {/* 1. Balloon Popping Game */}
      {specialSettings.balloonGameEnabled && <BalloonGame />}

      {/* 2. Scratch Card */}
      {specialSettings.scratchCardEnabled && (
        <ScratchCard text={specialSettings.scratchRevealText || 'You make every day brighter! 💖'} />
      )}

      {/* 3. Birthday Wish Wheel */}
      {specialSettings.birthdayWheelEnabled && <BirthdayWheel />}

      {/* 4. Gift Reveal */}
      {specialSettings.giftEnabled && specialSettings.giftDetails && (
        <GiftReveal gift={specialSettings.giftDetails} />
      )}

      {/* 5. Birthday Quiz */}
      {specialSettings.quizEnabled && specialSettings.quizQuestions && specialSettings.quizQuestions.length > 0 && (
        <BirthdayQuiz questions={specialSettings.quizQuestions} />
      )}
    </div>
  );
};

/* --- BALLOON POPPING GAME --- */
const BALLOON_WORDS = ['Joy', 'Love', 'Laughter', 'Health', 'Magic', 'Adventure', 'Bliss', 'Dream'];
const BALLOON_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const BalloonGame: React.FC = () => {
  const [balloons, setBalloons] = useState(
    BALLOON_WORDS.map((word, i) => ({
      id: i,
      word,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      popped: false,
    }))
  );

  const popBalloon = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 text-center shadow-xl">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
        <span>🎈</span> Pop the Birthday Balloons!
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Tap each floating balloon to release a special birthday blessing
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {balloons.map((b) => (
          <div key={b.id} className="flex flex-col items-center">
            {!b.popped ? (
              <button
                type="button"
                onClick={() => popBalloon(b.id)}
                className="w-14 h-18 sm:w-16 sm:h-20 rounded-full cursor-pointer hover:scale-110 active:scale-90 transition-transform shadow-lg relative flex items-center justify-center animate-bounce"
                style={{
                  backgroundColor: b.color,
                  borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                  animationDuration: `${2.5 + (b.id % 3) * 0.5}s`,
                }}
              >
                <div className="w-2.5 h-4 bg-white/40 rounded-full absolute top-3 left-3 transform -rotate-45" />
                <span className="text-[10px] text-white/90 font-bold">Pop!</span>
              </button>
            ) : (
              <div className="w-14 h-18 sm:w-16 sm:h-20 flex flex-col items-center justify-center animate-scale-in">
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/30">
                  ✨ {b.word}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- SCRATCH CARD --- */
const ScratchCard: React.FC<{ text: string }> = ({ text }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with metallic silver scratch coating
    ctx.fillStyle = '#64748B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here with touch or mouse 🎁', canvas.width / 2, canvas.height / 2 + 5);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    setScratchedPercent((prev) => {
      const next = prev + 3;
      if (next >= 40 && !isRevealed) {
        setIsRevealed(true);
        confetti({ particleCount: 35, spread: 60 });
      }
      return next;
    });
  };

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 text-center shadow-xl max-w-md mx-auto">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-400" />
        Mystery Scratch Card
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Scratch the coating below to reveal a secret note written just for you!
      </p>

      <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-white/20 flex items-center justify-center bg-gradient-to-r from-amber-500/20 to-rose-500/20">
        {/* Hidden Content Beneath */}
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <p className="text-base sm:text-lg font-bold text-amber-200 font-caveat tracking-wide">
            {text}
          </p>
        </div>

        {/* Scratch Canvas */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            width={350}
            height={130}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            onMouseMove={(e) => {
              if (e.buttons === 1) scratch(e.clientX, e.clientY);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              scratch(touch.clientX, touch.clientY);
            }}
          />
        )}
      </div>
    </div>
  );
};

/* --- BIRTHDAY WHEEL --- */
const WISH_SLICES = [
  'Infinite Joy 🌟',
  'Grand Success 🏆',
  'Deep Love ❤️',
  'Radiant Health 🌿',
  'Wild Adventures ✈️',
  'Inner Peace 🕊️',
];

const BirthdayWheel: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);

    const randomIndex = Math.floor(Math.random() * WISH_SLICES.length);
    const extraRounds = 5 * 360;
    const sliceAngle = 360 / WISH_SLICES.length;
    const targetDeg = extraRounds + (WISH_SLICES.length - 1 - randomIndex) * sliceAngle + sliceAngle / 2;

    setRotation((prev) => prev + targetDeg);

    setTimeout(() => {
      setWinner(WISH_SLICES[randomIndex]);
      setSpinning(false);
      confetti({ particleCount: 50, spread: 70 });
    }, 3500);
  };

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 text-center shadow-xl max-w-sm mx-auto">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
        <RefreshCw className={`w-5 h-5 text-amber-400 ${spinning ? 'animate-spin' : ''}`} />
        Spin the Birthday Wheel!
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Give the wheel a spin to unlock your special destiny wish for this year.
      </p>

      <div className="relative w-48 h-48 mx-auto mb-6">
        {/* Wheel Indicator Pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-amber-400 drop-shadow" />

        {/* Wheel SVG */}
        <div
          className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl transition-transform duration-[3500ms] ease-out overflow-hidden"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {WISH_SLICES.map((_, i) => {
              const angle = (360 / WISH_SLICES.length) * i;
              const colors = ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6', '#F43F5E'];
              return (
                <path
                  key={i}
                  d={`M 50 50 L ${50 + 50 * Math.cos((angle * Math.PI) / 180)} ${
                    50 + 50 * Math.sin((angle * Math.PI) / 180)
                  } A 50 50 0 0 1 ${
                    50 + 50 * Math.cos(((angle + 60) * Math.PI) / 180)
                  } ${50 + 50 * Math.sin(((angle + 60) * Math.PI) / 180)} Z`}
                  fill={colors[i]}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {winner && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-bold text-sm animate-fade-in">
          🎉 Destiny Wish: {winner}
        </div>
      )}

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>
    </div>
  );
};

/* --- GIFT REVEAL --- */
const GiftReveal: React.FC<{ gift: { title: string; description: string; imageUrl?: string; externalLink?: string } }> = ({
  gift,
}) => {
  const [unwrapped, setUnwrapped] = useState(false);

  const handleUnwrap = () => {
    if (!unwrapped) {
      setUnwrapped(true);
      confetti({ particleCount: 60, spread: 80 });
    }
  };

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 text-center shadow-xl max-w-md mx-auto">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
        <Gift className="w-5 h-5 text-rose-400" />
        A Surprise Gift for You!
      </h3>

      {!unwrapped ? (
        <div
          onClick={handleUnwrap}
          className="cursor-pointer my-4 p-8 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/40 hover:scale-105 transition-transform flex flex-col items-center justify-center group"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <Gift className="w-9 h-9" />
          </div>
          <p className="text-sm font-semibold text-white mt-4">
            Tap to unwrap your birthday present! 🎀
          </p>
        </div>
      ) : (
        <div className="my-4 p-6 rounded-2xl bg-white/10 border border-white/20 animate-scale-in text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-white">{gift.title}</h4>
          <p className="text-sm text-slate-300 leading-relaxed font-outfit">{gift.description}</p>
          {gift.imageUrl && (
            <img src={gift.imageUrl} alt={gift.title} className="rounded-xl max-h-48 mx-auto object-cover" />
          )}
          {gift.externalLink && (
            <a
              href={gift.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition mt-2"
            >
              Claim / View Gift Online →
            </a>
          )}
        </div>
      )}
    </div>
  );
};

/* --- BIRTHDAY QUIZ --- */
const BirthdayQuiz: React.FC<{
  questions: Array<{ question: string; options: string[]; answerIndex: number; hint?: string }>;
}> = ({ questions }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQ.answerIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setCompleted(true);
      confetti({ particleCount: 40, spread: 60 });
    }
  };

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 text-center shadow-xl max-w-md mx-auto">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
        <HelpCircle className="w-5 h-5 text-indigo-400" />
        How Well Do You Know Us? Quiz
      </h3>

      {!completed ? (
        <div className="space-y-4 text-left mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>

          <p className="text-sm font-semibold text-white">{currentQ.question}</p>

          <div className="space-y-2">
            {currentQ.options.map((opt, optIdx) => {
              let btnStyle = 'bg-slate-800 border-white/10 text-slate-200 hover:border-white/30';
              if (selectedOption !== null) {
                if (optIdx === currentQ.answerIndex) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                } else if (optIdx === selectedOption) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelect(optIdx)}
                  className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-medium text-left transition ${btnStyle} cursor-pointer`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition hover:bg-amber-400 cursor-pointer mt-2"
            >
              {currentIdx + 1 < questions.length ? 'Next Question →' : 'See Quiz Results!'}
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2 animate-fade-in mt-4">
          <p className="text-xl font-bold">🎉 Quiz Complete!</p>
          <p className="text-sm">
            You scored {score} out of {questions.length}! You truly are the best.
          </p>
        </div>
      )}
    </div>
  );
};
