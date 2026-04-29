import { Request, Response } from "express";
import { placeOrder } from "./checkout.service";
import { sendCreated } from "../../utils/api-response";

export async function checkout(req: Request, res: Response): Promise<void> {
  const orders = await placeOrder(req.user!.id, req.body);
  sendCreated(res, { orders }, "Order placed successfully");
}
