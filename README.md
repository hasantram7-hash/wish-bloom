# WishVerse — Turn a Birthday Wish into a Whole Universe 🎂✨

WishVerse is a full-featured, mobile-first birthday surprise platform that turns memories, heartfelt words, and birthday greetings into an interactive, cinematic online celebration website.

---

## 🌟 Key Features

### 1. Realistic Bakery 3D / 2.5D Birthday Cake (`RealisticBirthdayCake` & `CakeScene`)
- **Professional Bakery Realism**: Soft sponge layers with natural texture, glossy cream frosting, high-gloss ganache drip highlights, edible sugar peonies, 24K gold foil flakes, French macarons, and fresh glazed cherries.
- **Studio Lighting & Atmospheric Scene**: Warm ambient bokeh lights, studio soft shadows, and metallic cake stand reflections (Royal Gold, Porcelain White, Black Marble, Pastel Ceramic).
- **Realistic Wax Candles**: Warm flickering candle flame aura and natural cotton wicks.
- **Staggered Candle Extinction**: When blown out, flames extinguish ~100ms apart with rising smoke wisps, amber-glowing wicks, haptic vibration (`navigator.vibrate`), and confetti.
- **Custom Cake Topper**: Supports recipient name, Devanagari/Hindi/Hinglish scripts, and realistic materials (*Mirror Gold Acrylic, Brushed Silver, Glowing Neon, Poured Chocolate, Fondant, and Sugar Plaque*).
- **First-Cut Cake Slicing (`CakeCutInteraction`)**: Swipe or drag a knife across the cake (with button fallback). Watch the cake separate, revealing sponge crumb, cream layers, falling crumbs, and a secret **Memory Slice Reward** card from the sender.

### 2. Microphone Candle Blow Detection (`useMicrophoneBlowDetection`)
- **Zero Sound Recording or Uploading**: Raw time-domain audio energy is analyzed strictly in-memory using Web Audio API (`AudioContext`, `AnalyserNode`). No audio is ever recorded, stored, or transmitted.
- **User-Initiated Permission**: Microphone is **never** requested automatically. Users must explicitly tap *"Enable Mic & Blow Candles"*.
- **Sustained Blow Rule**: Requires ~500ms–750ms of sustained airflow energy to avoid triggering from random clicks or quick ambient noises.
- **Sensitivity Selector**: Low, Normal, and High sensitivity calibration with live visual audio meter.
- **Always-Available Fallback**: An accessible *"Can’t use mic? Tap to blow out candles"* button is always present.
- **HTTPS & Secure Context Enforcement**: Verifies `window.isSecureContext`. Works out-of-the-box on Vercel's automatic HTTPS.

### 3. Best Friend Memory Journey Timeline (`MemoryJourney`)
- Emotional milestone storytelling (*The Day We Met, Our Funniest Memory, The Moment I Knew You Were Special, What I Admire Most, My Wish For You*).
- Handwritten-style personal letter card from the sender.
- Fully editable by the creator in the wizard.

### 4. Extra Premium Surprise Features
- **Video Message Wall**: Optional video greeting from the sender with custom poster frame.
- **Polaroid & Masonry Gallery**: Up to 20 photos and 1 video with captions and memory dates.
- **Interactive Mini-Games**: Balloon pop blessings game, mystery scratch-off card, spin the birthday destiny wheel, and gift unwrapping reveal.
- **Digital Guestbook & Live Emoji Reactions**: Real-time Firestore subscriptions with anti-spam cooldowns.
- **Creator Management Dashboard (`/surprise/:slug/manage`)**: Aggregated view counters, guestbook moderation, and downloadable QR code.

---

## 🚀 Deploy to Vercel (Exact Step-by-Step Guide)

### Step A: Push Code to GitHub
Ensure all code and the `vercel.json` file are committed to your GitHub repository.

### Step B: Import Project in Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New...** > **Project**.
2. Select your imported GitHub repository.
3. **Framework Preset**: Select `Vite`.
4. **Build & Development Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step C: Configure Environment Variables
In the **Environment Variables** section of the Vercel project setup, add the following variables for **Production**, **Preview**, and **Development**:

```ini
VITE_FIREBASE_API_KEY="AIzaSyBD61clFqKHc3L3P4RRqvZly-CVtGradK8"
VITE_FIREBASE_AUTH_DOMAIN="wishbloom-38073.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="wishbloom-38073"
VITE_FIREBASE_STORAGE_BUCKET="wishbloom-38073.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="531395537472"
VITE_FIREBASE_APP_ID="1:531395537472:web:7e3bc8466c3634e3ca4da5"
VITE_APP_NAME="WishVerse"
```

> **Note**: Whenever you update environment variables in Vercel, you must trigger a redeploy for the new values to take effect.

### Step D: Deploy & Whitelist Your Vercel Domain
1. Click **Deploy**.
2. Once the build completes, copy your Vercel URL (e.g. `your-app.vercel.app`).
3. Open the [Firebase Console](https://console.firebase.google.com/):
   - Navigate to **Authentication** > **Settings** > **Authorized domains**.
   - Click **Add domain** and enter your Vercel production domain (`your-app.vercel.app`) as well as any preview or custom domains.
4. Ensure **Google Sign-In** is enabled under **Authentication** > **Sign-in method**.

### Step E: Deploy Firestore & Storage Rules
Ensure least-privilege security rules are deployed:
```bash
firebase deploy --only firestore:rules,storage
```

---

## 🎤 Microphone Candle Blow Feature

- **HTTPS Required**: Modern browsers require an HTTPS origin for `getUserMedia`. Every Vercel deployment automatically gets SSL/HTTPS.
- **Permissions Policy**: `vercel.json` includes `Permissions-Policy: microphone=(self)`, allowing the microphone on your domain while locking down other unused permissions.
- **Privacy Assurance**: Audio processing uses an ephemeral `Uint8Array` in the browser's audio processing thread. No audio stream is ever saved to disk or transmitted to any server.
- **Manual Fallback**: If a guest denies permission or uses an in-app browser without audio access, they can simply tap the candle or the *"Tap to blow out"* button.

---

## 🧪 Testing & Verification Checklist

- [x] **Vercel SPA Routing**: Direct navigation to `/templates`, `/create`, and `/surprise/:slug` serves `/index.html` without 404s.
- [x] **Dynamic Origin URLs**: Links generated in preview and production adapt to `window.location.origin` via `src/lib/appUrl.ts`.
- [x] **Realistic Cake**: High-end bakery shading, glossy drips, sugar flowers, gold flakes, and metallic plate reflections.
- [x] **Microphone Blow**: Calibrated sustained energy threshold (~600ms) with live visual meter and instant stream cleanup.
- [x] **Manual Blow Fallback**: Tapping candles or the fallback button reliably extinguishes flames and unlocks the next step.
- [x] **Cake Slicing**: Dragging/swiping or tapping *"Cut the Cake"* separates a realistic cake wedge with crumb details and reveals the Memory Slice reward.
- [x] **Memory Journey**: Chapters and handwritten letter render seamlessly with support for Hindi/Hinglish text.
- [x] **Google Sign-In**: Graceful handling for blocked popups and `auth/unauthorized-domain` error messaging.
- [x] **Reduced Motion**: Disables intensive camera/flame oscillations when `prefers-reduced-motion` is active.
- [x] **Type Safety**: Full TypeScript compilation (`npm run build` and `tsc --noEmit`) passes with zero errors.
