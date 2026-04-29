import { isAxiosError } from "axios";

export type AppApiError = {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
};

type ErrorPayload = {
  success?: boolean;
  message?: string;
  code?: string;
  details?: unknown;
};

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isAppApiError = (value: unknown): value is AppApiError =>
  isObject(value) && typeof value.message === "string";

const parseErrorPayload = (value: unknown): ErrorPayload | null => {
  if (!isObject(value)) {
    return null;
  }

  return {
    success: typeof value.success === "boolean" ? value.success : undefined,
    message: typeof value.message === "string" ? value.message : undefined,
    code: typeof value.code === "string" ? value.code : undefined,
    details: value.details,
  };
};

const getFallbackMessage = (status?: number, isNetworkError = false) => {
  if (isNetworkError) {
    return "The server is unavailable right now. Please try again.";
  }

  switch (status) {
    case 401:
      return "You need to sign in to continue.";
    case 403:
      return "You do not have access to do that.";
    case 404:
      return "The requested resource could not be found.";
    case 409:
      return "That request could not be completed because the record already exists.";
    case 413:
      return "That upload is too large. Please choose a smaller file.";
    case 415:
      return "That file type is not supported.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    default:
      if (status && status >= 500) {
        return "The server is unavailable right now. Please try again.";
      }

      return FALLBACK_MESSAGE;
  }
};

export const parseApiError = (error: unknown): AppApiError => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const payload = parseErrorPayload(responseData);
    const isNetworkError = error.code === "ERR_NETWORK" || !error.response;

    const message = payload?.message ?? getFallbackMessage(status, isNetworkError);

    return {
      message,
      code: payload?.code,
      status,
      details: payload?.details,
    };
  }

  if (error instanceof Error) {
    const message = error.message || FALLBACK_MESSAGE;
    if (message.startsWith("Request failed with status code")) {
      const statusMatch = message.match(/status code (\d+)/);
      const status = statusMatch ? parseInt(statusMatch[1], 10) : undefined;
      return { message: getFallbackMessage(status), status };
    }
    return { message };
  }

  if (isAppApiError(error)) {
    return error;
  }

  return { message: FALLBACK_MESSAGE };
};

export const getErrorMessage = (error: unknown) => parseApiError(error).message;

export const isApiError = isAppApiError;

export const setFormErrorsFromApi = (error: unknown, setError: any): boolean => {
  const apiError = parseApiError(error);
  if (apiError.code === "VALIDATION_ERROR" && apiError.details) {
    const fieldErrors = apiError.details as Record<string, string[]>;
    let hasFieldErrors = false;
    Object.entries(fieldErrors).forEach(([field, messages]) => {
      if (messages && messages.length > 0) {
        setError(field, { type: "server", message: messages[0] });
        hasFieldErrors = true;
      }
    });
    return hasFieldErrors;
  }
  return false;
};
