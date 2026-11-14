// Paleta inspirada no Smart Sampa Cidadão: fundo azul-noite, ciano e azul nos destaques.

export const darkColors = {
  background: '#0A0E1A',
  surface: '#131A2C',
  surfaceAlt: '#1B2440',
  border: '#26314F',
  header: '#0A0E1A',
  onHeader: '#FFFFFF',
  text: '#FFFFFF',
  textSecondary: '#A9B4CC',
  textMuted: '#6E7A96',
  primary: '#2AB3F0',
  onPrimary: '#04121F',
  secondary: '#3778DE',
  danger: '#F0546A',
  warning: '#F3AE00',
  success: '#1FC98E',
  tabInactive: '#6E7A96',
};

export const lightColors: typeof darkColors = {
  background: '#F2F6FC',
  surface: '#FFFFFF',
  surfaceAlt: '#E6EEF9',
  border: '#D3DDEC',
  header: '#0A0E1A',
  onHeader: '#FFFFFF',
  text: '#0B1630',
  textSecondary: '#4D5B76',
  textMuted: '#7A869E',
  primary: '#0A7BC4',
  onPrimary: '#FFFFFF',
  secondary: '#0A4A8E',
  danger: '#D32F45',
  warning: '#B57F00',
  success: '#0F9D6B',
  tabInactive: '#7A869E',
};

export type ColorPalette = typeof darkColors;
