import { router } from 'expo-router';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/errors';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChipGroup, type ChipOption } from '@/components/ui/ChipGroup';
import { InfoRow } from '@/components/ui/InfoRow';
import { MenuLink } from '@/components/ui/MenuLink';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useAuth } from '@/context/AuthProvider';
import { useDeleteAccount, useProfile } from '@/hooks/useProfile';
import { useTheme, type ThemePreference } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { confirmAction, notify } from '@/utils/confirm';
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
  const profile = useProfile();
  const deleteAccount = useDeleteAccount();

  if (!user) return null;

  async function handleSignOut() {
    const confirmed = await confirmAction(
      'Sair da conta',
      'Você precisará entrar de novo.',
      'Sair',
    );
    if (confirmed) await signOut();
  }

  async function handleDeleteAccount() {
    const confirmed = await confirmAction(
      'Excluir conta',
      'Seus dados e o histórico do assistente serão apagados. Esta ação não pode ser desfeita.',
      'Excluir',
    );
    if (!confirmed) return;
    try {
      await deleteAccount.mutateAsync();
    } catch (error) {
      notify('Não foi possível excluir a conta', getErrorMessage(error));
    }
  }

  return (
    <ScreenContainer
      refreshControl={
        <RefreshControl
          refreshing={profile.isRefetching}
          onRefresh={() => {
            profile.refetch();
          }}
          tintColor={colors.primary}
        />
      }>
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

      <MenuLink
        icon="create-outline"
        title="Editar perfil"
        onPress={() => router.push('/profile/edit')}
      />
      <MenuLink
        icon="information-circle-outline"
        title="Sobre o app"
        onPress={() => router.push('/about')}
      />

      <Card>
        <ChipGroup
          label="Tema"
          options={themeOptions}
          value={preference}
          onChange={setPreference}
        />
      </Card>

      <View style={styles.actions}>
        <Button title="Sair" icon="log-out-outline" variant="secondary" onPress={handleSignOut} />
        <Button
          title="Excluir conta"
          icon="trash-outline"
          variant="danger"
          onPress={handleDeleteAccount}
          loading={deleteAccount.isPending}
        />
      </View>
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
  actions: {
    gap: spacing.md,
  },
});
