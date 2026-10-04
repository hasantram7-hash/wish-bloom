import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 sm:p-12 max-w-md w-full space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white">404</h1>
          <h2 className="text-lg font-bold text-slate-200">Lost in the Universe</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-outfit">
            The birthday portal you are looking for doesn't exist or has moved into another galaxy.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 transition shadow-lg shadow-amber-500/20"
        >
          <Home className="w-4 h-4" /> Return to WishVerse
        </Link>
      </div>
    </div>
  );
};
