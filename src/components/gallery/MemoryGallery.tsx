import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Sparkles, Film } from 'lucide-react';
import { MemoryItem } from '../../types/birthday';

interface MemoryGalleryProps {
  memories: MemoryItem[];
  polaroidStyle?: boolean;
  accentColor?: string;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  memories,
  polaroidStyle = false,
  accentColor = '#F59E0B',
}) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Sort memories strictly by order
  const sortedMemories = [...memories].sort((a, b) => a.order - b.order);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : sortedMemories.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev < sortedMemories.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, sortedMemories.length]);

  if (sortedMemories.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      {/* Masonry / Responsive Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {sortedMemories.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActiveLightboxIndex(index)}
            className={`break-inside-avoid cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 ${
              polaroidStyle
                ? 'bg-white p-3.5 pb-6 rounded-md shadow-xl text-slate-900 border border-slate-200 rotate-[-1deg] hover:rotate-0'
                : 'rounded-2xl overflow-hidden bg-slate-900/80 border border-white/15 shadow-xl hover:border-white/40'
            }`}
          >
            <div className="relative overflow-hidden rounded-xl bg-slate-950">
              {item.type === 'video' ? (
                <div className="relative aspect-video">
                  <video
                    src={item.downloadUrl}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                      <Film className="w-6 h-6 text-pink-400" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={item.downloadUrl}
                  alt={item.caption || `Memory ${index + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              )}

              {item.isHero && (
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" /> Special Memory
                </span>
              )}
            </div>

            {/* Captions & Dates */}
            <div className={`mt-3 ${polaroidStyle ? 'px-1 font-caveat text-base' : 'px-2 pb-2'}`}>
              {item.caption && (
                <p className={`font-medium ${polaroidStyle ? 'text-slate-800 text-lg leading-tight' : 'text-slate-200 text-sm'}`}>
                  {item.caption}
                </p>
              )}
              {item.memoryDate && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.memoryDate}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      {activeLightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex(null);
            }}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close photo view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : sortedMemories.length - 1
              );
            }}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) =>
                prev !== null && prev < sortedMemories.length - 1 ? prev + 1 : 0
              );
            }}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Current Media Container */}
          <div
            className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {sortedMemories[activeLightboxIndex].type === 'video' ? (
              <video
                src={sortedMemories[activeLightboxIndex].downloadUrl}
                controls
                autoPlay
                className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl object-contain"
              />
            ) : (
              <img
                src={sortedMemories[activeLightboxIndex].downloadUrl}
                alt={sortedMemories[activeLightboxIndex].caption || 'Enlarged memory'}
                className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl object-contain"
              />
            )}

            {/* Lightbox Caption */}
            <div className="mt-4 text-center max-w-xl">
              {sortedMemories[activeLightboxIndex].caption && (
                <p className="text-white text-base sm:text-lg font-medium">
                  {sortedMemories[activeLightboxIndex].caption}
                </p>
              )}
              {sortedMemories[activeLightboxIndex].memoryDate && (
                <p className="text-slate-400 text-xs mt-1 flex items-center justify-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {sortedMemories[activeLightboxIndex].memoryDate}
                </p>
              )}
              <p className="text-slate-500 text-xs mt-2">
                {activeLightboxIndex + 1} of {sortedMemories.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
