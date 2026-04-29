import { z } from "zod";
import { normalizeEmail } from "../../utils/sanitize";

export const inviteEmployeeSchema = z.object({
  email: z.string().email("Must be a valid email address").transform(normalizeEmail),
});

export const employeeParamsSchema = z.object({
  id: z.string().cuid("Invalid employee ID format"),
});

export type InviteEmployeeInput = z.infer<typeof inviteEmployeeSchema>;
