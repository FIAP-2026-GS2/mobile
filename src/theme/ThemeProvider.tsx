import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { preferenceStorage } from '@/storage/preferenceStorage';

import { darkColors, lightColors, type ColorPalette } from './colors';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  colors: ColorPalette;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const PREFERENCE_KEY = 'theme-preference';

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  // O visual do Smart Sampa Cidadão é escuro, então ele é o padrão até a pessoa escolher outro
  const [preference, setPreferenceState] = useState<ThemePreference>('dark');

  useEffect(() => {
    preferenceStorage.get(PREFERENCE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setPreferenceState(saved);
      }
    });
  }, []);

  function setPreference(next: ThemePreference) {
    setPreferenceState(next);
    preferenceStorage.set(PREFERENCE_KEY, next);
  }

  const isDark = preference === 'system' ? systemScheme !== 'light' : preference === 'dark';

  return (
    <ThemeContext.Provider
      value={{ colors: isDark ? darkColors : lightColors, isDark, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa estar dentro de <ThemeProvider>');
  }
  return context;
}
