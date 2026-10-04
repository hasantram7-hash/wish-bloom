import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, PlusCircle, LogIn, LogOut, Menu, X, Heart, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:rotate-6 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                WishVerse
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </span>
              <span className="text-[10px] text-amber-300 font-bold tracking-wider uppercase -mt-0.5 flex items-center gap-1">
                Made by RAM
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Home
            </Link>
            <Link to="/templates" className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-amber-400" /> Explore Templates
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" /> Made with ❤️ by RAM
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Create Surprise
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-9 h-9 rounded-full border border-amber-400/50"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={signOutUser}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={signingIn}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                {signingIn ? 'Connecting...' : 'Sign In'}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/create')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 shadow-md active:scale-95 cursor-pointer"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200"
          >
            Home
          </Link>
          <Link
            to="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200"
          >
            Explore Templates
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200"
          >
            How It Works
          </a>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/create');
              }}
              className="w-full py-3 rounded-full text-center text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 shadow-lg cursor-pointer"
            >
              Create a Birthday Surprise ✨
            </button>

            {user ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  {user.photoURL && (
                    <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full" />
                  )}
                  <span className="text-sm font-medium text-white truncate max-w-[150px]">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={signOutUser}
                  className="text-xs text-rose-400 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                className="w-full py-2.5 rounded-full text-sm font-medium text-slate-200 bg-white/5 border border-white/10 text-center"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
