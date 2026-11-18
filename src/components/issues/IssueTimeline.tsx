import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import type { IssueHistoryEntry } from '@/types/domain';
import { formatDateTime } from '@/utils/format';
import { getStatusLabel } from '@/utils/labels';

// Linha do tempo montada a partir de ISSUE_HISTORY
export function IssueTimeline({ entries }: { entries: IssueHistoryEntry[] }) {
  const { colors } = useTheme();

  return (
    <View>
      {entries.map((entry, index) => {
        const status = getStatusLabel(entry.newStatus);
        const isLast = index === entries.length - 1;
        return (
          <View key={`${entry.changeDate}-${entry.newStatus}`} style={styles.item}>
            <View style={styles.rail}>
              <View style={[styles.dot, { backgroundColor: colors[status.tone] }]} />
              {!isLast ? <View style={[styles.line, { backgroundColor: colors.border }]} /> : null}
            </View>
            <View style={styles.body}>
              <AppText variant="bodyStrong">{status.label}</AppText>
              <AppText variant="caption" color="textMuted">
                {formatDateTime(entry.changeDate)}
              </AppText>
              {entry.notes ? <AppText color="textSecondary">{entry.notes}</AppText> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rail: {
    alignItems: 'center',
    width: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 5,
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 2,
  },
  body: {
    flex: 1,
    paddingBottom: spacing.lg,
    gap: 2,
  },
});
