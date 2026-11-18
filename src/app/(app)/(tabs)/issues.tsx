import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { IssueCard } from '@/components/issues/IssueCard';
import { ChipGroup, type ChipOption } from '@/components/ui/ChipGroup';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';
import { TextField } from '@/components/ui/TextField';
import { useIssueList, useIssueTypes } from '@/hooks/useIssues';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import type { IssueStatus } from '@/types/domain';
import { filterableStatuses, getStatusLabel } from '@/utils/labels';

const ALL = 'ALL';

const statusOptions: ChipOption<IssueStatus | typeof ALL>[] = [
  { value: ALL, label: 'Todas' },
  ...filterableStatuses.map((status) => ({ value: status, label: getStatusLabel(status).label })),
];

export default function IssuesScreen() {
  const { colors } = useTheme();
  const issueTypes = useIssueTypes();
  const [status, setStatus] = useState<IssueStatus | typeof ALL>(ALL);
  const [typeId, setTypeId] = useState<number | typeof ALL>(ALL);
  const [neighborhoodInput, setNeighborhoodInput] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  const issues = useIssueList({
    status: status === ALL ? undefined : status,
    typeId: typeId === ALL ? undefined : typeId,
    neighborhood: neighborhood || undefined,
  });

  const typeOptions: ChipOption<number | typeof ALL>[] = [
    { value: ALL, label: 'Todos os tipos' },
    ...(issueTypes.data ?? []).map((type) => ({ value: type.id, label: type.name })),
  ];

  const items = issues.data?.pages.flatMap((page) => page.content) ?? [];

  function renderContent() {
    if (issues.isLoading) return <LoadingState message="Buscando ocorrências..." />;
    if (issues.isError) return <ErrorState error={issues.error} onRetry={() => issues.refetch()} />;

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
            message="Tente outro filtro ou outro bairro."
          />
        }
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filters}>
        <TextField
          label="Bairro"
          value={neighborhoodInput}
          onChangeText={setNeighborhoodInput}
          onSubmitEditing={() => setNeighborhood(neighborhoodInput.trim())}
          onBlur={() => setNeighborhood(neighborhoodInput.trim())}
          placeholder="Ex.: Bela Vista"
          returnKeyType="search"
        />
        <ChipGroup options={statusOptions} value={status} onChange={setStatus} scrollable />
        <ChipGroup options={typeOptions} value={typeId} onChange={setTypeId} scrollable />
      </View>
      {renderContent()}
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
    flexGrow: 1,
  },
});
