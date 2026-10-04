import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Copy,
  Check,
  MessageCircle,
  Share2,
  QrCode,
  Download,
  ExternalLink,
  Instagram,
  Send,
  Mail,
  MessageSquare,
  Sparkles,
  Heart,
  X,
} from 'lucide-react';
import { getSurpriseShareUrl } from '../../lib/appUrl';

interface ShareActionsProps {
  slug: string;
  recipientName: string;
  senderName?: string;
  customShareUrl?: string;
  className?: string;
}

export const ShareActions: React.FC<ShareActionsProps> = ({
  slug,
  recipientName,
  senderName = 'Someone special',
  customShareUrl,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [instagramModalOpen, setInstagramModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const fullShareUrl = customShareUrl || getSurpriseShareUrl(slug);
  
  // Custom pre-filled messages with "Made with ❤️ by RAM"
  const shareMessage = `🎂 Hey! I created a magical birthday surprise for ${recipientName}! ✨\nOpen your birthday universe here: ${fullShareUrl}\n\n🎈 Created with WishVerse • Made with ❤️ by RAM`;
  const instagramCaption = `Happy Birthday ${recipientName}! 🎂✨ A special birthday surprise created just for you! Check it out here: ${fullShareUrl} (Link in bio/story) • Made with ❤️ by RAM`;

  useEffect(() => {
    QRCode.toDataURL(fullShareUrl, {
      width: 360,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [fullShareUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(instagramCaption);
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Birthday Surprise for ${recipientName}! 🎉`,
          text: `A magical birthday surprise created for ${recipientName}! ✨ Made with ❤️ by RAM`,
          url: fullShareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareMessage);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const textEncoded = encodeURIComponent(`🎂 Birthday Surprise for ${recipientName}! ✨ Made with ❤️ by RAM`);
    const urlEncoded = encodeURIComponent(fullShareUrl);
    const tgUrl = `https://t.me/share/url?url=${urlEncoded}&text=${textEncoded}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const urlEncoded = encodeURIComponent(fullShareUrl);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const textEncoded = encodeURIComponent(
      `🎂 A magical birthday surprise for ${recipientName}! Open it here: ${fullShareUrl} ✨ Made with ❤️ by RAM #BirthdaySurprise #WishVerse`
    );
    const twUrl = `https://twitter.com/intent/tweet?text=${textEncoded}`;
    window.open(twUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSmsShare = () => {
    const encoded = encodeURIComponent(shareMessage);
    window.location.href = `sms:?&body=${encoded}`;
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`🎂 A Birthday Surprise for ${recipientName}!`);
    const body = encodeURIComponent(shareMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const downloadQrCode = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `wishverse-qr-${recipientName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Share URL Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-900/90 border border-white/10 rounded-2xl shadow-lg">
        <input
          type="text"
          readOnly
          value={fullShareUrl}
          className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-300 focus:outline-none select-all font-mono truncate"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 cursor-pointer shrink-0 shadow-md shadow-amber-500/20"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-950 stroke-[3]" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy Link
            </>
          )}
        </button>
      </div>

      {/* Share Destination Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* WhatsApp Share */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition active:scale-95 shadow-lg shadow-emerald-900/20 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-current shrink-0" /> WhatsApp
        </button>

        {/* Instagram Share Modal */}
        <button
          type="button"
          onClick={() => setInstagramModalOpen(true)}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:via-pink-500 hover:to-rose-400 text-white text-xs sm:text-sm font-semibold transition active:scale-95 shadow-lg shadow-pink-900/20 cursor-pointer"
        >
          <Instagram className="w-4 h-4 shrink-0" /> Instagram
        </button>

        {/* Telegram Share */}
        <button
          type="button"
          onClick={handleTelegramShare}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold transition active:scale-95 shadow-lg shadow-sky-900/20 cursor-pointer"
        >
          <Send className="w-4 h-4 shrink-0" /> Telegram
        </button>

        {/* Native Mobile Share */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold border border-white/10 transition active:scale-95 cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-amber-400 shrink-0" /> More Options
        </button>
      </div>

      {/* Secondary Share Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Twitter / X */}
        <button
          type="button"
          onClick={handleTwitterShare}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition cursor-pointer"
        >
          <span className="font-bold">𝕏</span> Share on X
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={handleFacebookShare}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-700/80 hover:bg-blue-600 text-white text-xs font-medium transition cursor-pointer"
        >
          <span className="font-bold text-sm">f</span> Facebook
        </button>

        {/* QR Code */}
        <button
          type="button"
          onClick={() => setQrModalOpen(true)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-400 shrink-0" /> QR Code
        </button>

        {/* SMS Message */}
        <button
          type="button"
          onClick={handleSmsShare}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> SMS / Text
        </button>
      </div>

      {/* Made by RAM Signature Pill */}
      <div className="flex items-center justify-center pt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Made with <Heart className="w-3 h-3 text-rose-500 fill-current inline" /> by RAM
        </span>
      </div>

      {/* Instagram Guide Modal */}
      {instagramModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setInstagramModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInstagramModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Share on Instagram</h3>
                <p className="text-xs text-slate-400">Add to your Story Sticker or send via DM</p>
              </div>
            </div>

            {/* Quick action 1: Copy Link */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">1. Surprise Link:</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate bg-slate-950/60 p-2 rounded-lg">
                {fullShareUrl}
              </p>
            </div>

            {/* Quick action 2: Copy Instagram Story Caption */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">2. Ready-to-paste Caption:</span>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition cursor-pointer"
                >
                  {captionCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {captionCopied ? 'Caption Copied!' : 'Copy Caption'}
                </button>
              </div>
              <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2 rounded-lg leading-relaxed">
                "{instagramCaption}"
              </p>
            </div>

            {/* Open Instagram Buttons */}
            <div className="flex gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:via-pink-500 hover:to-rose-400 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-pink-900/30"
              >
                <Instagram className="w-4 h-4" /> Copy & Open Instagram
              </a>
              <button
                type="button"
                onClick={() => setInstagramModalOpen(false)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                Done
              </button>
            </div>
            
            <p className="text-[11px] text-center text-slate-400">
              💡 Tip: In Instagram Story, tap the sticker icon and select <strong>LINK</strong>, then paste!
            </p>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setQrModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white">Scan Birthday Surprise</h3>
            <p className="text-xs text-slate-400">
              Scan with any mobile camera or QR reader to instantly open this birthday universe.
            </p>

            {qrDataUrl && (
              <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
                <img src={qrDataUrl} alt="Birthday Surprise QR Code" className="w-56 h-56 mx-auto" />
              </div>
            )}

            <div className="text-[11px] text-amber-400 font-medium">
              Made with ❤️ by RAM • WishVerse
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={downloadQrCode}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Download className="w-4 h-4" /> Download QR
              </button>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
