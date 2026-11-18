import { router, useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/errors';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoRow } from '@/components/ui/InfoRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ErrorState, LoadingState } from '@/components/ui/StateViews';
import { useConfirmDetection, useDetection, useDismissDetection } from '@/hooks/useMonitoring';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';
import { confirmAction, notify } from '@/utils/confirm';
import { goBackOr } from '@/utils/navigation';
import { formatAddress, formatDateTime, formatPercent } from '@/utils/format';
import { severityLabels } from '@/utils/labels';

const LOW_CONFIDENCE = 0.6;

export default function DetectionDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detectionId = Number(id);
  const detection = useDetection(detectionId);
  const confirmDetection = useConfirmDetection();
  const dismissDetection = useDismissDetection();

  if (detection.isLoading) return <LoadingState />;
  if (detection.isError || !detection.data) {
    return <ErrorState error={detection.error} onRetry={detection.refetch} />;
  }

  const data = detection.data;
  const isPending = data.reviewStatus === 'PENDING';
  const severity = data.estimatedSeverity ? severityLabels[data.estimatedSeverity] : null;

  async function handleConfirm() {
    try {
      const issue = await confirmDetection.mutateAsync(detectionId);
      notify('Ocorrência aberta', 'A equipe responsável já pode atender.');
      router.replace({ pathname: '/issue/[id]', params: { id: issue.id } });
    } catch (error) {
      notify('Não foi possível confirmar', getErrorMessage(error));
    }
  }

  async function handleDismiss() {
    const confirmed = await confirmAction(
      'Descartar detecção',
      'Use quando a imagem não mostra um problema real (falso positivo).',
      'Descartar',
    );
    if (!confirmed) return;
    try {
      await dismissDetection.mutateAsync(detectionId);
      goBackOr('/detections');
    } catch (error) {
      notify('Não foi possível descartar', getErrorMessage(error));
    }
  }

  return (
    <ScreenContainer>
      {data.imageUrl ? (
        <Image
          source={{ uri: data.imageUrl }}
          style={[styles.image, { backgroundColor: colors.surfaceAlt }]}
          accessibilityLabel="Imagem capturada pela câmera"
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.badges}>
        <Badge label={`${formatPercent(data.confidenceScore)} de confiança`} tone="primary" />
        {severity ? (
          <Badge label={`Gravidade ${severity.label.toLowerCase()}`} tone={severity.tone} />
        ) : null}
      </View>

      <AppText variant="title">
        {data.suggestedIssueType?.name ?? 'Anomalia não classificada'}
      </AppText>

      <Card>
        <AppText variant="subtitle">Descrição gerada pela IA</AppText>
        <AppText color="textSecondary">{data.description ?? 'Sem descrição.'}</AppText>
        {data.confidenceScore < LOW_CONFIDENCE ? (
          <AppText variant="caption" color="warning">
            Confiança baixa: confira a imagem com atenção antes de confirmar.
          </AppText>
        ) : null}
        <AppText variant="caption" color="textMuted">
          A IA pode errar com chuva, sombra ou obstrução da câmera. A decisão final é sua.
        </AppText>
      </Card>

      <Card>
        <InfoRow
          icon="location-outline"
          label="Ponto monitorado"
          value={formatAddress(data.capture.monitoringPoint)}
        />
        <InfoRow icon="videocam-outline" label="Câmera" value={data.capture.camera.cameraCode} />
        <InfoRow
          icon="time-outline"
          label="Captura"
          value={formatDateTime(data.capture.captureDate)}
        />
        <InfoRow
          icon="hardware-chip-outline"
          label="Modelo"
          value={`${data.aiModel}${data.analysis.modelVersion ? ` v${data.analysis.modelVersion}` : ''}${
            data.analysis.processingTimeMs ? ` · ${data.analysis.processingTimeMs} ms` : ''
          }`}
        />
      </Card>

      {isPending ? (
        <View style={styles.actions}>
          <Button
            title="Confirmar e abrir ocorrência"
            icon="checkmark-circle-outline"
            onPress={handleConfirm}
            loading={confirmDetection.isPending}
          />
          <Button
            title="Descartar (falso positivo)"
            icon="close-circle-outline"
            variant="danger"
            onPress={handleDismiss}
            loading={dismissDetection.isPending}
          />
        </View>
      ) : data.issueReportId ? (
        <Button
          title="Ver ocorrência gerada"
          icon="open-outline"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: '/issue/[id]',
              params: { id: data.issueReportId as number },
            })
          }
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.lg,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actions: {
    gap: spacing.md,
  },
});
