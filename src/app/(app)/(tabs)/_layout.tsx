import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/typography';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IconName) {
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} size={size} color={color as string} />;
  }
  return TabIcon;
}

// Todos os perfis (cidadão, agente e administrador) veem as mesmas abas
export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.onHeader,
        headerTitleStyle: { fontFamily: fonts.semibold },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', headerShown: false, tabBarIcon: tabIcon('home-outline') }}
      />
      <Tabs.Screen
        name="issues"
        options={{ title: 'Ocorrências', tabBarIcon: tabIcon('warning-outline') }}
      />
      <Tabs.Screen
        name="verify"
        options={{ title: 'Conferir', tabBarIcon: tabIcon('camera-outline') }}
      />
      <Tabs.Screen
        name="assistant"
        options={{ title: 'Assistente', tabBarIcon: tabIcon('sparkles-outline') }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Conta', tabBarIcon: tabIcon('person-circle-outline') }}
      />
    </Tabs>
  );
}
