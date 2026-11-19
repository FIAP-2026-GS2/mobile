import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { getErrorMessage, toApiError } from '@/api/errors';
import { DecisionOption } from '@/components/citizenFeedback/DecisionOption';
import { FeedbackCounters } from '@/components/citizenFeedback/FeedbackCounters';
import { PhotoField } from '@/components/citizenFeedback/PhotoField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoRow } from '@/components/ui/InfoRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ErrorState, LoadingState } from '@/components/ui/StateViews';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/context/AuthProvider';
import { useResolvedIssue, useSubmitCitizenFeedback } from '@/hooks/useCitizenFeedback';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import type { CitizenFeedback, CitizenFeedbackDecision } from '@/types/domain';
import { DevicePermissionError, getCurrentCoordinates, takePhoto } from '@/utils/device';
import { formatDateTime, formatLocation } from '@/utils/format';
import { goBackOr } from '@/utils/navigation';
import { hasErrors, type FieldErrors } from '@/utils/validation';

const MAX_NOTES_LENGTH = 500;

type VerificationForm = {
  decision: CitizenFeedbackDecision | null;
  photoUri: string | null;
  notes: string;
};

function validate(form: VerificationForm): FieldErrors<VerificationForm> {
  return {
    decision: form.decision ? undefined : 'Escolha se o problema foi resolvido ou não.',
    photoUri: form.photoUri ? undefined : 'Tire uma foto do local.',
    notes:
      form.decision === 'CONTEST' && !form.notes.trim()
        ? 'Conte o que continua errado no local.'
        : undefined,
  };
}

export default function VerificationScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const issueId = Number(id);
  const resolvedIssue = useResolvedIssue(issueId);
  const submitFeedback = useSubmitCitizenFeedback(issueId);

  const [form, setForm] = useState<VerificationForm>({ decision: null, photoUri: null, notes: '' });
  const [errors, setErrors] = useState<FieldErrors<VerificationForm>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [sentFeedback, setSentFeedback] = useState<CitizenFeedback | null>(null);

  // A API .NET aceita fotos só de contas de cidadão (agentes e administradores revisam pela prefeitura)
  const isCitizen = user?.userType === 'CITIZEN';

  if (resolvedIssue.isLoading) return <LoadingState />;
  if (resolvedIssue.isError) {
    return <ErrorState error={resolvedIssue.error} onRetry={() => resolvedIssue.refetch()} />;
  }
  const issue = resolvedIssue.issue;
  if (!issue) {
    return (
      <ErrorState
        error={new Error('Esta ocorrência não está mais disponível para conferência.')}
        onRetry={() => resolvedIssue.refetch()}
      />
    );
  }

  async function handleTakePhoto() {
    try {
      const photoUri = await takePhoto();
      if (photoUri) {
        setForm((current) => ({ ...current, photoUri }));
        setErrors((current) => ({ ...current, photoUri: undefined }));
      }
    } catch (error) {
      setErrors((current) => ({
        ...current,
        photoUri:
          error instanceof DevicePermissionError
            ? error.message
            : 'Não foi possível abrir a câmera.',
      }));
    }
  }

  async function handleSubmit() {
    const validation = validate(form);
    setErrors(validation);
    setSubmitError(null);
    if (hasErrors(validation)) return;

    try {
      setIsLocating(true);
      const coordinates = await getCurrentCoordinates();
      setIsLocating(false);

      const feedback = await submitFeedback.mutateAsync({
        decision: form.decision as CitizenFeedbackDecision,
        notes: form.notes.trim(),
        photoUri: form.photoUri as string,
        ...coordinates,
      });
      setSentFeedback(feedback);
    } catch (error) {
      setIsLocating(false);
      if (error instanceof DevicePermissionError) {
        setSubmitError(error.message);
        return;
      }
      const apiError = toApiError(error);
      setErrors({ ...validation, ...apiError.fieldErrors });
      setSubmitError(
        apiError.status === 401
          ? 'Sua conta não pode enviar fotos. Entre com uma conta de cidadão.'
          : getErrorMessage(error),
      );
    }
  }

  if (sentFeedback) {
    return (
      <ScreenContainer>
        <View style={styles.success}>
          <Ionicons name="time-outline" size={56} color={colors.primary} />
          <AppText variant="title" style={styles.center}>
            {sentFeedback.decision === 'CONFIRM' ? 'Confirmação enviada' : 'Contestação enviada'}
          </AppText>
          <AppText color="textSecondary" style={styles.center}>
            {sentFeedback.message}
          </AppText>
        </View>
        <Button title="Conferir outros consertos" onPress={() => goBackOr('/verify')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.titleBlock}>
        <AppText variant="overline" color="success">
          {issue.issueTypeName.toUpperCase()}
        </AppText>
        <AppText variant="title">{issue.title}</AppText>
      </View>

      <Card>
        <InfoRow
          icon="location-outline"
          label="Local"
          value={formatLocation(issue.street, issue.neighborhood)}
        />
        {issue.resolutionDate ? (
          <InfoRow
            icon="checkmark-done-outline"
            label="Marcada como resolvida em"
            value={formatDateTime(issue.resolutionDate)}
          />
        ) : null}
        <FeedbackCounters
          confirmations={issue.citizenConfirmations}
          contests={issue.citizenContests}
        />
      </Card>

      {!isCitizen ? (
        <AppText color="warning">
          Somente contas de cidadão podem enviar fotos de conferência.
        </AppText>
      ) : null}

      <View style={styles.options} accessibilityRole="radiogroup">
        <AppText variant="subtitle">O problema foi resolvido?</AppText>
        <DecisionOption
          icon="checkmark-circle-outline"
          title="Sim, foi consertado"
          description="Confirme que o local está em ordem."
          tone="success"
          selected={form.decision === 'CONFIRM'}
          onPress={() => setForm({ ...form, decision: 'CONFIRM' })}
        />
        <DecisionOption
          icon="alert-circle-outline"
          title="Não, continua com problema"
          description="Conteste e conte o que você viu."
          tone="danger"
          selected={form.decision === 'CONTEST'}
          onPress={() => setForm({ ...form, decision: 'CONTEST' })}
        />
        {errors.decision ? (
          <AppText variant="caption" color="danger">
            {errors.decision}
          </AppText>
        ) : null}
      </View>

      <PhotoField photoUri={form.photoUri} error={errors.photoUri} onTakePhoto={handleTakePhoto} />

      <TextField
        label={form.decision === 'CONTEST' ? 'O que continua errado?' : 'Observação (opcional)'}
        value={form.notes}
        onChangeText={(notes) => setForm({ ...form, notes })}
        error={errors.notes}
        placeholder={
          form.decision === 'CONTEST'
            ? 'Ex.: o buraco continua aberto perto da faixa'
            : 'Ex.: asfalto novo e sinalizado'
        }
        multiline
        maxLength={MAX_NOTES_LENGTH}
      />

      {submitError ? (
        <AppText color="danger" accessibilityLiveRegion="assertive">
          {submitError}
        </AppText>
      ) : null}

      <Button
        title={isLocating ? 'Obtendo localização...' : 'Enviar foto'}
        icon="send-outline"
        onPress={handleSubmit}
        loading={isLocating || submitFeedback.isPending}
        disabled={!isCitizen}
      />
      <AppText variant="caption" color="textMuted" style={styles.center}>
        A IA confere se a foto mostra o local e uma pessoa da equipe aprova o relato.
      </AppText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: spacing.xs,
  },
  options: {
    gap: spacing.md,
  },
  success: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  center: {
    textAlign: 'center',
  },
});
