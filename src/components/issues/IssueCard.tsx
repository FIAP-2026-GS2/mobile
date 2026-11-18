import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import type { IssueSummary } from '@/types/domain';
import { formatDateTime, formatLocation } from '@/utils/format';
import { getStatusLabel } from '@/utils/labels';

type IssueCardProps = {
  issue: IssueSummary;
  onPress: () => void;
};

export function IssueCard({ issue, onPress }: IssueCardProps) {
  const { colors } = useTheme();
  const status = getStatusLabel(issue.status);

  return (
    <Card onPress={onPress} accessibilityLabel={`${issue.title}, ${status.label}`}>
      <View style={styles.header}>
        <Ionicons
          name={issue.source === 'AI' ? 'videocam-outline' : 'person-outline'}
          size={16}
          color={colors.primary}
        />
        <AppText variant="overline" color="primary" style={styles.flex} numberOfLines={1}>
          {issue.issueType.toUpperCase()}
        </AppText>
        <Badge label={status.label} tone={status.tone} />
      </View>
      <AppText variant="subtitle" numberOfLines={2}>
        {issue.title}
      </AppText>
      <AppText variant="caption" color="textSecondary" numberOfLines={1}>
        {formatLocation(issue.street, issue.neighborhood)}
      </AppText>
      <AppText variant="caption" color="textMuted">
        Aberta em {formatDateTime(issue.openingDate)}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
