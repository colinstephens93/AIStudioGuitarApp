export interface SongMetadata {
  title: string;
  artist: string;
  album: string;
  year: string;
  cover_status: string;
}

export interface RigSelection {
  guitar: string;
  amp: string;
  pickup_selection: string;
}

export interface AcousticAudit {
  attack_and_dynamics?: string;
  frequency_profile?: string;
  saturation_type?: string;
  modulation?: string;
  [key: string]: string | undefined;
}

export interface SignalChainItem {
  order: number | string;
  pedal_name: string;
  status: string;
}

export interface AmpSettingItem {
  control: string;
  setting: string;
}

export interface PedalControlItem {
  control: string;
  setting: string;
}

export interface FixedPedalSetting {
  pedal_name: string;
  controls: PedalControlItem[];
}

export interface SongPartItem {
  part_name: string;
  active_pedals: string[] | string;
  pickup_position?: string;
}

export interface RecipeJson {
  song_metadata: SongMetadata;
  rig_selection: RigSelection;
  acoustic_audit?: AcousticAudit;
  signal_chain: SignalChainItem[];
  amp_settings: AmpSettingItem[];
  fixed_pedal_settings: FixedPedalSetting[];
  song_parts: SongPartItem[];
  notes: string;
}

export interface GenerateRecipeRequest {
  systemInstruction: string;
  schemaDict: Record<string, any>;
  specsText: string;
  userPrompt: string;
  stemAudio?: {
    filename: string;
    mimeType: string;
    base64Data: string;
  };
}

export interface GenerateRecipeResponse {
  rawText: string;
  recipeJson?: RecipeJson | null;
  callPath: "single_call" | "two_call_fallback";
  error?: string;
}
