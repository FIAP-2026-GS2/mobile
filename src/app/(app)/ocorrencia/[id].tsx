import { router, useLocalSearchParams } from 'expo-router';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/errors';
import { IssueTimeline } from '@/components/issues/IssueTimeline';
import { StatusChangeForm } from '@/components/issues/StatusChangeForm';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoRow } from '@/components/ui/InfoRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ErrorState, LoadingState } from '@/components/ui/StateViews';
import { useAuth } from '@/context/AuthProvider';
import { useDeleteIssue, useIssue } from '@/hooks/useIssues';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { confirmAction, notify } from '@/utils/confirm';
import { goBackOr } from '@/utils/navigation';
import { formatAddress, formatDateTime, formatPercent } from '@/utils/format';
import { issueStatusLabels, severityLabels, sourceLabels } from '@/utils/labels';

export default function IssueDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const issueId = Number(id);
  const { user, isManager } = useAuth();
  const issue = useIssue(issueId);
  const deleteIssue = useDeleteIssue();

  if (issue.isLoading) return <LoadingState />;
  if (issue.isError || !issue.data) {
    return <ErrorState error={issue.error} onRetry={issue.refetch} />;
  }

  const data = issue.data;
  const status = issueStatusLabels[data.status];
  // O cidadão só altera o próprio relato enquanto ninguém começou a atendê-lo
  const canEdit = !isManager && data.reportedBy?.id === user?.id && data.status === 'OPEN';
  const isClosed = data.status === 'RESOLVED' || data.status === 'CANCELLED';

  async function handleDelete() {
    const confirmed = await confirmAction(
      'Excluir relato',
      'Esta ação não pode ser desfeita.',
      'Excluir',
    );
    if (!confirmed) return;
    try {
      await deleteIssue.mutateAsync(issueId);
      goBackOr('/ocorrencias');
    } catch (error) {
      notify('Não foi possível excluir', getErrorMessage(error));
    }
  }

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
        {data.severity ? (
          <Badge
            label={`Gravidade ${severityLabels[data.severity].label.toLowerCase()}`}
            tone={severityLabels[data.severity].tone}
          />
        ) : null}
      </View>

      <View style={styles.titleBlock}>
        <AppText variant="overline" color="primary">
          {data.issueType.category.toUpperCase()} · {data.issueType.name.toUpperCase()}
        </AppText>
        <AppText variant="title">{data.title}</AppText>
        {data.description ? <AppText color="textSecondary">{data.description}</AppText> : null}
      </View>

      <Card>
        {data.monitoringPoint ? (
          <InfoRow
            icon="location-outline"
            label="Local"
            value={formatAddress(data.monitoringPoint)}
          />
        ) : null}
        <InfoRow
          icon={data.source === 'CAMERA' ? 'videocam-outline' : 'person-outline'}
          label="Origem"
          value={
            data.reportedBy
              ? `${sourceLabels[data.source]} (${data.reportedBy.name})`
              : sourceLabels[data.source]
          }
        />
        <InfoRow icon="time-outline" label="Aberta em" value={formatDateTime(data.openingDate)} />
        {data.resolutionDate ? (
          <InfoRow
            icon="checkmark-done-outline"
            label="Resolvida em"
            value={formatDateTime(data.resolutionDate)}
          />
        ) : null}
      </Card>

      {data.detection ? (
        <Card>
          <AppText variant="subtitle">Análise da câmera</AppText>
          <InfoRow
            icon="speedometer-outline"
            label="Confiança da detecção"
            value={`${formatPercent(data.detection.confidenceScore)} · modelo ${data.detection.aiModel}`}
          />
          {data.detection.description ? (
            <AppText color="textSecondary">{data.detection.description}</AppText>
          ) : null}
          <AppText variant="caption" color="textMuted">
            Texto gerado por IA e revisado por um gestor antes de abrir a ocorrência.
          </AppText>
        </Card>
      ) : null}

      {data.history && data.history.length > 0 ? (
        <Card>
          <AppText variant="subtitle">Acompanhamento</AppText>
          <IssueTimeline entries={data.history} />
        </Card>
      ) : null}

      {isManager && !isClosed ? <StatusChangeForm issue={data} /> : null}

      {canEdit ? (
        <View style={styles.actions}>
          <Button
            title="Editar relato"
            icon="create-outline"
            variant="secondary"
            onPress={() =>
              router.push({ pathname: '/ocorrencia/formulario', params: { id: data.id } })
            }
          />
          <Button
            title="Excluir relato"
            icon="trash-outline"
            variant="danger"
            onPress={handleDelete}
            loading={deleteIssue.isPending}
          />
        </View>
      ) : null}
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
