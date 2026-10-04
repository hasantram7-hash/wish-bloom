import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Share2, Volume2, VolumeX } from 'lucide-react';
import { BirthdaySurprise } from '../../types/birthday';
import { RealisticCakeConfig } from '../../types/cake';
import { CakeScene } from '../cake/CakeScene';
import { ShareActions } from '../share/ShareActions';
import './BirthdayWrapped.css';

type WrappedSlide = 'intro' | 'age' | 'reasons' | 'memories' | 'vibe' | 'message' | 'cake' | 'finale';

interface BirthdayWrappedProps {
  surprise: BirthdaySurprise;
  cakeConfig: RealisticCakeConfig;
  audioPlaying: boolean;
  onOpened: () => void;
  onToggleAudio: () => void;
  onCandlesBlown: () => void;
}

const REASON_FALLBACKS = [
  (name: string) => `${name} makes every room feel brighter.`,
  () => 'You show up for the people you love, every single time.',
  () => 'Your laugh should honestly have its own soundtrack.',
  () => 'You turn ordinary days into our favorite memories.',
  () => 'The world is better, kinder, and more fun with you in it.',
];

const STICKERS = ['🎂', '🎉', '✨', '💖', '🔥'];
const CONFETTI_COLORS = ['#FF4D8D', '#FFD60A', '#B6FF3B', '#00E5C3', '#A78BFA'];

