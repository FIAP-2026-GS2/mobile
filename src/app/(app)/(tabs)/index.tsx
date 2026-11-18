import { router } from 'expo-router';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IssueCard } from '@/components/issues/IssueCard';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { RadarLogo } from '@/components/ui/RadarLogo';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatTile } from '@/components/ui/StatTile';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';
import { useAuth } from '@/context/AuthProvider';
import { useIssueCount, useIssueList } from '@/hooks/useIssues';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';

const RECENT_ISSUES_LIMIT = 3;

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const openCount = useIssueCount('OPEN');
  const inProgressCount = useIssueCount('IN_PROGRESS');
  const resolvedCount = useIssueCount('RESOLVED');
  const recentIssues = useIssueList({});

  const firstName = user?.name.split(' ')[0] ?? '';
  const recent = recentIssues.data?.pages[0]?.content.slice(0, RECENT_ISSUES_LIMIT) ?? [];
  const isRefreshing = recentIssues.isRefetching || openCount.isRefetching;

  function refresh() {
    openCount.refetch();
    inProgressCount.refetch();
    resolvedCount.refetch();
    recentIssues.refetch();
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.flex, { backgroundColor: colors.header }]}>
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <ScreenContainer
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
            />
          }>
          <View style={[styles.hero, { backgroundColor: colors.header }]}>
            <RadarLogo size={56} showName={false} />
            <View style={styles.flex}>
              <AppText variant="caption" style={{ color: colors.onHeader }}>
                Olá, {firstName}
              </AppText>
              <AppText variant="title" style={{ color: colors.onHeader }}>
                Sua cidade em dia
              </AppText>
            </View>
          </View>

          <View style={styles.grid}>
            <StatTile
              icon="alert-circle-outline"
              label="Abertas"
              value={openCount.data ?? '–'}
              tone="warning"
            />
            <StatTile
              icon="construct-outline"
              label="Em atendimento"
              value={inProgressCount.data ?? '–'}
              tone="primary"
            />
            <StatTile
              icon="checkmark-circle-outline"
              label="Resolvidas"
              value={resolvedCount.data ?? '–'}
              tone="success"
            />
          </View>

          <Button
            title="Perguntar ao assistente"
            icon="sparkles-outline"
            onPress={() => router.push('/assistant')}
          />

          <AppText variant="subtitle">Ocorrências recentes</AppText>
          {recentIssues.isLoading ? (
            <LoadingState />
          ) : recentIssues.isError ? (
            <ErrorState error={recentIssues.error} onRetry={() => recentIssues.refetch()} />
          ) : recent.length === 0 ? (
            <EmptyState
              icon="sparkles-outline"
              title="Nenhuma ocorrência por enquanto"
              message="Quando as câmeras encontrarem problemas, eles aparecem aqui."
            />
          ) : (
            recent.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onPress={() => router.push({ pathname: '/issue/[id]', params: { id: issue.id } })}
              />
            ))
          )}

          <View style={[styles.tip, { borderColor: colors.border }]}>
            <AppText variant="caption" color="textSecondary">
              Como funciona: câmeras do Smart Sampa que já apontam para postes, ruas e calçadas
              fazem capturas periódicas. A IA aponta possíveis problemas, a prefeitura valida e você
              acompanha o atendimento por aqui.
            </AppText>
          </View>
        </ScreenContainer>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginHorizontal: -spacing.xl,
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tip: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing.lg,
  },
});
