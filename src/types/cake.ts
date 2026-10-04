export type CakePresetStyle =
  | 'luxury_floral'
  | 'chocolate_drip'
  | 'minimal_white'
  | 'pink_rose'
  | 'black_gold'
  | 'galaxy'
  | 'red_velvet_heart'
  | 'funfetti_party';

export type CakeShapeType = 'round' | 'square' | 'heart' | 'two_tier' | 'three_tier';
export type CakeSizeType = 'small' | 'medium' | 'large';
export type CakeFlavorType =
  | 'chocolate'
  | 'vanilla'
  | 'red_velvet'
  | 'butterscotch'
  | 'strawberry'
  | 'black_forest'
  | 'custom';

export type IcingFinishType =
  | 'smooth_buttercream'
  | 'whipped_cream'
  | 'chocolate_glaze'
  | 'drip_icing'
  | 'textured_floral';

export type CakeBorderStyle =
  | 'pearl_border'
  | 'swirl_border'
  | 'minimal_clean'
  | 'piped_floral';

export type CakePlateStyleType =
  | 'white_porcelain'
  | 'gold_metallic'
  | 'black_marble'
  | 'pastel_ceramic';

export type CakeDecorationItem =
  | 'metallic_sprinkles'
  | 'chocolate_shards'
  | 'fresh_berries'
  | 'cherries'
  | 'edible_flowers'
  | 'gold_leaf_flakes'
  | 'macarons'
  | 'mini_hearts'
  | 'star_fondant'
  | 'balloon_topper';

export type DecorationIntensity = 'minimal' | 'balanced' | 'rich';

export type TopperMaterial =
  | 'gold_acrylic'
  | 'silver_acrylic'
  | 'neon_acrylic'
  | 'chocolate_lettering'
  | 'fondant_lettering'
  | 'edible_plaque';

export type TopperPosition = 'center_top' | 'front_plaque' | 'floating_rear';

export interface MemorySliceReward {
  type: 'photo' | 'message' | 'video' | 'gift' | null;
  content: string | null;
  mediaUrl: string | null;
}

export interface RealisticCakeConfig {
  enabled: boolean;
  style: CakePresetStyle;
  shape: CakeShapeType;
  size: CakeSizeType;
  flavorLabel: CakeFlavorType;
  frostingColor: string;
  baseColor: string;
  accentColor: string;
  icingStyle: IcingFinishType;
  borderStyle: CakeBorderStyle;
  plateStyle: CakePlateStyleType;
  decorations: CakeDecorationItem[];
  decorationIntensity: DecorationIntensity;
  topperText: string;
  topperFont?: string;
  topperColor: string;
  topperMaterial: TopperMaterial;
  topperPosition: TopperPosition;
  age: number | null;
  candleColor: string;
  candleCount: number;
  candlesLit: boolean;
  microphoneBlowEnabled: boolean;
  blowSensitivity: 'low' | 'normal' | 'high';
  cakeCutEnabled: boolean;
  hiddenNoteAfterBlow: string | null;
  memorySliceReward: MemorySliceReward;
}

export interface CakeCutState {
  isCut: boolean;
  cutProgress: number; // 0 to 1
  sliceOffset: number; // pixels slice moved
}
