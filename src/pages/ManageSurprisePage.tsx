import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  MessageSquare,
  Heart,
  Share2,
  Trash2,
  Lock,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Power,
  RotateCcw,
  Calendar,
  LogIn,
} from 'lucide-react';
import { BirthdaySurprise, GuestbookEntry } from '../types/birthday';
import {
  getSurpriseBySlug,
  updateSurprise,
  softDeleteSurprise,
  permanentDeleteSurprise,
  subscribeToGuestbook,
  deleteGuestbookEntry,
} from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';
import { ShareActions } from '../components/share/ShareActions';

export const ManageSurprisePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, signInWithGoogle, guestId, isMySurprise } = useAuth();

  const [surprise, setSurprise] = useState<BirthdaySurprise | null>(null);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const loadData = async () => {
      try {
        const found = await getSurpriseBySlug(slug);
        setSurprise(found);
      } catch (err) {
        console.error('Error fetching surprise for management:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  // Subscribe to guestbook messages
  useEffect(() => {
    if (!surprise?.id) return;
    const unsubscribe = subscribeToGuestbook(
      surprise.id,
      (entries) => setGuestbookEntries(entries),
      (err) => console.warn('Guestbook sync error:', err)
    );
    return () => unsubscribe();
  }, [surprise?.id]);

  const toggleActiveStatus = async () => {
    if (!surprise?.id) return;
    const nextStatus = !surprise.isActive;
    try {
      await updateSurprise(surprise.id, { isActive: nextStatus });
      setSurprise({ ...surprise, isActive: nextStatus });
      setActionNotice(nextStatus ? 'Surprise is now ACTIVE and visible to recipients.' : 'Surprise has been DEACTIVATED.');
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const toggleGuestbook = async () => {
    if (!surprise?.id) return;
    const nextGb = !surprise.guestbookEnabled;
    try {
      await updateSurprise(surprise.id, { guestbookEnabled: nextGb });
      setSurprise({ ...surprise, guestbookEnabled: nextGb });
      setActionNotice(nextGb ? 'Visitor guestbook enabled.' : 'Visitor guestbook disabled.');
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      console.error('Failed to toggle guestbook:', err);
    }
  };

  const handleDeleteSurprise = async () => {
    if (!surprise?.id) return;
    if (!window.confirm('Are you sure you want to permanently delete this birthday surprise? This action cannot be undone.')) {
      return;
    }

    try {
      await permanentDeleteSurprise(surprise.id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete surprise:', err);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!surprise?.id) return;
    try {
      await deleteGuestbookEntry(surprise.id, entryId);
    } catch (err) {
      console.error('Failed to delete guestbook entry:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin" />
        <p className="text-xs text-slate-400 font-semibold">Loading management dashboard...</p>
      </div>
    );
  }

  if (!surprise) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Surprise Not Found</h2>
          <Link to="/" className="text-xs text-amber-300 underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const isOwner = (user && user.uid === surprise.ownerId) || (guestId && surprise.ownerId === guestId) || isMySurprise(surprise.slug, surprise.ownerId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Ownership Alert if not signed in or not matching */}
        {!isOwner && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>You are viewing in preview mode. Sign in as the creator to modify settings.</span>
            </div>
            {!user && (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition cursor-pointer shrink-0"
              >
                Sign In
              </button>
            )}
          </div>
        )}

        {actionNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${surprise.isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                {surprise.isActive ? 'Active Surprise' : 'Archived / Inactive'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {surprise.recipientName}'s Birthday Universe 🎉
            </h1>
            <p className="text-xs text-slate-400">
              Created by {surprise.senderName} • Slug: <code className="text-amber-300">{surprise.slug}</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/surprise/${surprise.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" /> Open Public Page
            </a>
          </div>
        </div>

        {/* STATS METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Total Opens</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{surprise.viewCount || 0}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <MessageSquare className="w-4 h-4 text-pink-400" />
              <span>Guest Messages</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{guestbookEntries.length}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Reactions</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {Object.values(surprise.reactions || {}).reduce((a, b) => a + b, 0)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Memories</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {surprise.memories?.length || 0}
            </p>
          </div>
        </div>

        {/* SHARING & PROMOTION HUB */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            Share & QR Code Actions
          </h2>
          <ShareActions slug={surprise.slug} recipientName={surprise.recipientName} senderName={surprise.senderName} />
        </div>

        {/* OWNER CONTROLS & MANAGEMENT */}
        {isOwner && (
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white">Creator Controls</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/80 border border-white/10">
                <div>
                  <p className="text-sm font-semibold text-white">Active Visibility</p>
                  <p className="text-xs text-slate-400">
                    {surprise.isActive ? 'Page is accessible via link' : 'Page is paused / hidden'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleActiveStatus}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    surprise.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {surprise.isActive ? 'Active' : 'Paused'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/80 border border-white/10">
                <div>
                  <p className="text-sm font-semibold text-white">Visitor Guestbook</p>
                  <p className="text-xs text-slate-400">
                    {surprise.guestbookEnabled ? 'Visitors can post wishes' : 'Guestbook is disabled'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleGuestbook}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    surprise.guestbookEnabled
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {surprise.guestbookEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            {/* Guestbook Moderation */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-pink-400" />
                Moderate Guestbook Entries ({guestbookEntries.length})
              </h3>

              {guestbookEntries.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No guest messages yet.</p>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {guestbookEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-800 border border-white/10 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-white">{entry.authorName}: </span>
                        <span className="text-slate-300">{entry.message}</span>
                      </div>
                      {entry.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(entry.id!)}
                          title="Delete spam/unwanted entry"
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-rose-500/20 space-y-3">
              <h3 className="text-sm font-bold text-rose-400">Danger Zone</h3>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <div>
                  <p className="text-xs font-semibold text-rose-200">Permanently Delete Surprise</p>
                  <p className="text-[11px] text-rose-300/70">
                    Immediately remove this birthday surprise and all guestbook entries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteSurprise}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Delete Surprise
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
