import { useState } from 'react';
import { notify } from '@/utils/confirm';

import { getErrorMessage } from '@/api/errors';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChipGroup, type ChipOption } from '@/components/ui/ChipGroup';
import { TextField } from '@/components/ui/TextField';
import { useChangeIssueStatus } from '@/hooks/useIssues';
import type { IssueReport, IssueStatus } from '@/types/domain';
import { issueStatusLabels } from '@/utils/labels';

const statusOptions: ChipOption<IssueStatus>[] = (
  ['IN_PROGRESS', 'RESOLVED', 'CANCELLED'] as IssueStatus[]
).map((status) => ({ value: status, label: issueStatusLabels[status].label }));

// Ação do gestor: avançar o atendimento da ocorrência
export function StatusChangeForm({ issue }: { issue: IssueReport }) {
  const changeStatus = useChangeIssueStatus(issue.id);
  const [status, setStatus] = useState<IssueStatus | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!status) {
      setError('Escolha o novo status.');
      return;
    }
    setError(null);
    try {
      await changeStatus.mutateAsync({ status, notes: notes.trim() });
      setStatus(null);
      setNotes('');
      notify('Status atualizado', 'O cidadão verá a mudança na linha do tempo.');
    } catch (mutationError) {
      setError(getErrorMessage(mutationError));
    }
  }

  return (
    <Card>
      <AppText variant="subtitle">Atualizar atendimento</AppText>
      <ChipGroup
        label="Novo status"
        options={statusOptions.filter((option) => option.value !== issue.status)}
        value={status}
        onChange={setStatus}
      />
      <TextField
        label="Observação (opcional)"
        value={notes}
        onChangeText={setNotes}
        placeholder="Ex.: equipe da subprefeitura enviada"
        multiline
      />
      {error ? <AppText color="danger">{error}</AppText> : null}
      <Button
        title="Salvar status"
        icon="checkmark"
        onPress={handleSubmit}
        loading={changeStatus.isPending}
      />
    </Card>
  );
}
