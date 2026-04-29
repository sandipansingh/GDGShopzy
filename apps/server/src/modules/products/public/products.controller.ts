import { Request, Response } from "express";
import * as productsService from "./products.service";
import { sendSuccess } from "../../../utils/api-response";
import { idParamSchema } from "../../../utils/query";

export async function listProducts(req: Request, res: Response): Promise<void> {
  const result = await productsService.listProducts(req.query);
  sendSuccess(res, result);
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const product = await productsService.getProduct(id);
  sendSuccess(res, product);
}
