import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { spacing } from '@/theme/spacing';

type FeedbackCountersProps = {
  confirmations: number;
  contests: number;
};

function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

// Só contam os relatos que a equipe já aprovou
export function FeedbackCounters({ confirmations, contests }: FeedbackCountersProps) {
  return (
    <View style={styles.row}>
      {confirmations === 0 && contests === 0 ? (
        <Badge label="Ninguém conferiu ainda" tone="textMuted" />
      ) : null}
      {confirmations > 0 ? (
        <Badge
          label={`Validada por ${plural(confirmations, 'cidadão', 'cidadãos')}`}
          tone="success"
        />
      ) : null}
      {contests > 0 ? (
        <Badge label={plural(contests, 'contestação', 'contestações')} tone="danger" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
