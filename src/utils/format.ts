import type { CaptureSchedule, MonitoringPoint } from '@/types/domain';

import { frequencyLabels, weekdayLabels } from './labels';

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

// Datas sem horário (yyyy-MM-dd) são lidas como meia-noite local para não "voltar um dia"
export function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate.slice(0, 10)}T00:00:00`));
}

export function formatAddress(point: MonitoringPoint) {
  const street = point.streetNumber ? `${point.street}, ${point.streetNumber}` : point.street;
  return point.neighborhood ? `${street} – ${point.neighborhood}` : street;
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function describeSchedule(schedule: CaptureSchedule) {
  const when =
    schedule.frequency === 'WEEKLY'
      ? `toda ${weekdayLabels[schedule.weekday ?? 1].toLowerCase()}`
      : `todo dia ${schedule.dayOfMonth}`;
  return `${frequencyLabels[schedule.frequency]} · ${when} às ${schedule.executionTime}`;
}

// Converte o texto digitado (dd/mm/aaaa) para o formato da API (aaaa-mm-dd)
export function parseBrazilianDate(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  if (Number.isNaN(date.getTime()) || date.getDate() !== Number(day)) return null;
  return `${year}-${month}-${day}`;
}

export function toBrazilianDate(isoDate: string) {
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function todayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
