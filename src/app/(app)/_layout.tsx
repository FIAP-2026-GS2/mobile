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
      <Stack.Screen name="ocorrencia/[id]" options={{ title: 'Ocorrência' }} />
      <Stack.Screen name="ocorrencia/formulario" options={{ title: 'Relatar problema' }} />
      <Stack.Screen name="sobre" options={{ title: 'Sobre o app' }} />

      {/* Telas exclusivas do gestor de zeladoria */}
      <Stack.Protected guard={isManager}>
        <Stack.Screen name="deteccao/[id]" options={{ title: 'Detecção da IA' }} />
        <Stack.Screen name="agenda/formulario" options={{ title: 'Agenda de captura' }} />
      </Stack.Protected>
    </Stack>
  );
}
