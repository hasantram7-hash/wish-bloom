import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Film,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { MemoryItem } from '../../types/birthday';
import { validateFile, uploadMediaFile } from '../../services/storageService';

interface PhotoUploaderProps {
  memories: MemoryItem[];
  onChange: (memories: MemoryItem[]) => void;
  userId?: string;
  surpriseId?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  memories,
  onChange,
  userId = 'anonymous_creator',
  surpriseId = 'draft_preview',
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memoriesRef = useRef<MemoryItem[]>(memories);
  memoriesRef.current = memories;

  const imagesCount = memories.filter(m => m.type === 'image').length;
  const hasVideo = memories.some(m => m.type === 'video');

  const processFiles = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const files = Array.from(fileList);

    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setErrorMsg(validation.error || 'Invalid file');
        continue;
      }

      if (validation.type === 'image' && imagesCount >= 20) {
        setErrorMsg('Maximum 20 photos allowed per surprise.');
        break;
      }

      if (validation.type === 'video' && hasVideo) {
        setErrorMsg('Only 1 video memory is allowed per surprise.');
        continue;
      }

      // Generate local preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      const tempId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const isFirst = memoriesRef.current.length === 0;

      const newMemory: MemoryItem = {
        id: tempId,
        storagePath: '',
        downloadUrl: localPreviewUrl,
        type: validation.type,
        caption: '',
        memoryDate: '',
        order: memoriesRef.current.length,
        isHero: isFirst,
        file,
        progress: 0,
      };

      // Add into list immediately with local preview
      const currentList = [...memoriesRef.current, newMemory];
      memoriesRef.current = currentList;
      onChange(currentList);

      // Begin background upload to Firebase Storage if userId is authenticated
      if (userId && userId !== 'anonymous_creator') {
        try {
          const result = await uploadMediaFile(
            userId,
            surpriseId,
            file,
            (progress) => {
              const updated = memoriesRef.current.map((item) =>
                item.id === tempId ? { ...item, progress } : item
              );
              memoriesRef.current = updated;
              onChange(updated);
            }
          );

          const completed = memoriesRef.current.map((item) =>
            item.id === tempId
              ? {
                  ...item,
                  downloadUrl: result.downloadUrl,
                  storagePath: result.storagePath,
                  progress: 100,
                }
              : item
          );
          memoriesRef.current = completed;
          onChange(completed);
        } catch (uploadErr) {
          console.error('Upload failed:', uploadErr);
          const withErr = memoriesRef.current.map((item) =>
            item.id === tempId
              ? { ...item, error: 'Upload failed. File preserved locally.' }
              : item
          );
          memoriesRef.current = withErr;
          onChange(withErr);
        }
      } else {
        // Guest mode / before sign-in: keep local object URL for preview
        newMemory.progress = 100;
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (id: string) => {
    const updated = memories.filter(m => m.id !== id);
    // If removed item was hero, set first item as hero
    if (updated.length > 0 && !updated.some(m => m.isHero)) {
      updated[0].isHero = true;
    }
    // re-index order
    const reindexed = updated.map((m, idx) => ({ ...m, order: idx }));
    onChange(reindexed);
  };

  const setHero = (id: string) => {
    const updated = memories.map(m => ({
      ...m,
      isHero: m.id === id,
    }));
    onChange(updated);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= memories.length) return;
    const newItems = [...memories];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    onChange(newItems.map((m, idx) => ({ ...m, order: idx })));
  };

  const updateCaption = (id: string, caption: string) => {
    onChange(
      memories.map(m => (m.id === id ? { ...m, caption } : m))
    );
  };

  const updateDate = (id: string, memoryDate: string) => {
    onChange(
      memories.map(m => (m.id === id ? { ...m, memoryDate } : m))
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-white/20 bg-slate-900/60 hover:border-amber-400/50 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">
              Drag & drop photos or video here, or <span className="text-amber-400 underline underline-offset-2">browse files</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports up to 20 photos (JPG, PNG, WEBP max 5MB) and 1 video (MP4, WEBM max 25MB)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-400" /> {imagesCount}/20 Photos
            </span>
            <span className="flex items-center gap-1.5">
              <Film className="w-4 h-4 text-pink-400" /> {hasVideo ? '1/1 Video' : '0/1 Video'}
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Memory Cards Grid */}
      {memories.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Uploaded Memories ({memories.length})
            </h4>
            <span className="text-xs text-slate-400">
              Tip: Click the star to pick the Hero Photo displayed first
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((item, index) => (
              <div
                key={item.id}
                className={`relative rounded-2xl bg-slate-900/90 border transition-all duration-200 overflow-hidden shadow-lg flex flex-col ${
                  item.isHero
                    ? 'border-amber-400 ring-2 ring-amber-400/30'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Media Preview Box */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
                  {item.type === 'video' ? (
                    <video
                      src={item.downloadUrl}
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                  ) : (
                    <img
                      src={item.downloadUrl}
                      alt={item.caption || `Memory ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}

                  {/* Hero Badge */}
                  {item.isHero && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Hero Photo
                    </div>
                  )}

                  {/* Upload Progress Overlay */}
                  {item.progress !== undefined && item.progress < 100 && (
                    <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4">
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-amber-400 h-full transition-all duration-200"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-white">
                        Uploading {item.progress}%
                      </span>
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setHero(item.id)}
                      title={item.isHero ? 'Current Hero' : 'Set as Hero Photo'}
                      className={`p-1.5 rounded-lg transition ${
                        item.isHero
                          ? 'text-amber-400 bg-amber-400/20'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${item.isHero ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                      className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === memories.length - 1}
                      title="Move down"
                      className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      title="Delete memory"
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Caption & Date Inputs */}
                <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <input
                      type="text"
                      placeholder="Add a heartwarming caption..."
                      value={item.caption || ''}
                      onChange={(e) => updateCaption(item.id, e.target.value)}
                      className="w-full text-xs bg-slate-800/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Memory date (e.g. Summer 2023)"
                      value={item.memoryDate || ''}
                      onChange={(e) => updateDate(item.id, e.target.value)}
                      className="w-full text-[11px] bg-slate-800/50 border border-white/10 rounded-lg px-2 py-1 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
