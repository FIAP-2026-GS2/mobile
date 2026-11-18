import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { toApiError } from '@/api/errors';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ChipGroup, type ChipOption } from '@/components/ui/ChipGroup';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ErrorState, LoadingState } from '@/components/ui/StateViews';
import { TextField } from '@/components/ui/TextField';
import { useCameras, useDeleteSchedule, useSaveSchedule, useSchedule } from '@/hooks/useMonitoring';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import type {
  Camera,
  CaptureSchedule,
  CaptureScheduleInput,
  ScheduleFrequency,
} from '@/types/domain';
import { confirmAction, notify } from '@/utils/confirm';
import { goBackOr } from '@/utils/navigation';
import { formatAddress, parseBrazilianDate, toBrazilianDate, todayIsoDate } from '@/utils/format';
import { frequencyLabels, weekdayLabels } from '@/utils/labels';
import { hasErrors, TIME_PATTERN, type FieldErrors } from '@/utils/validation';

type ScheduleForm = {
  cameraId: number | null;
  frequency: ScheduleFrequency;
  weekday: number | null;
  dayOfMonth: string;
  executionTime: string;
  startDate: string; // dd/mm/aaaa
  endDate: string; // dd/mm/aaaa ou vazio
  isActive: boolean;
};

const frequencyOptions: ChipOption<ScheduleFrequency>[] = (
  Object.keys(frequencyLabels) as ScheduleFrequency[]
).map((frequency) => ({ value: frequency, label: frequencyLabels[frequency] }));

const weekdayOptions: ChipOption<number>[] = Object.entries(weekdayLabels).map(
  ([value, label]) => ({ value: Number(value), label: label.slice(0, 3) }),
);

function toForm(schedule: CaptureSchedule | undefined): ScheduleForm {
  if (!schedule) {
    return {
      cameraId: null,
      frequency: 'WEEKLY',
      weekday: 1,
      dayOfMonth: '1',
      executionTime: '10:00',
      startDate: toBrazilianDate(todayIsoDate()),
      endDate: '',
      isActive: true,
    };
  }
  return {
    cameraId: schedule.camera.id,
    frequency: schedule.frequency,
    weekday: schedule.weekday,
    dayOfMonth: String(schedule.dayOfMonth ?? 1),
    executionTime: schedule.executionTime,
    startDate: toBrazilianDate(schedule.startDate),
    endDate: schedule.endDate ? toBrazilianDate(schedule.endDate) : '',
    isActive: schedule.isActive,
  };
}

function validate(form: ScheduleForm): FieldErrors<ScheduleForm> {
  const day = Number(form.dayOfMonth);
  const start = parseBrazilianDate(form.startDate);
  const end = form.endDate ? parseBrazilianDate(form.endDate) : null;
  return {
    cameraId: form.cameraId ? undefined : 'Escolha a câmera.',
    weekday: form.frequency === 'WEEKLY' && !form.weekday ? 'Escolha o dia da semana.' : undefined,
    dayOfMonth:
      form.frequency === 'MONTHLY' && !(Number.isInteger(day) && day >= 1 && day <= 28)
        ? 'Use um dia entre 1 e 28 (existe em todos os meses).'
        : undefined,
    executionTime: TIME_PATTERN.test(form.executionTime) ? undefined : 'Use o formato HH:mm.',
    startDate: start ? undefined : 'Use o formato dd/mm/aaaa.',
    endDate:
      form.endDate && !end
        ? 'Use o formato dd/mm/aaaa.'
        : start && end && end < start
          ? 'O fim precisa ser depois do início.'
          : undefined,
  };
}

// Mesma tela para criar (sem id) e editar (com ?id=)
export default function ScheduleFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const scheduleId = id ? Number(id) : null;

  const existing = useSchedule(scheduleId);
  const cameras = useCameras();

  const queries = scheduleId ? [cameras, existing] : [cameras];
  const failed = queries.find((query) => query.isError);

  if (queries.some((query) => query.isLoading)) return <LoadingState />;
  if (failed) return <ErrorState error={failed.error} onRetry={() => failed.refetch()} />;

  return (
    <ScheduleFormContent
      scheduleId={scheduleId}
      initialForm={toForm(existing.data)}
      cameras={cameras.data ?? []}
    />
  );
}

type ScheduleFormContentProps = {
  scheduleId: number | null;
  initialForm: ScheduleForm;
  cameras: Camera[];
};

