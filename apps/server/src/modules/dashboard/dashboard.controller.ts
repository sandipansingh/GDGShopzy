import { Request, Response } from "express";
import { getDashboardStats } from "./dashboard.service";
import { sendSuccess } from "../../utils/api-response";

export async function getStats(req: Request, res: Response): Promise<void> {
  const stats = await getDashboardStats(req.sellerId!);
  sendSuccess(res, stats);
}
