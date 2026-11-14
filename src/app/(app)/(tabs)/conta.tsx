import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChipGroup, type ChipOption } from '@/components/ui/ChipGroup';
import { InfoRow } from '@/components/ui/InfoRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useAuth } from '@/context/AuthProvider';
import { useTheme, type ThemePreference } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';
import { confirmAction } from '@/utils/confirm';
import { formatDate } from '@/utils/format';
import { userTypeLabels } from '@/utils/labels';

const themeOptions: ChipOption<ThemePreference>[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'dark', label: 'Escuro' },
  { value: 'light', label: 'Claro' },
];

export default function AccountScreen() {
  const { colors, preference, setPreference } = useTheme();
  const { user, signOut } = useAuth();

  if (!user) return null;

  async function handleSignOut() {
    const confirmed = await confirmAction(
      'Sair da conta',
      'Você precisará entrar de novo.',
      'Sair',
    );
    if (confirmed) await signOut();
  }

  return (
    <ScreenContainer>
      <View style={styles.profile}>
        <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
          <AppText variant="title" color="primary">
            {user.name.charAt(0).toUpperCase()}
          </AppText>
        </View>
        <AppText variant="title">{user.name}</AppText>
        <Badge label={userTypeLabels[user.userType]} tone="primary" />
      </View>

      <Card>
        <InfoRow icon="mail-outline" label="E-mail" value={user.email} />
        <InfoRow
          icon="calendar-outline"
          label="Cadastro"
          value={formatDate(user.registrationDate)}
        />
      </Card>

      <Card>
        <ChipGroup
          label="Tema"
          options={themeOptions}
          value={preference}
          onChange={setPreference}
        />
      </Card>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/sobre')}
        style={[styles.link, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
        <AppText variant="bodyStrong" style={styles.flex}>
          Sobre o app
        </AppText>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Pressable>

      <Button title="Sair" icon="log-out-outline" variant="danger" onPress={handleSignOut} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  flex: {
    flex: 1,
  },
});
