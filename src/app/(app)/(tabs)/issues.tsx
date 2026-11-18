import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { IssueCard } from '@/components/issues/IssueCard';
import { ChipGroup, type ChipOption } from '@/components/ui/ChipGroup';
import { FloatingButton } from '@/components/ui/FloatingButton';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';
import { useAuth } from '@/context/AuthProvider';
import { useIssueList } from '@/hooks/useIssues';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import type { IssueStatus } from '@/types/domain';
import { issueStatusLabels } from '@/utils/labels';

type StatusFilter = IssueStatus | 'ALL';
type ScopeFilter = 'MINE' | 'CITY';

const statusOptions: ChipOption<StatusFilter>[] = [
  { value: 'ALL', label: 'Todas' },
  ...(Object.keys(issueStatusLabels) as IssueStatus[]).map((status) => ({
    value: status,
    label: issueStatusLabels[status].label,
  })),
];

const scopeOptions: ChipOption<ScopeFilter>[] = [
  { value: 'MINE', label: 'Meus relatos' },
  { value: 'CITY', label: 'Toda a cidade' },
];

export default function IssuesScreen() {
  const { colors } = useTheme();
  const { isManager } = useAuth();
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [scope, setScope] = useState<ScopeFilter>('MINE');

  const issues = useIssueList({
    status: status === 'ALL' ? undefined : status,
    mine: !isManager && scope === 'MINE' ? true : undefined,
  });

  const items = issues.data?.pages.flatMap((page) => page.content) ?? [];

  function renderContent() {
    if (issues.isLoading) return <LoadingState message="Buscando ocorrências..." />;
    if (issues.isError) return <ErrorState error={issues.error} onRetry={issues.refetch} />;

    return (
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <IssueCard
            issue={item}
            onPress={() => router.push({ pathname: '/issue/[id]', params: { id: item.id } })}
          />
        )}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (issues.hasNextPage && !issues.isFetchingNextPage) issues.fetchNextPage();
        }}
        refreshControl={
          <RefreshControl
            refreshing={issues.isRefetching && !issues.isFetchingNextPage}
            onRefresh={() => {
              issues.refetch();
            }}
            tintColor={colors.primary}
          />
        }
        ListFooterComponent={
          issues.isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : undefined
        }
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-done-outline"
            title="Nenhuma ocorrência encontrada"
            message="Tente outro filtro ou relate um novo problema."
          />
        }
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filters}>
        {!isManager ? <ChipGroup options={scopeOptions} value={scope} onChange={setScope} /> : null}
        <ChipGroup options={statusOptions} value={status} onChange={setStatus} scrollable />
      </View>
      {renderContent()}
      {!isManager ? (
        <FloatingButton
          icon="add"
          accessibilityLabel="Relatar um problema"
          onPress={() => router.push('/issue/form')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filters: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  list: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: 120,
    flexGrow: 1,
  },
});
