import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { toApiError } from '@/api/errors';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { RadarLogo } from '@/components/ui/RadarLogo';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import {
  EMAIL_PATTERN,
  hasErrors,
  MIN_PASSWORD_LENGTH,
  type FieldErrors,
} from '@/utils/validation';

type SignUpForm = { name: string; email: string; password: string; confirmPassword: string };

function validate(form: SignUpForm): FieldErrors<SignUpForm> {
  return {
    name: form.name.trim().length >= 3 ? undefined : 'Informe seu nome completo.',
    email: EMAIL_PATTERN.test(form.email.trim()) ? undefined : 'Informe um e-mail válido.',
    password:
      form.password.length >= MIN_PASSWORD_LENGTH
        ? undefined
        : `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    confirmPassword: form.confirmPassword === form.password ? undefined : 'As senhas não conferem.',
  };
}

export default function SignUpScreen() {
  const { colors } = useTheme();
  const { signUp } = useAuth();
  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FieldErrors<SignUpForm>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof SignUpForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    const validation = validate(form);
    setErrors(validation);
    setSubmitError(null);
    if (hasErrors(validation)) return;

    setIsSubmitting(true);
    try {
      await signUp({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
    } catch (error) {
      const apiError = toApiError(error);
      // Erros de validação da API (ex.: e-mail já cadastrado) aparecem no próprio campo
      setErrors({ ...validation, ...apiError.fieldErrors });
      setSubmitError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScreenContainer>
        <View style={styles.hero}>
          <RadarLogo size={72} showName={false} />
          <AppText variant="title">Criar conta de cidadão</AppText>
          <AppText color="textSecondary" style={styles.center}>
            Acompanhe o que as câmeras encontram no seu bairro e confira os consertos da prefeitura.
          </AppText>
        </View>

        <TextField
          label="Nome completo"
          value={form.name}
          onChangeText={(value) => updateField('name', value)}
          error={errors.name}
          autoComplete="name"
        />
        <TextField
          label="E-mail"
          value={form.email}
          onChangeText={(value) => updateField('email', value)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextField
          label="Senha"
          value={form.password}
          onChangeText={(value) => updateField('password', value)}
          error={errors.password}
          secureTextEntry
          autoComplete="new-password"
        />
        <TextField
          label="Confirmar senha"
          value={form.confirmPassword}
          onChangeText={(value) => updateField('confirmPassword', value)}
          error={errors.confirmPassword}
          secureTextEntry
          autoComplete="new-password"
          onSubmitEditing={handleSubmit}
        />

        {submitError ? (
          <AppText color="danger" accessibilityLiveRegion="assertive">
            {submitError}
          </AppText>
        ) : null}

        <Button
          title="Criar conta"
          icon="person-add-outline"
          onPress={handleSubmit}
          loading={isSubmitting}
        />

        <View style={styles.footer}>
          <AppText color="textSecondary">Já tem conta?</AppText>
          <Link href="/sign-in" replace>
            <AppText variant="bodyStrong" color="primary">
              Entrar
            </AppText>
          </Link>
        </View>
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  center: {
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
