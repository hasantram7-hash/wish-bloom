import React, { useState, useEffect } from 'react';
import { Send, Heart, Trash2, MessageSquare, AlertCircle, Smile } from 'lucide-react';
import { GuestbookEntry } from '../../types/birthday';
import { addGuestbookEntry, subscribeToGuestbook, deleteGuestbookEntry } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';

interface GuestbookProps {
  surpriseId: string;
  isOwner?: boolean;
  accentColor?: string;
}

const EMOJI_OPTIONS = ['🎂', '💖', '🎉', '🌟', '🥳', '💐', '🥂', '✨'];

export const Guestbook: React.FC<GuestbookProps> = ({
  surpriseId,
  isOwner = false,
  accentColor = '#EC4899',
}) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [authorName, setAuthorName] = useState(user?.displayName || '');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎉');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastPostedAt, setLastPostedAt] = useState<number>(0);

  useEffect(() => {
    if (user?.displayName && !authorName) {
      setAuthorName(user.displayName);
    }
  }, [user]);

  // Real-time guestbook subscription
  useEffect(() => {
    if (!surpriseId) return;
    const unsubscribe = subscribeToGuestbook(
      surpriseId,
      (fetchedEntries) => setEntries(fetchedEntries),
      (err) => console.warn('Guestbook subscription issue:', err)
    );
    return () => unsubscribe();
  }, [surpriseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Rate-limiting cooldown: 15 seconds
    const now = Date.now();
    if (now - lastPostedAt < 15000) {
      setErrorMsg('Please wait a few seconds before posting another birthday wish.');
      return;
    }

    if (!authorName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    if (!message.trim() || message.trim().length > 300) {
      setErrorMsg('Please write a message between 1 and 300 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await addGuestbookEntry(surpriseId, {
        authorId: user?.uid || 'guest_visitor',
        authorName: authorName.trim(),
        message: message.trim(),
        emoji: selectedEmoji,
      });

      setMessage('');
      setLastPostedAt(now);
    } catch (err: unknown) {
      console.error('Failed to post guestbook message:', err);
      setErrorMsg('Could not submit wish. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!window.confirm('Are you sure you want to remove this birthday greeting?')) return;
    try {
      await deleteGuestbookEntry(surpriseId, entryId);
    } catch (err) {
      console.error('Failed to delete guestbook entry:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Post Greeting Form */}
      <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-pink-400" />
          Leave a Birthday Wish
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Your Name (e.g. Priyanshu)"
              maxLength={50}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-400"
            />

            {/* Quick Emoji Picker */}
            <div className="flex items-center gap-1 bg-slate-800/80 border border-white/10 rounded-xl p-1.5 overflow-x-auto">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition ${
                    selectedEmoji === emoji
                      ? 'bg-pink-500/30 border border-pink-400 scale-110'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              maxLength={300}
              placeholder="Write a sweet birthday memory, prayer, or compliment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 resize-none"
            />
            <span className="absolute bottom-3 right-3 text-[11px] text-slate-500">
              {message.length}/300
            </span>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 shadow-lg shadow-pink-500/20 active:scale-95 disabled:opacity-50 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Post Wish'}
            </button>
          </div>
        </form>
      </div>

      {/* Guestbook Greetings List */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-2xl bg-white/5 border border-white/10">
            <Smile className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium">No guestbook messages yet.</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Be the first to leave birthday love and good vibes!
            </p>
          </div>
        ) : (
          entries.map((entry) => {
            const canDelete = isOwner || (user?.uid && entry.authorId === user.uid);
            return (
              <div
                key={entry.id}
                className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-lg shrink-0">
                    {entry.emoji || '🎂'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-white text-sm truncate">
                        {entry.authorName}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mt-1 break-words leading-relaxed font-outfit">
                      {entry.message}
                    </p>
                  </div>
                </div>

                {canDelete && entry.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id!)}
                    title="Delete wish"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
