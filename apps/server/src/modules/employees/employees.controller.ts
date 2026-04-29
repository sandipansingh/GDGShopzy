import { Request, Response } from "express";
import * as employeesService from "./employees.service";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/api-response";
import { idParamSchema } from "../../utils/query";

export async function inviteEmployee(req: Request, res: Response): Promise<void> {
  const result = await employeesService.inviteEmployee(req.sellerId!, req.body);
  sendCreated(res, result, "Invite sent successfully");
}

export async function listEmployees(req: Request, res: Response): Promise<void> {
  const employees = await employeesService.listEmployees(req.sellerId!);
  sendSuccess(res, employees);
}

export async function removeEmployee(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  await employeesService.removeEmployee(req.sellerId!, id);
  sendNoContent(res);
}
