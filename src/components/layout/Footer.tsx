import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-white">WishVerse</span>
          </Link>

          <p className="text-center sm:text-right text-xs text-slate-500 font-caveat text-base sm:text-lg">
            “Turn a birthday wish into a whole universe.”
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 pt-6 border-t border-white/5 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WishVerse. Crafted for celebrations across the globe.</p>
          <div className="flex items-center gap-6">
            <Link to="/templates" className="hover:text-slate-300">
              Templates
            </Link>
            <Link to="/create" className="hover:text-slate-300">
              Create Surprise
            </Link>
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" /> by <strong>RAM</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
