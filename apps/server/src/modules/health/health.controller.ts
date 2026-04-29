import { Request, Response } from "express";
import { sendSuccess } from "../../utils/api-response";

export function healthCheck(_req: Request, res: Response): void {
  sendSuccess(res, { status: "ok", timestamp: new Date().toISOString() });
}
