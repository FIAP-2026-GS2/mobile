import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { FloatingButton } from '@/components/ui/FloatingButton';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';
import { useSchedules } from '@/hooks/useMonitoring';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { describeSchedule, formatAddress } from '@/utils/format';

export default function SchedulesScreen() {
  const { colors } = useTheme();
  const schedules = useSchedules();

  function openForm(id?: number) {
    router.push({ pathname: '/schedule/form', params: id ? { id } : {} });
  }

  function renderContent() {
    if (schedules.isLoading) return <LoadingState message="Buscando agendas..." />;
    if (schedules.isError) {
      return <ErrorState error={schedules.error} onRetry={schedules.refetch} />;
    }
    return (
      <FlatList
        data={schedules.data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            onPress={() => openForm(item.id)}
            accessibilityLabel={`Agenda da câmera ${item.camera.cameraCode}`}>
            <View style={styles.header}>
              <Ionicons name="videocam-outline" size={16} color={colors.primary} />
              <AppText variant="overline" color="primary" style={styles.flex}>
                {item.camera.cameraCode}
              </AppText>
              <Badge
                label={item.isActive ? 'Ativa' : 'Pausada'}
                tone={item.isActive ? 'success' : 'textMuted'}
              />
            </View>
            <AppText variant="subtitle">{formatAddress(item.camera.monitoringPoint)}</AppText>
            <AppText color="textSecondary">{describeSchedule(item)}</AppText>
          </Card>
        )}
        refreshControl={
          <RefreshControl
            refreshing={schedules.isRefetching}
            onRefresh={() => {
              schedules.refetch();
            }}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <AppText color="textSecondary">
            Defina quando cada câmera fotografa o item que ela enxerga (poste, via, semáforo). As
            imagens vão para a análise da IA.
          </AppText>
        }
        ListEmptyComponent={
          <EmptyState icon="calendar-outline" title="Nenhuma agenda cadastrada" />
        }
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderContent()}
      <FloatingButton
        icon="add"
        accessibilityLabel="Nova agenda de captura"
        onPress={() => openForm()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: 120,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
