import { Request, Response } from "express";
import * as ordersService from "./orders.service";
import { sendSuccess } from "../../../utils/api-response";
import { paginationSchema, idParamSchema } from "../../../utils/query";

export async function listOrders(req: Request, res: Response): Promise<void> {
  const { page, limit } = paginationSchema.parse(req.query);
  const result = await ordersService.listBuyerOrders(req.user!.id, page, limit);
  sendSuccess(res, result);
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const order = await ordersService.getBuyerOrder(req.user!.id, id);
  sendSuccess(res, order);
}
