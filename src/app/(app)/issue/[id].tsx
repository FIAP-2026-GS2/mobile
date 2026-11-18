import { router, useLocalSearchParams } from 'expo-router';
import { Linking, RefreshControl, StyleSheet, View } from 'react-native';

import { IssueTimeline } from '@/components/issues/IssueTimeline';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoRow } from '@/components/ui/InfoRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ErrorState, LoadingState } from '@/components/ui/StateViews';
import { useIssue } from '@/hooks/useIssues';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { formatDateTime, formatLocation } from '@/utils/format';
import { categoryLabels, getStatusLabel, severityLabels, sourceLabels } from '@/utils/labels';

function openInMaps(latitude: number, longitude: number) {
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
}

export default function IssueDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const issue = useIssue(Number(id));

  if (issue.isLoading) return <LoadingState />;
  if (issue.isError || !issue.data) {
    return <ErrorState error={issue.error} onRetry={() => issue.refetch()} />;
  }

  const { summary, description, latitude, longitude, history } = issue.data;
  const status = getStatusLabel(summary.status);
  const severity = summary.severity ? severityLabels[summary.severity] : null;
  const hasCoordinates = latitude !== null && longitude !== null;

  return (
    <ScreenContainer
      refreshControl={
        <RefreshControl
          refreshing={issue.isRefetching}
          onRefresh={() => {
            issue.refetch();
          }}
          tintColor={colors.primary}
        />
      }>
      <View style={styles.badges}>
        <Badge label={status.label} tone={status.tone} />
        {severity ? (
          <Badge label={`Gravidade ${severity.label.toLowerCase()}`} tone={severity.tone} />
        ) : null}
      </View>

      <View style={styles.titleBlock}>
        <AppText variant="overline" color="primary">
          {categoryLabels[summary.category].toUpperCase()} · {summary.issueType.toUpperCase()}
        </AppText>
        <AppText variant="title">{summary.title}</AppText>
        {description ? <AppText color="textSecondary">{description}</AppText> : null}
      </View>

      <Card>
        <InfoRow
          icon="location-outline"
          label="Local"
          value={formatLocation(summary.street, summary.neighborhood)}
        />
        <InfoRow
          icon={summary.source === 'AI' ? 'videocam-outline' : 'person-outline'}
          label="Origem"
          value={sourceLabels[summary.source]}
        />
        <InfoRow
          icon="time-outline"
          label="Aberta em"
          value={formatDateTime(summary.openingDate)}
        />
        {summary.resolutionDate ? (
          <InfoRow
            icon="checkmark-done-outline"
            label="Resolvida em"
            value={formatDateTime(summary.resolutionDate)}
          />
        ) : null}
        {summary.source === 'AI' ? (
          <AppText variant="caption" color="textMuted">
            Detectada automaticamente pela IA nas imagens das câmeras e validada pela prefeitura.
          </AppText>
        ) : null}
      </Card>

      {history.length > 0 ? (
        <Card>
          <AppText variant="subtitle">Acompanhamento</AppText>
          <IssueTimeline entries={history} />
        </Card>
      ) : null}

      <View style={styles.actions}>
        {hasCoordinates ? (
          <Button
            title="Ver no mapa"
            icon="map-outline"
            variant="secondary"
            onPress={() => openInMaps(latitude, longitude)}
          />
        ) : null}
        <Button
          title="Perguntar ao assistente"
          icon="sparkles-outline"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: '/assistant',
              params: { question: `Qual é a situação da ocorrência "${summary.title}"?` },
            })
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  titleBlock: {
    gap: spacing.xs,
  },
  actions: {
    gap: spacing.md,
  },
});
