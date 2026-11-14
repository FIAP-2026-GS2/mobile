import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { DetectionCard } from '@/components/monitoring/DetectionCard';
import { ChipGroup, type ChipOption } from '@/components/ui/ChipGroup';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';
import { useDetections } from '@/hooks/useMonitoring';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import type { DetectionReviewStatus } from '@/types/domain';

const reviewOptions: ChipOption<DetectionReviewStatus>[] = [
  { value: 'PENDING', label: 'Para revisar' },
  { value: 'CONFIRMED', label: 'Confirmadas' },
  { value: 'DISMISSED', label: 'Descartadas' },
];

export default function DetectionsScreen() {
  const { colors } = useTheme();
  const [reviewStatus, setReviewStatus] = useState<DetectionReviewStatus>('PENDING');
  const detections = useDetections(reviewStatus);

  function renderContent() {
    if (detections.isLoading) return <LoadingState message="Buscando detecções..." />;
    if (detections.isError) {
      return <ErrorState error={detections.error} onRetry={detections.refetch} />;
    }
    return (
      <FlatList
        data={detections.data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DetectionCard
            detection={item}
            onPress={() => router.push({ pathname: '/deteccao/[id]', params: { id: item.id } })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={detections.isRefetching}
            onRefresh={() => {
              detections.refetch();
            }}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="scan-outline"
            title="Fila vazia"
            message="As próximas capturas agendadas vão trazer novas detecções."
          />
        }
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filters}>
        <ChipGroup options={reviewOptions} value={reviewStatus} onChange={setReviewStatus} />
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
  },
  list: {
    padding: spacing.xl,
    gap: spacing.md,
    flexGrow: 1,
  },
});
