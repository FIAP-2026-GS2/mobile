import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getErrorMessage } from '@/api/errors';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { RadarLogo } from '@/components/ui/RadarLogo';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { EMAIL_PATTERN, hasErrors, type FieldErrors } from '@/utils/validation';

type LoginForm = { email: string; password: string };

function validate(form: LoginForm): FieldErrors<LoginForm> {
  return {
    email: EMAIL_PATTERN.test(form.email.trim()) ? undefined : 'Informe um e-mail válido.',
    password: form.password ? undefined : 'Informe sua senha.',
  };
}

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors<LoginForm>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const validation = validate(form);
    setErrors(validation);
    setSubmitError(null);
    if (hasErrors(validation)) return;

    setIsSubmitting(true);
    try {
      await signIn({ email: form.email.trim().toLowerCase(), password: form.password });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScreenContainer>
        <View style={styles.hero}>
          <RadarLogo />
          <AppText color="textSecondary" style={styles.tagline}>
            Câmeras da cidade cuidando de postes, ruas e semáforos. Você acompanha tudo daqui.
          </AppText>
        </View>

        <TextField
          label="E-mail"
          value={form.email}
          onChangeText={(email) => setForm({ ...form, email })}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="Digite seu e-mail aqui"
        />
        <TextField
          label="Senha"
          value={form.password}
          onChangeText={(password) => setForm({ ...form, password })}
          error={errors.password}
          secureTextEntry
          autoComplete="current-password"
          placeholder="Digite sua senha aqui"
          onSubmitEditing={handleSubmit}
        />

        {submitError ? (
          <AppText color="danger" accessibilityLiveRegion="assertive">
            {submitError}
          </AppText>
        ) : null}

        <Button
          title="Entrar"
          icon="log-in-outline"
          onPress={handleSubmit}
          loading={isSubmitting}
        />

        <View style={styles.footer}>
          <AppText color="textSecondary">Ainda não tem conta?</AppText>
          <Link href="/cadastro" replace>
            <AppText variant="bodyStrong" color="primary">
              Criar conta
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
    gap: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  tagline: {
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
