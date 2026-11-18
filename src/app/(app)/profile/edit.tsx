import { useState } from 'react';

import { toApiError } from '@/api/errors';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/context/AuthProvider';
import { useUpdateProfile } from '@/hooks/useProfile';
import type { UpdateProfileInput } from '@/types/domain';
import { notify } from '@/utils/confirm';
import { goBackOr } from '@/utils/navigation';
import {
  hasErrors,
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  type FieldErrors,
} from '@/utils/validation';

type ProfileForm = { name: string; password: string; confirmPassword: string };

function validate(form: ProfileForm): FieldErrors<ProfileForm> {
  const changesPassword = form.password.length > 0;
  return {
    name: form.name.trim().length >= 3 ? undefined : 'Informe seu nome completo.',
    password:
      changesPassword && form.password.length < MIN_PASSWORD_LENGTH
        ? `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`
        : undefined,
    confirmPassword:
      changesPassword && form.confirmPassword !== form.password
        ? 'As senhas não conferem.'
        : undefined,
  };
}

export default function EditProfileScreen() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name ?? '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FieldErrors<ProfileForm>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    const validation = validate(form);
    setErrors(validation);
    setSubmitError(null);
    if (hasErrors(validation)) return;

    // A senha só vai para a API quando a pessoa quer trocá-la
    const input: UpdateProfileInput = { name: form.name.trim() };
    if (form.password) input.password = form.password;

    try {
      await updateProfile.mutateAsync(input);
      notify('Perfil atualizado', 'Suas alterações foram salvas.');
      goBackOr('/account');
    } catch (error) {
      const apiError = toApiError(error);
      setErrors({ ...validation, ...apiError.fieldErrors });
      setSubmitError(apiError.message);
    }
  }

  return (
    <ScreenContainer>
      <TextField
        label="Nome completo"
        value={form.name}
        onChangeText={(value) => updateField('name', value)}
        error={errors.name}
        autoComplete="name"
        maxLength={MAX_NAME_LENGTH}
      />
      <TextField label="E-mail" value={user?.email ?? ''} editable={false} />

      <AppText variant="subtitle">Trocar senha</AppText>
      <AppText color="textSecondary">Deixe em branco para manter a senha atual.</AppText>
      <TextField
        label="Nova senha"
        value={form.password}
        onChangeText={(value) => updateField('password', value)}
        error={errors.password}
        secureTextEntry
        autoComplete="new-password"
        maxLength={MAX_PASSWORD_LENGTH}
      />
      <TextField
        label="Confirmar nova senha"
        value={form.confirmPassword}
        onChangeText={(value) => updateField('confirmPassword', value)}
        error={errors.confirmPassword}
        secureTextEntry
        autoComplete="new-password"
        maxLength={MAX_PASSWORD_LENGTH}
        onSubmitEditing={handleSubmit}
      />

      {submitError ? <AppText color="danger">{submitError}</AppText> : null}

      <Button
        title="Salvar alterações"
        icon="save-outline"
        onPress={handleSubmit}
        loading={updateProfile.isPending}
      />
    </ScreenContainer>
  );
}
