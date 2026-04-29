import { Request, Response } from "express";
import * as cartService from "./cart.service";
import { sendSuccess, sendNoContent } from "../../utils/api-response";
import { idParamSchema } from "../../utils/query";

export async function getCart(req: Request, res: Response): Promise<void> {
  const cart = await cartService.getCart(req.user!.id);
  sendSuccess(res, cart);
}

export async function addItem(req: Request, res: Response): Promise<void> {
  const item = await cartService.addItem(req.user!.id, req.body);
  sendSuccess(res, item, "Item added to cart");
}

export async function updateItem(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const item = await cartService.updateItem(req.user!.id, id, req.body);
  sendSuccess(res, item, "Cart item updated");
}

export async function removeItem(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  await cartService.removeItem(req.user!.id, id);
  sendNoContent(res);
}

export async function clearCart(req: Request, res: Response): Promise<void> {
  await cartService.clearCart(req.user!.id);
  sendNoContent(res);
}
