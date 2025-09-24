export enum DisplayMode {
  KANA_ONLY = 'KANA_ONLY',
  LEFT_KANA_RIGHT_ROMAJI = 'LEFT_KANA_RIGHT_ROMAJI', 
  SMART_FLIP = 'SMART_FLIP'
}

export const DISPLAY_MODE_LABELS = {
  [DisplayMode.KANA_ONLY]: 'Kana Only',
  [DisplayMode.LEFT_KANA_RIGHT_ROMAJI]: 'Left Kana, Right Romaji',
  [DisplayMode.SMART_FLIP]: 'Smart Flip'
} as const;