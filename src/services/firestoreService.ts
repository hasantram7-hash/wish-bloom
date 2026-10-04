import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { BirthdaySurprise, GuestbookEntry } from '../types/birthday';

const COLLECTION_SURPRISES = 'birthdaySurprises';
const SUBCOLLECTION_GUESTBOOK = 'guestbook';

/**
 * Generates an unguessable 20-character URL-safe random slug
 */
export function generateRandomSlug(): string {
  const chars = 'abcdefghijkmnopqrstuvwxyz023456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  const cryptoObj = typeof window !== 'undefined' ? (window.crypto || (window as unknown as { msCrypto: Crypto }).msCrypto) : null;
  if (cryptoObj && cryptoObj.getRandomValues) {
    const array = new Uint8Array(20);
    cryptoObj.getRandomValues(array);
    for (let i = 0; i < 20; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return result;
}

/**
 * Sanitizes data before saving to Firestore:
 * - Removes DOM File and Blob objects (which crash Firestore)
 * - Converts undefined values to null or removes them
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as unknown as T;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  // Check if it's a DOM File or Blob
  if (typeof File !== 'undefined' && obj instanceof File) {
    return undefined as unknown as T;
  }
  if (typeof Blob !== 'undefined' && obj instanceof Blob) {
    return undefined as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined) as unknown as T;
  }
  const clean: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    if (key === 'file') continue;
    const cleanedVal = sanitizeForFirestore(val);
    if (cleanedVal !== undefined) {
      clean[key] = cleanedVal;
    }
  }
  return clean as T;
}

/**
 * Local storage backup helpers
 */
function saveLocalSurprise(slug: string, data: BirthdaySurprise): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`wishverse_surprise_${slug}`, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

function getLocalSurprise(slug: string): BirthdaySurprise | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`wishverse_surprise_${slug}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Calculates 24-hour expiration status
 */
export function getSurpriseExpiryStatus(surprise: BirthdaySurprise): {
  isExpired: boolean;
  remainingMs: number;
  formattedRemaining: string;
} {
  const createdTime = surprise.createdAt ? new Date(surprise.createdAt).getTime() : Date.now();
  const expiryTime = surprise.expiresAt
    ? new Date(surprise.expiresAt).getTime()
    : createdTime + 24 * 60 * 60 * 1000;

  const now = Date.now();
  const diff = expiryTime - now;

  if (diff <= 0) {
    return {
      isExpired: true,
      remainingMs: 0,
      formattedRemaining: 'Expired',
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    isExpired: false,
    remainingMs: diff,
    formattedRemaining: `${hours}h ${minutes}m left`,
  };
}

/**
 * Creates a new birthday surprise in Firestore with direct slug ID
 * and 24-hour auto-expiration
 */
export async function createSurprise(
  surpriseData: Omit<BirthdaySurprise, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const sanitized = sanitizeForFirestore(surpriseData) as BirthdaySurprise;
  const now = new Date().toISOString();
  // 24 hours celebration window
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  sanitized.createdAt = now;
  sanitized.updatedAt = now;
  sanitized.expiresAt = expiresAt;

  if (!sanitized.specialSettings) {
    sanitized.specialSettings = {
      passwordEnabled: false,
      quizEnabled: false,
      giftEnabled: false,
      timeCapsuleEnabled: false,
      scratchCardEnabled: false,
      balloonGameEnabled: true,
      birthdayWheelEnabled: true,
    };
  }
  sanitized.specialSettings.expiresAt = expiresAt;

  // Save immediate local copy so creator has it cached
  const localSurprise: BirthdaySurprise = {
    ...sanitized,
    id: sanitized.slug,
    createdAt: now,
    updatedAt: now,
    expiresAt,
  };
  saveLocalSurprise(sanitized.slug, localSurprise);

  try {
    // 1. Direct document write with slug as doc ID (ensures instant direct get on all devices)
    const docRef = doc(db, COLLECTION_SURPRISES, sanitized.slug);
    await setDoc(docRef, {
      ...sanitized,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return sanitized.slug;
  } catch (err1) {
    console.warn('Direct setDoc write failed, attempting addDoc fallback:', err1);
    try {
      const surprisesRef = collection(db, COLLECTION_SURPRISES);
      const docRef = await addDoc(surprisesRef, {
        ...sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      localSurprise.id = docRef.id;
      saveLocalSurprise(sanitized.slug, localSurprise);
      return docRef.id;
    } catch (err2) {
      console.warn('Both Firestore write attempts failed, relying on local backup:', err2);
      handleFirestoreError(err2, OperationType.CREATE, COLLECTION_SURPRISES);
      return localSurprise.id || sanitized.slug;
    }
  }
}

/**
 * Updates an existing surprise
 */
export async function updateSurprise(
  surpriseId: string,
  updates: Partial<BirthdaySurprise>
): Promise<void> {
  const sanitized = sanitizeForFirestore(updates);
  const docPath = `${COLLECTION_SURPRISES}/${surpriseId}`;

  if (updates.slug) {
    const local = getLocalSurprise(updates.slug);
    if (local) {
      saveLocalSurprise(updates.slug, { ...local, ...sanitized, updatedAt: new Date().toISOString() });
    }
  }

  try {
    const docRef = doc(db, COLLECTION_SURPRISES, surpriseId);
    await updateDoc(docRef, {
      ...sanitized,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Firestore updateDoc warning:', error);
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Fetches a surprise by its unique share slug
 * Tries direct document lookup, then query fallback, then local backup
 */
export async function getSurpriseBySlug(slug: string): Promise<BirthdaySurprise | null> {
  try {
    // 1. Direct document lookup by slug (super fast, never blocked by query permissions!)
    const directDocRef = doc(db, COLLECTION_SURPRISES, slug);
    const directSnap = await getDoc(directDocRef);
    if (directSnap.exists()) {
      const data = { id: directSnap.id, ...directSnap.data() } as BirthdaySurprise;
      saveLocalSurprise(slug, data);
      return data;
    }

    // 2. Query fallback for surprises saved with random auto-IDs
    const q = query(
      collection(db, COLLECTION_SURPRISES),
      where('slug', '==', slug)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docData = snapshot.docs[0];
      const data = { id: docData.id, ...docData.data() } as BirthdaySurprise;
      saveLocalSurprise(slug, data);
      return data;
    }

    // 3. Fallback to local storage (if on creator device)
    return getLocalSurprise(slug);
  } catch (error) {
    console.warn('Firestore getSurpriseBySlug failed, checking local storage:', error);
    return getLocalSurprise(slug);
  }
}

/**
 * Fetches a surprise by document ID
 */
export async function getSurpriseById(surpriseId: string): Promise<BirthdaySurprise | null> {
  const docPath = `${COLLECTION_SURPRISES}/${surpriseId}`;
  try {
    const docRef = doc(db, COLLECTION_SURPRISES, surpriseId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return getLocalSurprise(surpriseId);
    }
    return { id: snap.id, ...snap.data() } as BirthdaySurprise;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
    return getLocalSurprise(surpriseId);
  }
}

/**
 * Lists all surprises belonging to an authenticated owner
 */
export async function getSurprisesByOwner(ownerId: string): Promise<BirthdaySurprise[]> {
  const path = COLLECTION_SURPRISES;
  try {
    const q = query(
      collection(db, COLLECTION_SURPRISES),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as BirthdaySurprise[];
  } catch (error) {
    try {
      const simpleQ = query(
        collection(db, COLLECTION_SURPRISES),
        where('ownerId', '==', ownerId)
      );
      const snapshot = await getDocs(simpleQ);
      const items = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as BirthdaySurprise[];
      return items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } catch (fallbackErr) {
      handleFirestoreError(fallbackErr, OperationType.LIST, path);
      return [];
    }
  }
}

/**
 * Soft delete a surprise (sets isActive to false)
 */
export async function softDeleteSurprise(surpriseId: string): Promise<void> {
  await updateSurprise(surpriseId, { isActive: false });
}

/**
 * Hard delete a surprise
 */
export async function permanentDeleteSurprise(surpriseId: string): Promise<void> {
  const docPath = `${COLLECTION_SURPRISES}/${surpriseId}`;
  try {
    const docRef = doc(db, COLLECTION_SURPRISES, surpriseId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Records an aggregated view with local storage cooldown to avoid rapid counting
 */
export async function recordSurpriseView(surpriseId: string): Promise<void> {
  const storageKey = `wishverse_view_${surpriseId}`;
  const lastViewTime = localStorage.getItem(storageKey);
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;

  if (lastViewTime && now - parseInt(lastViewTime, 10) < ONE_HOUR) {
    return;
  }

  localStorage.setItem(storageKey, now.toString());
  try {
    const docRef = doc(db, COLLECTION_SURPRISES, surpriseId);
    await updateDoc(docRef, {
      viewCount: increment(1),
    });
  } catch (error) {
    console.warn('Could not increment view count (non-critical):', error);
  }
}

/**
 * Records an emoji reaction with client-side guard
 */
export async function recordReaction(surpriseId: string, emoji: string): Promise<void> {
  const storageKey = `wishverse_react_${surpriseId}_${emoji}`;
  if (localStorage.getItem(storageKey)) {
    return;
  }
  localStorage.setItem(storageKey, 'true');

  try {
    const docRef = doc(db, COLLECTION_SURPRISES, surpriseId);
    await updateDoc(docRef, {
      [`reactions.${emoji}`]: increment(1),
    });
  } catch (error) {
    console.warn('Could not record reaction (non-critical):', error);
  }
}

/**
 * Real-time listener for a surprise document
 */
export function subscribeToSurprise(
  surpriseId: string,
  onUpdate: (surprise: BirthdaySurprise) => void,
  onError?: (err: unknown) => void
): () => void {
  const docPath = `${COLLECTION_SURPRISES}/${surpriseId}`;
  const docRef = doc(db, COLLECTION_SURPRISES, surpriseId);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate({ id: snap.id, ...snap.data() } as BirthdaySurprise);
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, docPath);
    }
  );
}

/**
 * Adds a guestbook entry
 */
export async function addGuestbookEntry(
  surpriseId: string,
  entry: Omit<GuestbookEntry, 'id' | 'createdAt'>
): Promise<string> {
  const path = `${COLLECTION_SURPRISES}/${surpriseId}/${SUBCOLLECTION_GUESTBOOK}`;
  try {
    const guestbookRef = collection(db, COLLECTION_SURPRISES, surpriseId, SUBCOLLECTION_GUESTBOOK);
    const docRef = await addDoc(guestbookRef, {
      ...entry,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.warn('Guestbook add entry warning:', error);
    handleFirestoreError(error, OperationType.CREATE, path);
    return `local_gb_${Date.now()}`;
  }
}

/**
 * Subscribes to real-time guestbook updates
 */
export function subscribeToGuestbook(
  surpriseId: string,
  onEntries: (entries: GuestbookEntry[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = `${COLLECTION_SURPRISES}/${surpriseId}/${SUBCOLLECTION_GUESTBOOK}`;
  try {
    const guestbookRef = collection(db, COLLECTION_SURPRISES, surpriseId, SUBCOLLECTION_GUESTBOOK);
    const q = query(guestbookRef, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const entries = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as GuestbookEntry[];
        onEntries(entries);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    console.warn('Guestbook subscribe warning:', error);
    return () => {};
  }
}

/**
 * Deletes a guestbook entry
 */
export async function deleteGuestbookEntry(surpriseId: string, entryId: string): Promise<void> {
  const docPath = `${COLLECTION_SURPRISES}/${surpriseId}/${SUBCOLLECTION_GUESTBOOK}/${entryId}`;
  try {
    const docRef = doc(db, COLLECTION_SURPRISES, surpriseId, SUBCOLLECTION_GUESTBOOK, entryId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
