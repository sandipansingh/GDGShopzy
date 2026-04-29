import { Request, Response } from "express";
import * as ordersService from "./orders.service";
import { sendSuccess } from "../../../utils/api-response";
import { paginationSchema, idParamSchema } from "../../../utils/query";

export async function listOrders(req: Request, res: Response): Promise<void> {
  const { page, limit } = paginationSchema.parse(req.query);
  const result = await ordersService.listSellerOrders(req.sellerId!, page, limit);
  sendSuccess(res, result);
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const order = await ordersService.getSellerOrder(req.sellerId!, id);
  sendSuccess(res, order);
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const order = await ordersService.updateOrderStatus(req.sellerId!, id, req.body);
  sendSuccess(res, order, "Order status updated");
}
