import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Cake,
  Image as ImageIcon,
  MessageSquare,
  Palette,
  Gift,
  Eye,
  Send,
  Plus,
  Trash2,
  LogIn,
  Heart,
} from 'lucide-react';
import {
  BirthdaySurprise,
  MemoryItem,
  QuizQuestion,
  SpecialSettings,
  SurpriseTheme,
} from '../types/birthday';
import { RealisticCakeConfig } from '../types/cake';
import { BIRTHDAY_TEMPLATES } from '../config/templates';
import { PhotoUploader } from '../components/gallery/PhotoUploader';
import { CakeCustomizer } from '../components/cake/CakeCustomizer';
import { BirthdayReveal } from '../components/surprise/BirthdayReveal';
import { useAuth } from '../contexts/AuthContext';
import { createSurprise, generateRandomSlug } from '../services/firestoreService';

const WIZARD_STEPS = [
  { id: 1, title: 'Details', icon: Sparkles },
  { id: 2, title: 'Memories', icon: ImageIcon },
  { id: 3, title: 'Message', icon: MessageSquare },
  { id: 4, title: 'Cake', icon: Cake },
  { id: 5, title: 'Theme & Music', icon: Palette },
  { id: 6, title: 'Special Surprises', icon: Gift },
  { id: 7, title: 'Preview & Publish', icon: Eye },
];

const RELATIONSHIPS = [
  'Best Friend',
  'Partner',
  'Brother',
  'Sister',
  'Mom',
  'Dad',
  'Family',
  'Colleague',
  'Other',
];

const MESSAGE_TEMPLATES = [
  {
    category: 'Best Friend',
    text: "Happy Birthday to my favorite partner in crime! From all our crazy late-night talks to making memories I'll never forget, you're more than a friend—you're family. Wishing you a year as legendary as you are! 🍕🎉",
  },
  {
    category: 'Romantic / Partner',
    text: "Happy Birthday to the one who makes my world spin and my heart smile every single day. Loving you is the easiest and most magical thing I've ever known. Here's to making countless more memories together. 💖🥂",
  },
  {
    category: 'Hinglish Fun',
    text: "Janamdin Mubarak mere bhai! 🥳 Tu hamesha aise hi muskuraate rehna, party kab de raha hai bata! May this year bring endless success, happiness, aur dher saara pyaar. You deserve the entire universe! ✨",
  },
  {
    category: 'Emotional & Deep',
    text: "On your special day, I just want you to know how deeply you are appreciated. Thank you for your warmth, your kindness, and for always being a light in my life. May this new chapter bring you peace, triumph, and happiness. 🌸",
  },
  {
    category: 'Short & Sweet',
    text: "Happy Birthday! Wishing you 365 days of good health, contagious laughter, big dreams coming true, and cake! Celebrate big today! 🎂🎈",
  },
];

const LOCAL_STORAGE_DRAFT_KEY = 'wishverse_wizard_draft';

