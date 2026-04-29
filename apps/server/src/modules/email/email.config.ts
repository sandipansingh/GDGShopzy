import { env } from "../../config/env";

export const emailConfig = {
  enabled: env.EMAIL_ENABLED,
  apiKey: env.RESEND_API_KEY,
  from: env.EMAIL_FROM,
  replyTo: env.EMAIL_REPLY_TO,
  orderNotificationsEnabled: env.EMAIL_ORDER_NOTIFICATIONS_ENABLED,
  authNotificationsEnabled: env.EMAIL_AUTH_NOTIFICATIONS_ENABLED,
  employeeInvitesEnabled: env.EMAIL_EMPLOYEE_INVITES_ENABLED,
  notifyEmployeesOnNewOrder: env.EMAIL_NOTIFY_EMPLOYEES_ON_NEW_ORDER,
  orderStatusSellerConfirmationEnabled: env.EMAIL_ORDER_STATUS_SELLER_CONFIRMATION_ENABLED,
  passwordResetTokenExpiresMinutes: env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES,
  employeeInviteExpiresHours: env.EMPLOYEE_INVITE_EXPIRES_HOURS,
};
