import { getEmailClient } from "./email.client";
import { emailConfig } from "./email.config";
import { logger } from "../../utils/logger";
import {
  employeeInviteTemplate,
  passwordResetTemplate,
  passwordResetConfirmationTemplate,
  buyerOrderConfirmationTemplate,
  sellerNewOrderNotificationTemplate,
  buyerOrderStatusUpdateTemplate,
  sellerOrderStatusUpdateNotificationTemplate,
} from "./email-templates";
import type {
  EmailResult,
  EmployeeInviteEmailInput,
  PasswordResetEmailInput,
  PasswordResetConfirmationEmailInput,
  BuyerOrderConfirmationEmailInput,
  SellerNewOrderNotificationEmailInput,
  BuyerOrderStatusUpdateEmailInput,
  SellerOrderStatusUpdateNotificationEmailInput,
} from "./email.types";

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<EmailResult> {
  if (!emailConfig.enabled) {
    logger.info(`[Email] Disabled - would send to ${to}: ${subject}`);
    return { sent: false, reason: "Email sending is disabled" };
  }

  const client = getEmailClient();
  if (!client) {
    logger.warn(`[Email] Client not available - cannot send to ${to}`);
    return { sent: false, reason: "Email client not configured" };
  }

  try {
    const result = await client.emails.send({
      from: emailConfig.from,
      to,
      subject,
      html,
      text,
      ...(emailConfig.replyTo && { replyTo: emailConfig.replyTo }),
    });

    logger.info(`[Email] Sent to ${to}: ${subject} (ID: ${result.data?.id})`);
    return { sent: true, providerId: result.data?.id };
  } catch (error) {
    logger.error(`[Email] Failed to send to ${to}:`, error);
    return { sent: false, reason: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function sendEmployeeInviteEmail(
  input: EmployeeInviteEmailInput,
): Promise<EmailResult> {
  if (!emailConfig.employeeInvitesEnabled) {
    return { sent: false, reason: "Employee invite emails are disabled" };
  }

  const { subject, html, text } = employeeInviteTemplate(input);
  return sendEmail(input.toEmail, subject, html, text);
}

export async function sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<EmailResult> {
  if (!emailConfig.authNotificationsEnabled) {
    return { sent: false, reason: "Auth notification emails are disabled" };
  }

  const { subject, html, text } = passwordResetTemplate(input);
  return sendEmail(input.toEmail, subject, html, text);
}

export async function sendPasswordResetConfirmationEmail(
  input: PasswordResetConfirmationEmailInput,
): Promise<EmailResult> {
  if (!emailConfig.authNotificationsEnabled) {
    return { sent: false, reason: "Auth notification emails are disabled" };
  }

  const { subject, html, text } = passwordResetConfirmationTemplate(input);
  return sendEmail(input.toEmail, subject, html, text);
}

export async function sendBuyerOrderConfirmationEmail(
  input: BuyerOrderConfirmationEmailInput,
): Promise<EmailResult> {
  if (!emailConfig.orderNotificationsEnabled) {
    return { sent: false, reason: "Order notification emails are disabled" };
  }

  const { subject, html, text } = buyerOrderConfirmationTemplate(input);
  return sendEmail(input.toEmail, subject, html, text);
}

export async function sendSellerNewOrderNotificationEmail(
  input: SellerNewOrderNotificationEmailInput,
): Promise<EmailResult> {
  if (!emailConfig.orderNotificationsEnabled) {
    return { sent: false, reason: "Order notification emails are disabled" };
  }

  const { subject, html, text } = sellerNewOrderNotificationTemplate(input);
  return sendEmail(input.toEmail, subject, html, text);
}

export async function sendBuyerOrderStatusUpdateEmail(
  input: BuyerOrderStatusUpdateEmailInput,
): Promise<EmailResult> {
  if (!emailConfig.orderNotificationsEnabled) {
    return { sent: false, reason: "Order notification emails are disabled" };
  }

  const { subject, html, text } = buyerOrderStatusUpdateTemplate(input);
  return sendEmail(input.toEmail, subject, html, text);
}

export async function sendSellerOrderStatusUpdateNotificationEmail(
  input: SellerOrderStatusUpdateNotificationEmailInput,
): Promise<EmailResult> {
  if (!emailConfig.orderStatusSellerConfirmationEnabled) {
    return { sent: false, reason: "Seller order status confirmation emails are disabled" };
  }

  const { subject, html, text } = sellerOrderStatusUpdateNotificationTemplate(input);
  return sendEmail(input.toEmail, subject, html, text);
}
