import { router } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ResolvedIssueCard } from '@/components/citizenFeedback/ResolvedIssueCard';
import { AppText } from '@/components/ui/AppText';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';
import { useResolvedIssues } from '@/hooks/useCitizenFeedback';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';

export default function VerifyScreen() {
  const { colors } = useTheme();
  const issues = useResolvedIssues();
  const items = issues.data?.pages.flatMap((page) => page.items) ?? [];

  if (issues.isLoading) return <LoadingState message="Buscando consertos..." />;
  if (issues.isError) return <ErrorState error={issues.error} onRetry={() => issues.refetch()} />;

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={items}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <ResolvedIssueCard
          issue={item}
          onPress={() => router.push({ pathname: '/verification/[id]', params: { id: item.id } })}
        />
      )}
      ListHeaderComponent={
        <View style={[styles.intro, { backgroundColor: colors.surfaceAlt }]}>
          <AppText variant="subtitle">Passou por um desses lugares?</AppText>
          <AppText color="textSecondary">
            A prefeitura marcou estes problemas como resolvidos. Tire uma foto do local para
            confirmar o conserto ou contestar se o problema continua lá.
          </AppText>
        </View>
      }
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
          icon="construct-outline"
          title="Nenhum conserto para conferir"
          message="Quando a prefeitura resolver uma ocorrência, ela aparece aqui."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.xl,
    gap: spacing.md,
    flexGrow: 1,
  },
  intro: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});
