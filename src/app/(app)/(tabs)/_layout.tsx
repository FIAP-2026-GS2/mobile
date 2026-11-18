import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/typography';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IconName) {
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} size={size} color={color as string} />;
  }
  return TabIcon;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { isManager } = useAuth();

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

      {/* Abas que só aparecem para o gestor de zeladoria */}
      <Tabs.Protected guard={isManager}>
        <Tabs.Screen
          name="detections"
          options={{ title: 'Detecções', tabBarIcon: tabIcon('scan-outline') }}
        />
        <Tabs.Screen
          name="schedules"
          options={{ title: 'Agendas', tabBarIcon: tabIcon('calendar-outline') }}
        />
      </Tabs.Protected>

      <Tabs.Screen
        name="account"
        options={{ title: 'Conta', tabBarIcon: tabIcon('person-circle-outline') }}
      />
    </Tabs>
  );
}
