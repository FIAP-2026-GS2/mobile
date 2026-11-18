export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mesmos limites da API Java (RegisterRequest e UpdateProfileRequest)
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72;
export const MAX_NAME_LENGTH = 120;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function hasErrors<T>(errors: FieldErrors<T>) {
  return Object.values(errors).some(Boolean);
}
