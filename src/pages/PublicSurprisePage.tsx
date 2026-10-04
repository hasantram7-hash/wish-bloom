import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Clock, AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { BirthdaySurprise } from '../types/birthday';
import { getSurpriseBySlug, subscribeToSurprise, getSurpriseExpiryStatus } from '../services/firestoreService';
import { BirthdayReveal } from '../components/surprise/BirthdayReveal';

export const PublicSurprisePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [surprise, setSurprise] = useState<BirthdaySurprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const loadSurprise = useCallback(async () => {
    if (!slug) {
      setError('Surprise link is invalid.');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const found = await getSurpriseBySlug(slug);
      if (!found) {
        setError('This birthday surprise could not be found. Please double check the link or check back in a moment.');
        setLoading(false);
        return;
      }

      setSurprise(found);
      setLoading(false);

      // Check scheduled unlock countdown
      if (found.specialSettings?.scheduledUnlockAt) {
        const unlockTime = new Date(found.specialSettings.scheduledUnlockAt).getTime();
        const now = Date.now();
        if (unlockTime > now) {
          const diffSec = Math.floor((unlockTime - now) / 1000);
          const hours = Math.floor(diffSec / 3600);
          const mins = Math.floor((diffSec % 3600) / 60);
          setTimeRemaining(`${hours}h ${mins}m`);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to load surprise:', err);
      setError('Unable to load surprise. Please check your internet connection and try again.');
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadSurprise();

    let unsubscribe: (() => void) | undefined;
    if (slug) {
      unsubscribe = subscribeToSurprise(slug, (updated) => {
        setSurprise(updated);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [slug, loadSurprise]);

  const handleRetry = async () => {
    setRetrying(true);
    await loadSurprise();
    setRetrying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin" />
        <p className="text-sm font-semibold text-amber-200">
          Gathering birthday stardust & memories... ✨
        </p>
      </div>
    );
  }

  // Not found error state with 1-click retry
  if (error || !surprise) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Surprise Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error || 'This birthday surprise could not be found. Please double check the link.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Checking again...' : 'Tap to Retry'}
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              <Home className="w-3.5 h-3.5" /> Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check 24-Hour Expiration
  const expiry = getSurpriseExpiryStatus(surprise);
  if (expiry.isExpired) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto">
            ⏳
          </div>
          <h2 className="text-xl font-bold text-white">Birthday Surprise Expired</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-outfit">
            This magical birthday surprise for <strong>{surprise.recipientName}</strong> was available for a 24-hour celebration window and has now ended.
          </p>
          <p className="text-[11px] text-amber-300 font-medium">
            Created with love by {surprise.senderName} • Made with ❤️ by RAM
          </p>
          <div className="pt-2">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-slate-950 transition shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" /> Create a New Surprise →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Soft-deleted / inactive state
  if (!surprise.isActive) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full space-y-4 shadow-2xl">
          <span className="text-4xl">💌</span>
          <h2 className="text-xl font-bold text-white">Memory Lovingly Archived</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-outfit">
            This birthday memory has been lovingly archived by {surprise.senderName}.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
            >
              Create a New Surprise →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Scheduled unlock in the future
  if (timeRemaining) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 max-w-md w-full space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto animate-pulse">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Your Surprise Unlocks Soon!</h2>
            <p className="text-xs text-slate-400">
              A special birthday universe prepared by {surprise.senderName} is counting down.
            </p>
          </div>
          <div className="bg-slate-950/80 border border-white/10 py-3 px-6 rounded-2xl font-mono text-2xl font-bold text-amber-400 tracking-wider">
            {timeRemaining}
          </div>
        </div>
      </div>
    );
  }

  // Render the full birthday experience
  return <BirthdayReveal surprise={surprise} remainingTimeStr={expiry.formattedRemaining} />;
};
