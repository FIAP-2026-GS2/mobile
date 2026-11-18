const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatDateTime(iso: string) {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

// Ocorrências detectadas pela IA podem chegar sem rua e bairro preenchidos
export function formatLocation(street: string | null, neighborhood: string | null) {
  if (street && neighborhood) return `${street} – ${neighborhood}`;
  return street ?? neighborhood ?? 'Local em identificação';
}
