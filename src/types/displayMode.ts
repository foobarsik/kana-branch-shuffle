export enum DisplayMode {
  KANA_ONLY = 'KANA_ONLY',
  LEFT_KANA_RIGHT_ROMAJI = 'LEFT_KANA_RIGHT_ROMAJI', 
  SMART_FLIP = 'SMART_FLIP'
}

export const DISPLAY_MODE_LABELS = {
  [DisplayMode.KANA_ONLY]: 'Только каны',
  [DisplayMode.LEFT_KANA_RIGHT_ROMAJI]: 'Левая - каны, правая - перевод',
  [DisplayMode.SMART_FLIP]: 'Умное переворачивание'
} as const;