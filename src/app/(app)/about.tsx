import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Linking, Platform, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoRow } from '@/components/ui/InfoRow';
import { RadarLogo } from '@/components/ui/RadarLogo';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { API_BASE_URL, COMMIT_HASH, REPOSITORY_URL } from '@/config/env';
import { spacing } from '@/theme/spacing';

function describePlatform() {
  if (Platform.OS === 'android') return `Android (API ${Platform.Version})`;
  if (Platform.OS === 'ios') return `iOS ${Platform.Version}`;
  return 'Web';
}

export default function AboutScreen() {
  const version = Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '-';
  const build = Application.nativeBuildVersion;

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <RadarLogo size={80} />
        <AppText color="textSecondary" style={styles.center}>
          Projeto acadêmico da Global Solution FIAP 2026/2 (CitizenTech). Não é um aplicativo
          oficial da Prefeitura de São Paulo.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Versão publicada</AppText>
        <InfoRow
          icon="git-commit-outline"
          label="Commit de referência"
          value={COMMIT_HASH ?? 'não disponível'}
        />
        <InfoRow
          icon="pricetag-outline"
          label="Versão"
          value={build ? `${version} (build ${build})` : version}
        />
        <InfoRow icon="phone-portrait-outline" label="Plataforma" value={describePlatform()} />
        <InfoRow icon="server-outline" label="API" value={API_BASE_URL} />
      </Card>

      {COMMIT_HASH ? (
        <Button
          title="Ver commit no GitHub"
          icon="logo-github"
          variant="secondary"
          onPress={() => Linking.openURL(`${REPOSITORY_URL}/commit/${COMMIT_HASH}`)}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: spacing.md,
  },
  center: {
    textAlign: 'center',
  },
});
