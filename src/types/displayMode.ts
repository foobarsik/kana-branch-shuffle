export enum DisplayMode {
  KANA_ONLY = 'KANA_ONLY',
  LEFT_KANA_RIGHT_ROMAJI = 'LEFT_KANA_RIGHT_ROMAJI',
  SMART_FLIP = 'SMART_FLIP',
  LARGE = 'LARGE'
}

export const DISPLAY_MODE_LABELS = {
  [DisplayMode.LARGE]: 'XL',
  [DisplayMode.LEFT_KANA_RIGHT_ROMAJI]: 'Split',
  [DisplayMode.SMART_FLIP]: 'Smart Flip',
  [DisplayMode.KANA_ONLY]: 'Kana Only',
} as const;