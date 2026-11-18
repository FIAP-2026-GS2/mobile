import { Stack } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/typography';

export default function AppLayout() {
  const { colors } = useTheme();

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
      <Stack.Screen name="profile/edit" options={{ title: 'Editar perfil' }} />
      <Stack.Screen name="about" options={{ title: 'Sobre o app' }} />
    </Stack>
  );
}
