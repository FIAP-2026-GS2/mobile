import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import type { PublicIssueReport } from '@/types/domain';
import { formatDateTime, formatLocation } from '@/utils/format';

import { FeedbackCounters } from './FeedbackCounters';

type ResolvedIssueCardProps = {
  issue: PublicIssueReport;
  onPress: () => void;
};

export function ResolvedIssueCard({ issue, onPress }: ResolvedIssueCardProps) {
  const { colors } = useTheme();

  return (
    <Card onPress={onPress} accessibilityLabel={`Conferir conserto: ${issue.title}`}>
      <View style={styles.header}>
        <Ionicons name="checkmark-done-outline" size={16} color={colors.success} />
        <AppText variant="overline" color="success" style={styles.flex} numberOfLines={1}>
          {issue.issueTypeName.toUpperCase()}
        </AppText>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
      <AppText variant="subtitle" numberOfLines={2}>
        {issue.title}
      </AppText>
      <AppText variant="caption" color="textSecondary" numberOfLines={1}>
        {formatLocation(issue.street, issue.neighborhood)}
      </AppText>
      {issue.resolutionDate ? (
        <AppText variant="caption" color="textMuted">
          Resolvida em {formatDateTime(issue.resolutionDate)}
        </AppText>
      ) : null}
      <FeedbackCounters
        confirmations={issue.citizenConfirmations}
        contests={issue.citizenContests}
      />
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
