import { useFonts } from '@expo-google-fonts/montserrat';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { fontAssets } from '@/theme/typography';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 30 },
  },
});

function RootNavigator() {
  const { user, isRestoring } = useAuth();
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts(fontAssets);
  const isReady = fontsLoaded && !isRestoring;

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  // Ao sair, descarta os dados em cache para o próximo usuário não ver nada do anterior
  useEffect(() => {
    if (!user) queryClient.clear();
  }, [user]);

  if (!isReady) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        {/* Rotas protegidas: só existem para quem está logado */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        {/* Login e cadastro somem depois de entrar; o app redireciona para o login ao sair */}
        <Stack.Protected guard={!user}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
