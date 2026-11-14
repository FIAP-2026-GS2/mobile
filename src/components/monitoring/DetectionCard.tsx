import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { spacing } from '@/theme/spacing';
import type { AiDetection } from '@/types/domain';
import { formatAddress, formatDateTime, formatPercent } from '@/utils/format';
import { severityLabels } from '@/utils/labels';

type DetectionCardProps = {
  detection: AiDetection;
  onPress: () => void;
};

export function DetectionCard({ detection, onPress }: DetectionCardProps) {
  const severity = detection.estimatedSeverity ? severityLabels[detection.estimatedSeverity] : null;
  const typeName = detection.suggestedIssueType?.name ?? 'Anomalia não classificada';

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${typeName}, confiança ${formatPercent(detection.confidenceScore)}`}>
      <View style={styles.header}>
        <AppText variant="overline" color="primary" style={styles.flex}>
          {detection.capture.camera.cameraCode}
        </AppText>
        <Badge label={`${formatPercent(detection.confidenceScore)} de confiança`} tone="primary" />
      </View>
      <AppText variant="subtitle">{typeName}</AppText>
      <AppText variant="caption" color="textSecondary">
        {formatAddress(detection.capture.monitoringPoint)}
      </AppText>
      <View style={styles.footer}>
        <AppText variant="caption" color="textMuted" style={styles.flex}>
          Captura de {formatDateTime(detection.capture.captureDate)}
        </AppText>
        {severity ? <Badge label={severity.label} tone={severity.tone} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
