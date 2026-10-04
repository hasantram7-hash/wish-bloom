import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
}

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export function validateFile(file: File): { valid: boolean; error?: string; type: 'image' | 'video' } {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return { valid: false, error: `Image "${file.name}" exceeds the 5 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`, type: 'image' };
    }
    return { valid: true, type: 'image' };
  }

  if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return { valid: false, error: `Video "${file.name}" exceeds the 25 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`, type: 'video' };
    }
    return { valid: true, type: 'video' };
  }

  return {
    valid: false,
    error: `Unsupported file format "${file.type || file.name}". Only JPG, PNG, WEBP and MP4/WEBM are allowed.`,
    type: 'image',
  };
}

export function uploadMediaFile(
  userId: string,
  surpriseId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const folder = isVideo ? 'videos' : 'photos';
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `birthday-surprises/${userId}/${surpriseId}/${folder}/${timestamp}_${sanitizedFileName}`;
    const storageReference = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageReference, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Storage upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadUrl, storagePath });
        } catch (urlError) {
          reject(urlError);
        }
      }
    );
  });
}

export async function deleteMediaFile(storagePath: string): Promise<void> {
  try {
    const storageReference = ref(storage, storagePath);
    await deleteObject(storageReference);
  } catch (error) {
    console.warn('Storage file deletion warning (file may already be removed):', error);
  }
}
