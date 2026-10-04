import { RealisticCakeConfig } from './cake';
import { JourneyMilestone } from '../components/surprise/MemoryJourney';

export type CakeShape = 'round' | 'square' | 'heart' | 'tiered' | 'cupcake_tower';
export type CakeFlavor = 'chocolate' | 'vanilla' | 'red_velvet' | 'butterscotch' | 'strawberry' | 'custom';
export type CakeIcingStyle = 'drip' | 'swirl' | 'minimal' | 'floral' | 'sprinkles';
export type CakeDecoration = 'sprinkles' | 'cherries' | 'flowers' | 'stars' | 'chocolates' | 'bows' | 'gold_flakes' | 'balloons' | 'mini_balloons';
export type CakePlateStyle = 'white_ceramic' | 'gold_plate' | 'pastel_plate' | 'neon_plate';

export interface CakeConfig {
  shape: CakeShape;
  flavor: CakeFlavor;
  frostingColor: string;
  baseColor: string;
  icingStyle: CakeIcingStyle;
  topperText: string;
  age?: number;
  candleColor: string;
  candlesLit: boolean;
  decorations: CakeDecoration[];
  plateStyle: CakePlateStyle;
}

export interface MemoryItem {
  id: string;
  storagePath: string;
  downloadUrl: string;
  type: 'image' | 'video';
  caption: string;
  memoryDate?: string;
  order: number;
  isHero: boolean;
  file?: File;
  progress?: number;
  error?: string;
}

export type BackgroundType = 'gradient' | 'solid' | 'stars' | 'balloons' | 'floating_hearts' | 'confetti' | 'clouds' | 'galaxy' | 'floral' | 'custom';
export type FontStyle = 'playful' | 'elegant' | 'modern' | 'handwritten' | 'bold_party';
export type AnimationIntensity = 'minimal' | 'balanced' | 'extra';
export type CelebrationStyle = 'confetti' | 'balloons' | 'fireworks' | 'sparkles' | 'hearts' | 'stars';

export interface SurpriseTheme {
  templateId: string;
  backgroundType: BackgroundType;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  fontStyle: FontStyle;
  animationIntensity: AnimationIntensity;
  celebrationStyle: CelebrationStyle;
  toggles: {
    showFloatingDecorations: boolean;
    showCountdown: boolean;
    showPhotoCarousel: boolean;
    showMemoryTimeline: boolean;
    showGuestbook: boolean;
    showReactionButtons: boolean;
    polaroidStyle: boolean;
  };
}

export interface MusicConfig {
  enabled: boolean;
  mood: 'happy' | 'soft' | 'romantic' | 'party' | 'none';
  audioPath?: string | null;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  hint?: string;
}

export interface GiftDetails {
  title: string;
  description: string;
  imageUrl?: string;
  externalLink?: string;
}

export interface SpecialSettings {
  scheduledUnlockAt?: string | null;
  expiresAt?: string | null;
  passwordEnabled: boolean;
  passwordHint?: string;
  quizEnabled: boolean;
  quizQuestions?: QuizQuestion[];
  giftEnabled: boolean;
  giftDetails?: GiftDetails;
  timeCapsuleEnabled: boolean;
  timeCapsuleUnlockAt?: string | null;
  timeCapsuleNote?: string;
  scratchCardEnabled: boolean;
  scratchRevealText?: string;
  balloonGameEnabled: boolean;
  birthdayWheelEnabled: boolean;
}

export interface BirthdaySurprise {
  id?: string;
  slug: string;
  ownerId: string;
  ownerDisplayName: string;
  recipientName: string;
  recipientNickname?: string;
  senderName: string;
  relationship: string;
  birthdayDate?: string;
  greetingLanguage: 'English' | 'Hindi' | 'Hinglish' | 'Custom';
  customTitle?: string;
  message: string;
  quote?: string;
  reasons: string[];
  wishes: string[];
  memories: MemoryItem[];
  cake: RealisticCakeConfig;
  theme: SurpriseTheme;
  music: MusicConfig;
  specialSettings: SpecialSettings;
  guestbookEnabled: boolean;
  viewCount: number;
  reactions: Record<string, number>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Extra features
  milestones?: JourneyMilestone[];
  personalLetter?: string;
  videoMessageUrl?: string;
}

export interface GuestbookEntry {
  id?: string;
  authorId: string;
  authorName: string;
  message: string;
  emoji?: string;
  createdAt: string;
}

export interface TemplateDefinition {
  id: string;
  title: string;
  description: string;
  tags: string[];
  previewGradient: string;
  accentBadge: string;
  cakeDefaults: Partial<RealisticCakeConfig>;
  themeDefaults: SurpriseTheme;
}
