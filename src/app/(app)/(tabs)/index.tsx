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
import { useIssueList } from '@/hooks/useIssues';
import { useDashboardSummary } from '@/hooks/useMonitoring';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, isManager } = useAuth();
  const summary = useDashboardSummary();
  const recentIssues = useIssueList({ mine: isManager ? undefined : true });

  const firstName = user?.name.split(' ')[0] ?? '';
  const recent = recentIssues.data?.pages[0]?.content.slice(0, 3) ?? [];

  function refresh() {
    summary.refetch();
    recentIssues.refetch();
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.header }]}>
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <ScreenContainer
          refreshControl={
            <RefreshControl
              refreshing={summary.isRefetching}
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
                {isManager ? 'Painel da zeladoria' : 'Sua cidade em dia'}
              </AppText>
            </View>
          </View>

          {summary.isLoading ? (
            <LoadingState />
          ) : summary.isError ? (
            <ErrorState error={summary.error} onRetry={summary.refetch} />
          ) : summary.data ? (
            <View style={styles.grid}>
              {isManager ? (
                <>
                  <StatTile
                    icon="scan-outline"
                    label="Detecções para revisar"
                    value={summary.data.pendingDetections}
                    tone="primary"
                  />
                  <StatTile
                    icon="alert-circle-outline"
                    label="Ocorrências abertas"
                    value={summary.data.openIssues}
                    tone="warning"
                  />
                  <StatTile
                    icon="construct-outline"
                    label="Em atendimento"
                    value={summary.data.inProgressIssues}
                    tone="secondary"
                  />
                  <StatTile
                    icon="calendar-outline"
                    label="Agendas ativas"
                    value={summary.data.activeSchedules}
                    tone="success"
                  />
                </>
              ) : (
                <>
                  <StatTile
                    icon="document-text-outline"
                    label="Meus relatos abertos"
                    value={summary.data.myOpenIssues}
                    tone="warning"
                  />
                  <StatTile
                    icon="checkmark-circle-outline"
                    label="Resolvidas na cidade"
                    value={summary.data.resolvedIssues}
                    tone="success"
                  />
                </>
              )}
            </View>
          ) : null}

          {isManager ? (
            <Button
              title="Revisar detecções da IA"
              icon="scan-outline"
              onPress={() => router.push('/detections')}
            />
          ) : (
            <Button
              title="Relatar um problema"
              icon="add-circle-outline"
              onPress={() => router.push('/issue/form')}
            />
          )}

          <AppText variant="subtitle">
            {isManager ? 'Ocorrências recentes' : 'Meus relatos recentes'}
          </AppText>
          {recentIssues.isLoading ? (
            <LoadingState />
          ) : recent.length === 0 ? (
            <EmptyState
              icon="sparkles-outline"
              title="Nada por aqui ainda"
              message="Quando houver ocorrências, elas aparecem nesta lista."
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
              Como funciona: câmeras do Smart Sampa que já apontam para postes, ruas e semáforos
              fazem capturas semanais ou mensais. A IA aponta possíveis problemas e um gestor
              confirma antes de abrir a ocorrência.
            </AppText>
          </View>
        </ScreenContainer>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
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
