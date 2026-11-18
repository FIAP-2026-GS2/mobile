import { isAxiosError } from 'axios';

type FieldErrorItem = { field?: string; message?: string; defaultMessage?: string };

// Aceita o formato de erro da API Java ({ message, fields: [...] })
// e o ProblemDetails da API .NET ({ title, detail, errors: { campo: [mensagens] } })
type ApiErrorBody = {
  message?: string;
  detail?: string;
  title?: string;
  fields?: FieldErrorItem[] | Record<string, string>;
  errors?: FieldErrorItem[] | Record<string, string | string[]>;
};

export class ApiError extends Error {
  status: number | null;
  fieldErrors: Record<string, string>;

  constructor(message: string, status: number | null, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function extractFieldErrors(body: ApiErrorBody | undefined): Record<string, string> {
  const source = body?.fields ?? body?.errors;
  if (!source) return {};

  if (Array.isArray(source)) {
    return Object.fromEntries(
      source
        .filter((item) => item.field)
        .map((item) => [item.field as string, item.message ?? item.defaultMessage ?? '']),
    );
  }

  return Object.fromEntries(
    Object.entries(source).map(([field, messages]) => [
      // ProblemDetails costuma mandar o nome do campo com inicial maiúscula
      field.charAt(0).toLowerCase() + field.slice(1),
      Array.isArray(messages) ? messages[0] : messages,
    ]),
  );
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Confira os dados informados.',
  401: 'E-mail ou senha incorretos.',
  403: 'Você não tem permissão para esta ação.',
  404: 'Registro não encontrado.',
  409: 'Este registro já existe.',
  429: 'Muitas tentativas em pouco tempo. Aguarde alguns segundos e tente de novo.',
};

// Converte qualquer erro do Axios numa mensagem em português para mostrar na tela
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return new ApiError(
        'Não foi possível conectar. Verifique sua internet e tente de novo.',
        null,
      );
    }

    const { status, data } = error.response;
    const message =
      data?.message ??
      data?.detail ??
      STATUS_MESSAGES[status] ??
      (status >= 500
        ? 'O serviço está indisponível no momento. Tente mais tarde.'
        : 'Algo deu errado.');
    return new ApiError(message, status, extractFieldErrors(data));
  }

  return new ApiError('Algo deu errado. Tente novamente.', null);
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
