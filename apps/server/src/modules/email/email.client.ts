import { Resend } from "resend";
import { emailConfig } from "./email.config";
import { logger } from "../../utils/logger";

let resendClient: Resend | null = null;

export function getEmailClient(): Resend | null {
  if (!emailConfig.enabled) {
    return null;
  }

  if (!emailConfig.apiKey) {
    logger.warn("Email is enabled but RESEND_API_KEY is not configured");
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(emailConfig.apiKey);
  }

  return resendClient;
}
