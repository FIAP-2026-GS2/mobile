import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { toApiError } from '@/api/errors';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ErrorState, LoadingState } from '@/components/ui/StateViews';
import { TextField } from '@/components/ui/TextField';
import { useIssue, useIssueTypes, useMonitoringPoints, useSaveIssue } from '@/hooks/useIssues';
import type {
  IssueReport,
  IssueReportInput,
  IssueType,
  MonitoringPoint,
  Severity,
} from '@/types/domain';
import { notify } from '@/utils/confirm';
import { goBackOr } from '@/utils/navigation';
import { formatAddress } from '@/utils/format';
import { severityLabels } from '@/utils/labels';
import { hasErrors, type FieldErrors } from '@/utils/validation';

type IssueForm = {
  title: string;
  description: string;
  severity: Severity | null;
  issueTypeId: number | null;
  monitoringPointId: number | null;
};

const severityOptions = (Object.keys(severityLabels) as Severity[]).map((severity) => ({
  value: severity,
  label: severityLabels[severity].label,
}));

function toForm(issue: IssueReport | undefined): IssueForm {
  return {
    title: issue?.title ?? '',
    description: issue?.description ?? '',
    severity: issue?.severity ?? null,
    issueTypeId: issue?.issueType.id ?? null,
    monitoringPointId: issue?.monitoringPoint?.id ?? null,
  };
}

function validate(form: IssueForm): FieldErrors<IssueForm> {
  return {
    title:
      form.title.trim().length >= 5 ? undefined : 'Descreva o problema em pelo menos 5 letras.',
    description:
      form.description.trim().length >= 10 ? undefined : 'Conte um pouco mais (mínimo 10 letras).',
    severity: form.severity ? undefined : 'Escolha a gravidade.',
    issueTypeId: form.issueTypeId ? undefined : 'Escolha o tipo de problema.',
    monitoringPointId: form.monitoringPointId ? undefined : 'Escolha o local.',
  };
}

// Mesma tela para criar (sem id) e editar (com ?id=).
// Esta parte só carrega os dados; o formulário começa já preenchido quando tudo chega.
export default function IssueFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const issueId = id ? Number(id) : null;

  const existing = useIssue(issueId);
  const issueTypes = useIssueTypes();
  const points = useMonitoringPoints();

  const queries = issueId ? [issueTypes, points, existing] : [issueTypes, points];
  const failed = queries.find((query) => query.isError);

  if (queries.some((query) => query.isLoading)) return <LoadingState />;
  if (failed) return <ErrorState error={failed.error} onRetry={() => failed.refetch()} />;

  return (
    <IssueFormContent
      issueId={issueId}
      initialForm={toForm(existing.data)}
      issueTypes={issueTypes.data ?? []}
      points={points.data ?? []}
    />
  );
}

type IssueFormContentProps = {
  issueId: number | null;
  initialForm: IssueForm;
  issueTypes: IssueType[];
  points: MonitoringPoint[];
};

function IssueFormContent({ issueId, initialForm, issueTypes, points }: IssueFormContentProps) {
  const isEditing = issueId !== null;
  const saveIssue = useSaveIssue(issueId ?? undefined);
  const [form, setForm] = useState<IssueForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors<IssueForm>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit() {
    const validation = validate(form);
    setErrors(validation);
    setSubmitError(null);
    if (hasErrors(validation)) return;

    const input: IssueReportInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      severity: form.severity as Severity,
      issueTypeId: form.issueTypeId as number,
      monitoringPointId: form.monitoringPointId as number,
    };

    try {
      const saved = await saveIssue.mutateAsync(input);
      if (isEditing) {
        notify('Relato atualizado', 'As alterações foram salvas.');
        goBackOr('/issues');
      } else {
        notify('Relato enviado', 'A zeladoria vai analisar seu relato.');
        router.replace({ pathname: '/issue/[id]', params: { id: saved.id } });
      }
    } catch (error) {
      const apiError = toApiError(error);
      setErrors({ ...validation, ...apiError.fieldErrors });
      setSubmitError(apiError.message);
    }
  }

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: isEditing ? 'Editar relato' : 'Relatar problema' }} />

      <AppText color="textSecondary">
        Viu um poste apagado, um buraco ou um semáforo com defeito? Conte para a zeladoria.
      </AppText>

      <ChipGroup
        label="Tipo de problema"
        options={issueTypes.map((type) => ({ value: type.id, label: type.name }))}
        value={form.issueTypeId}
        onChange={(issueTypeId) => setForm({ ...form, issueTypeId })}
        error={errors.issueTypeId}
      />
      <TextField
        label="Título"
        value={form.title}
        onChangeText={(title) => setForm({ ...form, title })}
        error={errors.title}
        placeholder="Ex.: Poste apagado em frente ao nº 1200"
        maxLength={120}
      />
      <TextField
        label="Descrição"
        value={form.description}
        onChangeText={(description) => setForm({ ...form, description })}
        error={errors.description}
        placeholder="Desde quando está assim? Há risco para quem passa?"
        multiline
        maxLength={1000}
      />
      <ChipGroup
        label="Gravidade"
        options={severityOptions}
        value={form.severity}
        onChange={(severity) => setForm({ ...form, severity })}
        error={errors.severity}
      />
      <ChipGroup
        label="Local (pontos monitorados)"
        options={points.map((point) => ({ value: point.id, label: formatAddress(point) }))}
        value={form.monitoringPointId}
        onChange={(monitoringPointId) => setForm({ ...form, monitoringPointId })}
        error={errors.monitoringPointId}
      />

      {submitError ? <AppText color="danger">{submitError}</AppText> : null}

      <Button
        title={isEditing ? 'Salvar alterações' : 'Enviar relato'}
        icon="send-outline"
        onPress={handleSubmit}
        loading={saveIssue.isPending}
      />
    </ScreenContainer>
  );
}
