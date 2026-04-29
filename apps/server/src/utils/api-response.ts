import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
): Response<SuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    data,
  });
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message?: string,
): Response<SuccessResponse<T>> {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}