export const BirthdayWrapped: React.FC<BirthdayWrappedProps> = ({
  surprise,
  cakeConfig,
  audioPlaying,
  onOpened,
  onToggleAudio,
  onCandlesBlown,
}) => {
  const photos = (surprise.memories || []).filter((memory) => memory.type === 'image' && memory.downloadUrl);
  const slides: WrappedSlide[] = photos.length
    ? ['intro', 'age', 'reasons', 'memories', 'vibe', 'message', 'cake', 'finale']
    : ['intro', 'age', 'reasons', 'vibe', 'message', 'cake', 'finale'];
  const reasons = (surprise.reasons || []).filter(Boolean).slice(0, 5);
  while (reasons.length < 5) reasons.push(REASON_FALLBACKS[reasons.length](surprise.recipientName));
  const recipientName = surprise.recipientNickname || surprise.recipientName;
  const realAge = typeof surprise.cake?.age === 'number' ? surprise.cake.age : null;
  const message = surprise.message || `Happy Birthday, ${recipientName}! You are absolutely iconic.`;

  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ageCount, setAgeCount] = useState(0);
  const [typedCharacters, setTypedCharacters] = useState(0);
  const [wishMade, setWishMade] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const ignoreClickRef = useRef(false);
  const didOpenRef = useRef(false);

  const activeSlide = slides[slideIndex];
  const isFinale = activeSlide === 'finale';

  useEffect(() => {
    if (didOpenRef.current) return;
    didOpenRef.current = true;
    onOpened();
  }, [onOpened]);

  useEffect(() => {
    if (paused || shareOpen || isFinale) return;
    const timeout = window.setTimeout(() => {
      setSlideIndex((index) => Math.min(index + 1, slides.length - 1));
    }, 6000);
    return () => window.clearTimeout(timeout);
  }, [slideIndex, paused, shareOpen, isFinale, slides.length]);

  useEffect(() => {
    if (activeSlide !== 'age') return;
    setAgeCount(0);
    if (realAge === null || realAge <= 0) return;
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / 1400);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAgeCount(Math.min(realAge, Math.ceil(realAge * eased)));
      if (progress >= 1) window.clearInterval(interval);
    }, 32);
    return () => window.clearInterval(interval);
  }, [activeSlide, realAge]);

  useEffect(() => {
    if (activeSlide !== 'message') {
      setTypedCharacters(0);
      return;
    }
    setTypedCharacters(0);
    let count = 0;
    const interval = window.setInterval(() => {
      count += 1;
      setTypedCharacters(count);
      if (count >= message.length) window.clearInterval(interval);
    }, 20);
    return () => window.clearInterval(interval);
  }, [activeSlide, message]);

  useEffect(() => {
    if (activeSlide === 'cake') setWishMade(false);
  }, [activeSlide]);

  useEffect(() => () => {
    if (holdTimerRef.current !== null) window.clearTimeout(holdTimerRef.current);
  }, []);

  const goToSlide = (index: number) => {
    setSlideIndex(Math.max(0, Math.min(index, slides.length - 1)));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest('button, a, input, textarea, select, .bw-cake-interaction, .bw-share-sheet')) return;
    isHoldingRef.current = false;
    holdTimerRef.current = window.setTimeout(() => {
      isHoldingRef.current = true;
      setPaused(true);
    }, 250);
  };

  const handlePointerUp = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      ignoreClickRef.current = true;
      setPaused(false);
      window.setTimeout(() => { ignoreClickRef.current = false; }, 0);
    }
  };

  const handleStoryTap = (event: React.MouseEvent<HTMLDivElement>) => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    if ((event.target as Element).closest('button, a, input, textarea, select, .bw-cake-interaction, .bw-share-sheet')) return;
    const phoneBounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX >= phoneBounds.left + phoneBounds.width / 2) goToSlide(slideIndex + 1);
    else goToSlide(slideIndex - 1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest('button, a, input, textarea, select, .bw-share-sheet')) return;
    if (event.key === 'ArrowRight') goToSlide(slideIndex + 1);
    if (event.key === 'ArrowLeft') goToSlide(slideIndex - 1);
    if (event.key === ' ' && !isFinale) {
      event.preventDefault();
      setPaused((value) => !value);
    }
  };

  const firstPhoto = photos[0];
  const candleBlownOut = () => {
    setWishMade(true);
    onCandlesBlown();
  };

  return (
    <div className="theme-wrapped">
      <div
        className={`bw-phone ${paused ? 'is-paused' : ''}`}
        onClick={handleStoryTap}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={`Birthday Wrapped story. Slide ${slideIndex + 1} of ${slides.length}.`}
      >
        <div className="bw-grain" aria-hidden="true" />
        <div className="bw-stickers" aria-hidden="true">
          {STICKERS.map((sticker, index) => <span key={sticker} className={`bw-sticker bw-sticker-${index + 1}`}>{sticker}</span>)}
        </div>

        <div className="bw-progress" key={activeSlide} aria-label={`Slide ${slideIndex + 1} of ${slides.length}`}>
          {slides.map((slide, index) => (
            <span className="bw-progress-track" key={slide}>
              <span className={`bw-progress-fill ${index < slideIndex ? 'is-complete' : ''} ${index === slideIndex ? 'is-active' : ''}`} />
            </span>
          ))}
        </div>

        <main className={`bw-slide bw-slide-${activeSlide}`} key={activeSlide}>
          {activeSlide === 'intro' && (
            <section className="bw-intro" aria-label="Birthday Wrapped introduction">
              <div className="bw-confetti" aria-hidden="true">
                {Array.from({ length: 28 }, (_, index) => (
                  <i key={index} style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 9) * -0.17}s`, backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length], rotate: `${(index * 47) % 160}deg` }} />
                ))}
              </div>
              <span className="bw-kicker">Your year in wonderful</span>
              <h1><span>{recipientName},</span> your Birthday <strong>Wrapped</strong> is here</h1>
              <div className="bw-hero-sticker" aria-hidden="true">🎂</div>
              <p>{slides.length} slides. One very iconic human.</p>
            </section>
          )}

          {activeSlide === 'age' && (
            <section className="bw-age" aria-label="Age celebration">
              <span className="bw-kicker">The birthday edition</span>
              <div className="bw-age-number" key={ageCount}>{realAge === null ? '—' : ageCount}</div>
              <h1>years of being<br /><strong>absolutely iconic</strong></h1>
              <span className="bw-age-sparkle" aria-hidden="true">✦</span>
            </section>
          )}

          {activeSlide === 'reasons' && (
            <section className="bw-reasons" aria-label="Top five reasons we love you">
              <span className="bw-kicker">The fan club agrees</span>
              <h1>Top 5 reasons<br />we love <strong>{recipientName}</strong></h1>
              <ol>
                {reasons.map((reason, index) => (
                  <li key={`${index}-${reason}`} style={{ animationDelay: `${index * 100}ms` }}>
                    <span>{String(index + 1).padStart(2, '0')}</span><p>{reason}</p><b aria-hidden="true">♥</b>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {activeSlide === 'memories' && (
            <section className="bw-memories" aria-label="Birthday memories">
              <span className="bw-kicker">The camera roll says it all</span>
              <h1>Core memories</h1>
              <div className="bw-polaroids">
                {photos.slice(0, 5).map((photo, index) => (
                  <figure key={photo.id} className={`bw-polaroid bw-polaroid-${index + 1}`} style={{ animationDelay: `${index * 110}ms` }}>
                    <img src={photo.downloadUrl} alt={photo.caption || `A favorite memory with ${recipientName}`} loading="lazy" />
                    <figcaption>{photo.caption || surprise.recipientName}</figcaption>
                  </figure>
                ))}
              </div>
              <p>Some moments just deserve a replay.</p>
            </section>
          )}

          {activeSlide === 'vibe' && (
            <section className="bw-vibe" aria-label="Birthday vibe score">
              <span className="bw-kicker">The official vibe report</span>
              <div className="bw-meter-wrap">
                <svg className="bw-meter" viewBox="0 0 180 180" role="img" aria-label="Vibe score 100 percent">
                  <circle className="bw-meter-track" cx="90" cy="90" r="76" />
                  <circle className="bw-meter-value" cx="90" cy="90" r="76" />
                </svg>
                <div className="bw-meter-copy"><strong>100<span>%</span></strong><small>vibe score</small></div>
              </div>
              <h1>Certified Legend <span aria-hidden="true">👑</span></h1>
              <div className="bw-stats">
                <p><span>Smile level</span><strong>Maximum</strong></p>
                <p><span>Kindness</span><strong>Infinite</strong></p>
                <p><span>Drama</span><strong>0%</strong></p>
              </div>
            </section>
          )}

          {activeSlide === 'message' && (
            <section className="bw-message" aria-label="Birthday message">
              <span className="bw-kicker">A note from {surprise.senderName}</span>
              <article className="bw-message-card">
                <span className="bw-message-mark" aria-hidden="true">“</span>
                <p aria-hidden="true">{message.slice(0, typedCharacters)}<i className="bw-caret" /></p>
                <span className="bw-sr-only">{message}</span>
                <footer>— With love, <strong>{surprise.senderName}</strong></footer>
              </article>
            </section>
          )}

          {activeSlide === 'cake' && (
            <section className="bw-cake" aria-label="Birthday cake and candle wish">
              <div className="bw-cake-heading"><span className="bw-kicker">One last birthday wish</span><h1>Make it count.</h1></div>
              <div className="bw-cake-interaction">
                <CakeScene config={cakeConfig} recipientName={recipientName} onCandlesBlown={candleBlownOut} reward={cakeConfig.memorySliceReward} />
              </div>
              {wishMade && <p className="bw-wish-made" role="status">Make a wish 🌠</p>}
            </section>
          )}

          {activeSlide === 'finale' && (
            <section className="bw-finale" aria-label="Birthday Wrapped finale">
              <span className="bw-kicker">The year ahead is yours</span>
              <div className="bw-wrap-icon" aria-hidden="true">✨</div>
              <h1>That&apos;s a<br /><strong>wrap!</strong></h1>
              <p>{recipientName}, keep being your one-of-one self.</p>
              <div className="bw-finale-actions">
                <button type="button" className="bw-replay-button" onClick={() => goToSlide(0)}><RotateCcw aria-hidden="true" /> Replay</button>
                <button type="button" className="bw-share-button" onClick={() => setShareOpen(true)}><Share2 aria-hidden="true" /> Share</button>
              </div>
              <div className="bw-music-bar">
                <div className={`bw-album-art ${audioPlaying ? 'is-playing' : ''}`}>
                  {firstPhoto ? <img src={firstPhoto.downloadUrl} alt="" loading="lazy" /> : <span aria-hidden="true">🎧</span>}
                </div>
                <div className="bw-track-copy"><strong>Birthday Wrapped</strong><small>{surprise.music.enabled ? 'A little birthday soundtrack' : 'No soundtrack added'}</small></div>
                <button type="button" onClick={onToggleAudio} disabled={!surprise.music.enabled} aria-label={audioPlaying ? 'Pause birthday music' : 'Play birthday music'}>
                  {audioPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                </button>
              </div>
            </section>
          )}
        </main>

        <div className="bw-bottom-row">
          <span className="bw-slide-count">{String(slideIndex + 1).padStart(2, '0')} <i>/</i> {String(slides.length).padStart(2, '0')}</span>
          <button type="button" className="bw-audio-button" onClick={onToggleAudio} disabled={!surprise.music.enabled} aria-label={audioPlaying ? 'Mute birthday music' : 'Unmute birthday music'}>
            {audioPlaying ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
            <span>{audioPlaying ? 'Mute' : 'Sound'}</span>
          </button>
          {!isFinale && <span className="bw-tap-hint"><ChevronLeft aria-hidden="true" /><ChevronRight aria-hidden="true" /> tap to move</span>}
        </div>

        {paused && <div className="bw-paused-label" role="status">Paused</div>}

        {shareOpen && (
          <div className="bw-share-backdrop" role="presentation" onClick={() => setShareOpen(false)}>
            <section className="bw-share-sheet" role="dialog" aria-modal="true" aria-label="Share birthday surprise" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="bw-share-close" onClick={() => setShareOpen(false)} aria-label="Close share options">×</button>
              <h2>Share the birthday love</h2>
              <ShareActions slug={surprise.slug} recipientName={surprise.recipientName} senderName={surprise.senderName} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};