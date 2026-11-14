import { isAxiosError } from 'axios';

// Corpo de erro padronizado pelo @RestControllerAdvice da API Java
type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string> | { field: string; message: string }[];
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
  if (!body?.errors) return {};
  if (Array.isArray(body.errors)) {
    return Object.fromEntries(body.errors.map((item) => [item.field, item.message]));
  }
  return body.errors;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Confira os dados informados.',
  401: 'Sua sessão expirou. Entre novamente.',
  403: 'Você não tem permissão para esta ação.',
  404: 'Registro não encontrado.',
  409: 'Este registro já existe ou foi alterado por outra pessoa.',
  429: 'Muitas tentativas em pouco tempo. Aguarde alguns segundos e tente de novo.',
};

// Converte qualquer erro do Axios numa mensagem em português para mostrar na tela
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      const message =
        error.code === 'ECONNABORTED'
          ? 'O servidor demorou para responder. Tente novamente.'
          : 'Sem conexão com o servidor. Verifique sua internet.';
      return new ApiError(message, null);
    }

    const { status, data } = error.response;
    const message =
      data?.message ??
      STATUS_MESSAGES[status] ??
      (status >= 500 ? 'O servidor está com problemas. Tente mais tarde.' : 'Algo deu errado.');
    return new ApiError(message, status, extractFieldErrors(data));
  }

  return new ApiError('Algo deu errado. Tente novamente.', null);
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