export const CreateSurprisePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateParam = searchParams.get('template') || 'royal-gold';
  const { user, signInWithGoogle, guestId, saveCreatedSurprise } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Initial State initialized from template defaults or localStorage draft
  const defaultTemplate = BIRTHDAY_TEMPLATES.find((t) => t.id === templateParam) || BIRTHDAY_TEMPLATES[0];

  const [recipientName, setRecipientName] = useState('Aarav');
  const [recipientNickname, setRecipientNickname] = useState('');
  const [senderName, setSenderName] = useState('Rohan');
  const [relationship, setRelationship] = useState('Best Friend');
  const [birthdayDate, setBirthdayDate] = useState('');
  const [greetingLanguage, setGreetingLanguage] = useState<'English' | 'Hindi' | 'Hinglish' | 'Custom'>('English');
  const [customTitle, setCustomTitle] = useState('Happy Birthday to My Best Friend!');

  const [memories, setMemories] = useState<MemoryItem[]>([]);

  const [message, setMessage] = useState(
    "Happy Birthday! You bring so much energy, laughter, and wisdom to everyone around you. Thank you for being such an authentic, incredible soul. I hope this birthday universe reminds you of how cherished you are!"
  );
  const [quote, setQuote] = useState('Count your age by friends, not years. Count your life by smiles, not tears.');
  const [reasons, setReasons] = useState<string[]>([
    'Your infectious laughter brightens even the gloomiest day.',
    'You always know how to show up when it matters most.',
    'You inspire everyone around you to dream bigger.',
  ]);
  const [wishes, setWishes] = useState<string[]>([
    'Unstoppable success in all your passions.',
    'Deep peace, boundless love, and vibrant health.',
    'Thrilling journeys and unforgettable memories.',
  ]);

  const [personalLetter, setPersonalLetter] = useState(
    "Looking back at everything we've shared, I couldn't have asked for a truer, kinder, more inspiring soul in my life. Thank you for every late-night conversation, every celebration, and for standing by me through thick and thin. Here is to another year of dreams turning into reality!"
  );

  const [cakeConfig, setCakeConfig] = useState<RealisticCakeConfig>({
    enabled: true,
    style: (defaultTemplate.cakeDefaults.style as any) || 'luxury_floral',
    shape: (defaultTemplate.cakeDefaults.shape as any) || 'round',
    size: 'medium',
    flavorLabel: (defaultTemplate.cakeDefaults.flavorLabel as any) || 'vanilla',
    frostingColor: defaultTemplate.cakeDefaults.frostingColor || '#FAF5EE',
    baseColor: defaultTemplate.cakeDefaults.baseColor || '#E6D3B3',
    accentColor: defaultTemplate.themeDefaults.primaryColor || '#F59E0B',
    icingStyle: (defaultTemplate.cakeDefaults.icingStyle as any) || 'textured_floral',
    borderStyle: 'pearl_border',
    plateStyle: (defaultTemplate.cakeDefaults.plateStyle as any) || 'gold_metallic',
    decorations: (defaultTemplate.cakeDefaults.decorations as any) || ['gold_leaf_flakes', 'edible_flowers'],
    decorationIntensity: 'balanced',
    topperText: 'Happy Birthday Aarav',
    topperFont: undefined,
    topperColor: '#F59E0B',
    topperMaterial: (defaultTemplate.cakeDefaults.topperMaterial as any) || 'gold_acrylic',
    topperPosition: 'center_top',
    age: 21,
    candleColor: defaultTemplate.cakeDefaults.candleColor || '#F59E0B',
    candleCount: 3,
    candlesLit: true,
    microphoneBlowEnabled: true,
    blowSensitivity: 'normal',
    cakeCutEnabled: true,
    hiddenNoteAfterBlow: null,
    memorySliceReward: {
      type: 'message',
      content: "The sweetest memories are the ones we create together. May this year shower you with endless adventures and true joy! 🍰✨",
      mediaUrl: null,
    },
  });

  const [theme, setTheme] = useState<SurpriseTheme>(defaultTemplate.themeDefaults);

  const [specialSettings, setSpecialSettings] = useState<SpecialSettings>({
    scheduledUnlockAt: null,
    expiresAt: null,
    passwordEnabled: false,
    passwordHint: '',
    quizEnabled: false,
    quizQuestions: [
      {
        question: 'What is our favorite hangout spot?',
        options: ['The Corner Cafe', 'Rooftop Lounge', 'Beach Boardwalk', 'Gaming Den'],
        answerIndex: 0,
      },
    ],
    giftEnabled: false,
    giftDetails: {
      title: 'A Special Birthday Coffee & Concert Ticket! 🎟️',
      description: 'Your favorite iced latte and passes to our next live music night are on me!',
      externalLink: '',
    },
    timeCapsuleEnabled: false,
    scratchCardEnabled: true,
    scratchRevealText: 'You are one of the rarest, purest souls on this planet. Never forget it! 💖',
    balloonGameEnabled: true,
    birthdayWheelEnabled: true,
  });

  // Autosave draft to LocalStorage
  useEffect(() => {
    const draftData = {
      recipientName,
      recipientNickname,
      senderName,
      relationship,
      birthdayDate,
      greetingLanguage,
      customTitle,
      message,
      quote,
      reasons,
      wishes,
      cakeConfig,
      theme,
      specialSettings,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(draftData));
    } catch (e) {
      // Local storage quota exceeded or disabled
    }
  }, [
    recipientName,
    recipientNickname,
    senderName,
    relationship,
    birthdayDate,
    greetingLanguage,
    customTitle,
    message,
    quote,
    reasons,
    wishes,
    cakeConfig,
    theme,
    specialSettings,
  ]);

  const handleTemplateSelect = (tmplId: string) => {
    const tmpl = BIRTHDAY_TEMPLATES.find((t) => t.id === tmplId);
    if (!tmpl) return;
    setTheme(tmpl.themeDefaults);
    setCakeConfig((prev) => ({
      ...prev,
      ...tmpl.cakeDefaults,
    }));
  };

  const handlePublish = async () => {
    setPublishError(null);

    if (!recipientName.trim() || !senderName.trim() || !message.trim()) {
      setPublishError('Please complete the required details (Recipient name, Sender name, Message).');
      return;
    }

    setPublishing(true);
    const generatedSlug = generateRandomSlug();
    try {
      const creatorId = user ? user.uid : (guestId || `guest_${Date.now()}`);
      const creatorName = user ? (user.displayName || user.email || senderName.trim()) : senderName.trim();

      // Clean file references from memories so Firestore serialization is 100% clean
      const cleanedMemories = memories.map((m) => {
        const { file, ...rest } = m;
        return rest;
      });

      const surpriseData: Omit<BirthdaySurprise, 'id' | 'createdAt' | 'updatedAt'> = {
        slug: generatedSlug,
        ownerId: creatorId,
        ownerDisplayName: creatorName,
        recipientName: recipientName.trim(),
        recipientNickname: recipientNickname.trim() || undefined,
        senderName: senderName.trim(),
        relationship,
        birthdayDate: birthdayDate || undefined,
        greetingLanguage,
        customTitle: customTitle.trim() || undefined,
        message: message.trim(),
        quote: quote.trim() || undefined,
        personalLetter: personalLetter.trim() || undefined,
        reasons: reasons.filter((r) => r.trim().length > 0),
        wishes: wishes.filter((w) => w.trim().length > 0),
        memories: cleanedMemories,
        cake: cakeConfig,
        theme,
        music: {
          enabled: true,
          mood: 'happy',
        },
        specialSettings,
        guestbookEnabled: true,
        viewCount: 0,
        reactions: {
          '❤️': 1,
          '🎉': 1,
          '🥹': 0,
          '😍': 0,
          '😂': 0,
        },
        isActive: true,
      };

      await createSurprise(surpriseData);
      saveCreatedSurprise(generatedSlug);
      localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
      navigate(`/surprise/${generatedSlug}/manage`);
    } catch (err: unknown) {
      console.warn('Publish error recovery:', err);
      saveCreatedSurprise(generatedSlug);
      localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
      navigate(`/surprise/${generatedSlug}/manage`);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wizard Stepper Header */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Step {currentStep} of {WIZARD_STEPS.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {WIZARD_STEPS[currentStep - 1].title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Autosaving draft</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none">
            {WIZARD_STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isDone = step.id < currentStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP CONTENT SECTIONS */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          {/* STEP 1: BASIC DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Who is this birthday surprise for?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Recipient's Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    placeholder="e.g. Aarav"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nickname / Pet Name (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="e.g. Tiger, Chotu, Jaan"
                    value={recipientNickname}
                    onChange={(e) => setRecipientNickname(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name (Sender) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    placeholder="e.g. Rohan"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel} value={rel} className="bg-slate-900">
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Birthday Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={birthdayDate}
                    onChange={(e) => setBirthdayDate(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Greeting Language Tone
                  </label>
                  <select
                    value={greetingLanguage}
                    onChange={(e) => setGreetingLanguage(e.target.value as any)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hinglish">Hinglish</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Custom Headline Title (Optional)
                </label>
                <input
                  type="text"
                  maxLength={120}
                  placeholder="e.g. Happy Birthday to My Forever Best Friend!"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* STEP 2: MEMORIES UPLOADER */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  Upload Photo & Video Memories
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload up to 20 images and 1 video. Star one photo as the Hero Photo to be highlighted!
                </p>
              </div>

              <PhotoUploader
                memories={memories}
                onChange={setMemories}
                userId={user?.uid || guestId}
              />
            </div>
          )}

          {/* STEP 3: MESSAGE & WISHES */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  Your Heartfelt Words
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Express your true feelings in English, Hindi, Hinglish, or emojis.
                </p>
              </div>

              {/* Quick Template Suggestions */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-amber-400">
                  Quick Message Inspiration:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {MESSAGE_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessage(tmpl.text)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-white/10 whitespace-nowrap transition cursor-pointer"
                    >
                      {tmpl.category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Main Birthday Letter / Message <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">{message.length}/2000</span>
                </div>
                <textarea
                  rows={6}
                  required
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed font-outfit"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Special Quote / Sign-off
                </label>
                <input
                  type="text"
                  maxLength={300}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Reasons You Are Amazing */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Reasons You Are Amazing (Up to 10)
                  </label>
                  {reasons.length < 10 && (
                    <button
                      type="button"
                      onClick={() => setReasons([...reasons, ''])}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Reason
                    </button>
                  )}
                </div>

                {reasons.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Reason #${i + 1}`}
                      value={r}
                      onChange={(e) => {
                        const newR = [...reasons];
                        newR[i] = e.target.value;
                        setReasons(newR);
                      }}
                      className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setReasons(reasons.filter((_, idx) => idx !== i))}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: CAKE CUSTOMIZER */}
          {currentStep === 4 && (
            <CakeCustomizer
              config={cakeConfig}
              onChange={setCakeConfig}
              recipientName={recipientName}
            />
          )}

          {/* STEP 5: THEME & MUSIC */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                Theme Aesthetic & Atmosphere
              </h3>

              {/* Template quick switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Preset Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {BIRTHDAY_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateSelect(tmpl.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                        theme.templateId === tmpl.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/20'
                          : 'bg-slate-800/80 border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <div className="font-bold truncate">{tmpl.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{tmpl.tags[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Background Atmosphere
                  </label>
                  <select
                    value={theme.backgroundType}
                    onChange={(e) =>
                      setTheme({ ...theme, backgroundType: e.target.value as any })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="stars">Twinkling Stars & Nebula</option>
                    <option value="floating_hearts">Floating Rose Hearts</option>
                    <option value="gradient">Vibrant Gradient</option>
                    <option value="clouds">Fluffy Sky & Clouds</option>
                    <option value="galaxy">Cosmic Galaxy</option>
                    <option value="floral">Enchanted Floral</option>
                    <option value="solid">Dark Luxury Minimal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Typography Pairing
                  </label>
                  <select
                    value={theme.fontStyle}
                    onChange={(e) =>
                      setTheme({ ...theme, fontStyle: e.target.value as any })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="playful">Playful & Cheerful (Outfit)</option>
                    <option value="handwritten">Romantic Handwritten (Caveat)</option>
                    <option value="elegant">Royal Editorial (Playfair Display)</option>
                    <option value="bold_party">Bold Party Vibes (Jakarta Sans)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-xs font-semibold text-slate-300">Feature Toggles</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 border border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme.toggles.polaroidStyle}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          toggles: { ...theme.toggles, polaroidStyle: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                    />
                    <span>Vintage Polaroid Frame Gallery</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 border border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme.toggles.showGuestbook}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          toggles: { ...theme.toggles, showGuestbook: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                    />
                    <span>Enable Public Visitor Guestbook</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SPECIAL SURPRISE SETTINGS */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                Interactive Games & Unlock Controls
              </h3>

              <div className="space-y-4">
                {/* Scratch card toggle */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={specialSettings.scratchCardEnabled}
                      onChange={(e) =>
                        setSpecialSettings({ ...specialSettings, scratchCardEnabled: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span className="font-semibold text-sm text-white">Mystery Scratch Card</span>
                  </label>
                  {specialSettings.scratchCardEnabled && (
                    <input
                      type="text"
                      placeholder="Secret message revealed after scratching..."
                      value={specialSettings.scratchRevealText || ''}
                      onChange={(e) =>
                        setSpecialSettings({ ...specialSettings, scratchRevealText: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  )}
                </div>

                {/* Balloon Popping game */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={specialSettings.balloonGameEnabled}
                      onChange={(e) =>
                        setSpecialSettings({ ...specialSettings, balloonGameEnabled: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <div>
                      <span className="font-semibold text-sm text-white">Pop the Birthday Balloons</span>
                      <p className="text-[11px] text-slate-400">
                        Recipient can tap floating balloons to release cheerful positive blessings.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Birthday destiny wheel */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={specialSettings.birthdayWheelEnabled}
                      onChange={(e) =>
                        setSpecialSettings({ ...specialSettings, birthdayWheelEnabled: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <div>
                      <span className="font-semibold text-sm text-white">Spin the Birthday Destiny Wheel</span>
                      <p className="text-[11px] text-slate-400">
                        A fun interactive wheel with wishes like Infinite Joy, Health, and Success.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: PREVIEW AND PUBLISH */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-black text-white">Ready to Launch! 🚀</h3>
                  <p className="text-xs text-slate-400">
                    Review your birthday surprise before generating your permanent unguessable link.
                  </p>
                </div>
              </div>

              {/* Pre-publish Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Recipient: <strong>{recipientName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sender: <strong>{senderName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Memories: <strong>{memories.length} item(s)</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Template: <strong>{theme.templateId}</strong></span>
                </div>
              </div>

              {/* Instant Publishing Banner (No Sign-In Required!) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-rose-500/10 border border-emerald-500/30 text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block text-sm">Instant 1-Click Publishing Ready!</span>
                    <span className="text-slate-400 text-xs">No sign-in or account needed. You can publish and share immediately.</span>
                  </div>
                </div>
                {!user ? (
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" /> Optional: Sign In
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    <span>Logged in as <strong>{user.displayName || user.email}</strong></span>
                  </div>
                )}
              </div>

              {publishError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{publishError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full py-4 px-8 rounded-full font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 hover:from-amber-300 hover:to-rose-300 shadow-xl shadow-amber-500/25 active:scale-95 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {publishing ? 'Publishing Your Birthday Universe...' : 'Publish Birthday Surprise 🎉 (No Sign-In Required)'}
                </button>

                <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" /> by RAM • Instant WhatsApp & Instagram sharing ready
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM STEPPER NAVIGATION */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 transition cursor-pointer"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-slate-400">Step 7 of 7</span>
          )}
        </div>
      </div>
    </div>
  );
};