function ScheduleFormContent({ scheduleId, initialForm, cameras }: ScheduleFormContentProps) {
  const { colors } = useTheme();
  const isEditing = scheduleId !== null;
  const saveSchedule = useSaveSchedule(scheduleId);
  const deleteSchedule = useDeleteSchedule();
  const [form, setForm] = useState<ScheduleForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors<ScheduleForm>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit() {
    const validation = validate(form);
    setErrors(validation);
    setSubmitError(null);
    if (hasErrors(validation)) return;

    const isWeekly = form.frequency === 'WEEKLY';
    const input: CaptureScheduleInput = {
      cameraId: form.cameraId as number,
      frequency: form.frequency,
      weekday: isWeekly ? form.weekday : null,
      dayOfMonth: isWeekly ? null : Number(form.dayOfMonth),
      executionTime: form.executionTime,
      startDate: parseBrazilianDate(form.startDate) as string,
      endDate: form.endDate ? parseBrazilianDate(form.endDate) : null,
      isActive: form.isActive,
    };

    try {
      await saveSchedule.mutateAsync(input);
      notify(isEditing ? 'Agenda atualizada' : 'Agenda criada', 'A câmera seguirá o novo horário.');
      goBackOr('/schedules');
    } catch (error) {
      const apiError = toApiError(error);
      setErrors({ ...validation, ...apiError.fieldErrors });
      setSubmitError(apiError.message);
    }
  }

  async function handleDelete() {
    if (!scheduleId) return;
    const confirmed = await confirmAction(
      'Excluir agenda',
      'A câmera deixa de fazer essas capturas. As capturas já feitas continuam salvas.',
      'Excluir',
    );
    if (!confirmed) return;
    try {
      await deleteSchedule.mutateAsync(scheduleId);
      goBackOr('/schedules');
    } catch (error) {
      notify('Não foi possível excluir', toApiError(error).message);
    }
  }

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: isEditing ? 'Editar agenda' : 'Nova agenda' }} />

      <ChipGroup
        label="Câmera"
        options={cameras.map((camera) => ({
          value: camera.id,
          label: `${camera.cameraCode} · ${formatAddress(camera.monitoringPoint)}`,
        }))}
        value={form.cameraId}
        onChange={(cameraId) => setForm({ ...form, cameraId })}
        error={errors.cameraId}
      />
      <ChipGroup
        label="Frequência"
        options={frequencyOptions}
        value={form.frequency}
        onChange={(frequency) => setForm({ ...form, frequency })}
      />
      {form.frequency === 'WEEKLY' ? (
        <ChipGroup
          label="Dia da semana"
          options={weekdayOptions}
          value={form.weekday}
          onChange={(weekday) => setForm({ ...form, weekday })}
          error={errors.weekday}
        />
      ) : (
        <TextField
          label="Dia do mês"
          value={form.dayOfMonth}
          onChangeText={(dayOfMonth) => setForm({ ...form, dayOfMonth })}
          error={errors.dayOfMonth}
          keyboardType="number-pad"
          maxLength={2}
        />
      )}
      <TextField
        label="Horário da captura"
        value={form.executionTime}
        onChangeText={(executionTime) => setForm({ ...form, executionTime })}
        error={errors.executionTime}
        placeholder="10:00"
        keyboardType="numbers-and-punctuation"
        maxLength={5}
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <TextField
            label="Início"
            value={form.startDate}
            onChangeText={(startDate) => setForm({ ...form, startDate })}
            error={errors.startDate}
            placeholder="dd/mm/aaaa"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
        </View>
        <View style={styles.flex}>
          <TextField
            label="Fim (opcional)"
            value={form.endDate}
            onChangeText={(endDate) => setForm({ ...form, endDate })}
            error={errors.endDate}
            placeholder="dd/mm/aaaa"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
        </View>
      </View>
      <View style={[styles.switchRow, { borderColor: colors.border }]}>
        <View style={styles.flex}>
          <AppText variant="bodyStrong">Agenda ativa</AppText>
          <AppText variant="caption" color="textSecondary">
            Pausar mantém a configuração sem gerar capturas.
          </AppText>
        </View>
        <Switch
          accessibilityLabel="Agenda ativa"
          value={form.isActive}
          onValueChange={(isActive) => setForm({ ...form, isActive })}
          trackColor={{ true: colors.primary, false: colors.border }}
        />
      </View>

      {submitError ? <AppText color="danger">{submitError}</AppText> : null}

      <Button
        title={isEditing ? 'Salvar alterações' : 'Criar agenda'}
        icon="save-outline"
        onPress={handleSubmit}
        loading={saveSchedule.isPending}
      />
      {isEditing ? (
        <Button
          title="Excluir agenda"
          icon="trash-outline"
          variant="danger"
          onPress={handleDelete}
          loading={deleteSchedule.isPending}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: spacing.md,
  },
});
