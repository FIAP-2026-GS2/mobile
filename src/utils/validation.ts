export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function hasErrors<T>(errors: FieldErrors<T>) {
  return Object.values(errors).some(Boolean);
}
