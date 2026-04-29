import { Request, Response } from "express";
import * as productsService from "./products.service";
import { sendSuccess, sendCreated, sendNoContent } from "../../../utils/api-response";
import { paginationSchema, idParamSchema } from "../../../utils/query";

export async function listProducts(req: Request, res: Response): Promise<void> {
  const { page, limit } = paginationSchema.parse(req.query);
  const result = await productsService.listSellerProducts(req.sellerId!, page, limit);
  sendSuccess(res, result);
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const product = await productsService.getSellerProduct(req.sellerId!, id);
  sendSuccess(res, product);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const product = await productsService.createProduct(req.sellerId!, req.body);
  sendCreated(res, product, "Product created successfully");
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const product = await productsService.updateProduct(req.sellerId!, id, req.body);
  sendSuccess(res, product, "Product updated successfully");
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  await productsService.deleteProduct(req.sellerId!, id);
  sendNoContent(res);
}
