import { Stack } from 'expo-router';

import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/typography';

export default function AppLayout() {
  const { colors } = useTheme();
  const { isManager } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.onHeader,
        headerTitleStyle: { fontFamily: fonts.semibold },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="issue/[id]" options={{ title: 'Ocorrência' }} />
      <Stack.Screen name="issue/form" options={{ title: 'Relatar problema' }} />
      <Stack.Screen name="about" options={{ title: 'Sobre o app' }} />

      {/* Telas exclusivas do gestor de zeladoria */}
      <Stack.Protected guard={isManager}>
        <Stack.Screen name="detection/[id]" options={{ title: 'Detecção da IA' }} />
        <Stack.Screen name="schedule/form" options={{ title: 'Agenda de captura' }} />
      </Stack.Protected>
    </Stack>
  );
}
