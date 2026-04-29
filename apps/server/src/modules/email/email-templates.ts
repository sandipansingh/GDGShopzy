import { escapeHtml, formatMoney, formatDate, buildClientUrl } from "./email.utils";
import type {
  EmployeeInviteEmailInput,
  PasswordResetEmailInput,
  PasswordResetConfirmationEmailInput,
  BuyerOrderConfirmationEmailInput,
  SellerNewOrderNotificationEmailInput,
  BuyerOrderStatusUpdateEmailInput,
  SellerOrderStatusUpdateNotificationEmailInput,
} from "./email.types";
import { env } from "../../config/env";

const baseStyles = `
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
    line-height: 1.6; 
    color: #1a1a1a; 
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
  }
  .email-wrapper { 
    max-width: 600px; 
    margin: 40px auto; 
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .email-header {
    background: #1a1a1a;
    color: #ffffff;
    padding: 32px 40px;
    text-align: center;
  }
  .email-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .email-content { 
    padding: 40px; 
  }
  .email-content h2 {
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
  }
  .email-content p {
    margin: 0 0 16px 0;
    color: #4a4a4a;
  }
  .button { 
    display: inline-block; 
    padding: 14px 32px; 
    background: #1a1a1a; 
    color: #ffffff !important; 
    text-decoration: none; 
    border-radius: 8px; 
    margin: 24px 0;
    font-weight: 500;
  }
  .button:hover {
    background: #2a2a2a;
  }
  .order-card {
    margin: 24px 0;
    padding: 24px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    background: #fafafa;
  }
  .order-card h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }
  .order-items {
    list-style: none;
    padding: 0;
    margin: 16px 0;
  }
  .order-items li {
    padding: 8px 0;
    border-bottom: 1px solid #e5e5e5;
    color: #4a4a4a;
  }
  .order-items li:last-child {
    border-bottom: none;
  }
  .order-total {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #1a1a1a;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
  }
  .address-block {
    margin: 24px 0;
    padding: 20px;
    background: #fafafa;
    border-radius: 8px;
  }
  .address-block p {
    margin: 4px 0;
  }
  .email-footer { 
    padding: 32px 40px; 
    background: #fafafa;
    border-top: 1px solid #e5e5e5;
    text-align: center;
  }
  .email-footer p {
    margin: 8px 0;
    font-size: 13px; 
    color: #6a6a6a; 
  }
  .fallback-link {
    margin-top: 16px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 6px;
    font-size: 13px;
    color: #6a6a6a;
    word-break: break-all;
  }
`;

export function employeeInviteTemplate(input: EmployeeInviteEmailInput) {
  const subject = `You're invited to GDGShopzy`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-header">
          <h1>GDGShopzy</h1>
        </div>
        <div class="email-content">
          <h2>You're invited to join ${escapeHtml(input.storeName)}</h2>
          <p>You've been invited to join <strong>${escapeHtml(input.storeName)}</strong> as an employee on GDGShopzy.</p>
          <p>Click the button below to accept the invitation and create your account:</p>
          <a href="${escapeHtml(input.inviteLink)}" class="button">Accept Invitation</a>
          <div class="fallback-link">
            Or copy this link: ${escapeHtml(input.inviteLink)}
          </div>
          <p><strong>This invitation expires on ${formatDate(input.expiresAt)}.</strong></p>
        </div>
        <div class="email-footer">
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} GDGShopzy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
You're invited to GDGShopzy

You've been invited to join ${input.storeName} as an employee on GDGShopzy.

Accept invitation: ${input.inviteLink}

This invitation expires on ${formatDate(input.expiresAt)}.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} GDGShopzy. All rights reserved.
  `.trim();

  return { subject, html, text };
}

export function passwordResetTemplate(input: PasswordResetEmailInput) {
  const subject = "Reset your GDGShopzy password";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-header">
          <h1>GDGShopzy</h1>
        </div>
        <div class="email-content">
          <h2>Password Reset Request</h2>
          <p>Hi ${escapeHtml(input.userName)},</p>
          <p>We received a request to reset your GDGShopzy password. Click the button below to create a new password:</p>
          <a href="${escapeHtml(input.resetLink)}" class="button">Reset Password</a>
          <div class="fallback-link">
            Or copy this link: ${escapeHtml(input.resetLink)}
          </div>
          <p><strong>This link expires in ${input.expiresMinutes} minutes.</strong></p>
        </div>
        <div class="email-footer">
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>&copy; ${new Date().getFullYear()} GDGShopzy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Reset your GDGShopzy password

Hi ${input.userName},

We received a request to reset your GDGShopzy password.

Reset password: ${input.resetLink}

This link expires in ${input.expiresMinutes} minutes.

If you didn't request a password reset, please ignore this email.

© ${new Date().getFullYear()} GDGShopzy. All rights reserved.
  `.trim();

  return { subject, html, text };
}

export function passwordResetConfirmationTemplate(input: PasswordResetConfirmationEmailInput) {
  const subject = "Your GDGShopzy password was reset";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-header">
          <h1>GDGShopzy</h1>
        </div>
        <div class="email-content">
          <h2>Password Reset Successful</h2>
          <p>Hi ${escapeHtml(input.userName)},</p>
          <p>Your GDGShopzy password has been successfully reset.</p>
          <p>You can now log in with your new password.</p>
          <a href="${buildClientUrl("/login")}" class="button">Go to Login</a>
        </div>
        <div class="email-footer">
          <p>If you didn't make this change, please contact support immediately.</p>
          <p>&copy; ${new Date().getFullYear()} GDGShopzy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Your GDGShopzy password was reset

Hi ${input.userName},

Your GDGShopzy password has been successfully reset.

You can now log in with your new password: ${buildClientUrl("/login")}

If you didn't make this change, please contact support immediately.

© ${new Date().getFullYear()} GDGShopzy. All rights reserved.
  `.trim();

  return { subject, html, text };
}

export function buyerOrderConfirmationTemplate(input: BuyerOrderConfirmationEmailInput) {
  const subject = "Your GDGShopzy order is confirmed";
  const totalOrders = input.orders.length;
  const grandTotal = input.orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const orderItemsHtml = input.orders
    .map(
      (order) => `
    <div class="order-card">
      <h3>Order ID: ${escapeHtml(order.orderId)}</h3>
      <ul class="order-items">
        ${order.items
          .map(
            (item) => `
          <li>${escapeHtml(item.productName)} × ${item.quantity} — ${formatMoney(item.unitPrice * item.quantity)}</li>
        `,
          )
          .join("")}
      </ul>
      <div class="order-total">Order Total: ${formatMoney(order.totalAmount)}</div>
    </div>
  `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-header">
          <h1>GDGShopzy</h1>
        </div>
        <div class="email-content">
          <h2>Order Confirmation</h2>
          <p>Hi ${escapeHtml(input.buyerName)},</p>
          <p>Thank you for your order! We've received ${totalOrders} order(s) from your checkout.</p>
          ${orderItemsHtml}
          <div class="order-total" style="margin-top: 24px;">Grand Total: ${formatMoney(grandTotal)}</div>
          
          <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 18px;">Shipping Address</h3>
          <div class="address-block">
            <p><strong>${escapeHtml(input.shippingAddress.name)}</strong></p>
            <p>${escapeHtml(input.shippingAddress.phone)}</p>
            <p>${escapeHtml(input.shippingAddress.line1)}</p>
            ${input.shippingAddress.line2 ? `<p>${escapeHtml(input.shippingAddress.line2)}</p>` : ""}
            <p>${escapeHtml(input.shippingAddress.city)}, ${escapeHtml(input.shippingAddress.state)} ${escapeHtml(input.shippingAddress.zip)}</p>
          </div>
          
          <p><strong>Payment Method:</strong> ${escapeHtml(input.paymentMethod)}</p>
          <a href="${buildClientUrl("/orders")}" class="button">View Your Orders</a>
        </div>
        <div class="email-footer">
          <p>Questions? Contact us at ${env.EMAIL_REPLY_TO}</p>
          <p>&copy; ${new Date().getFullYear()} GDGShopzy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Your GDGShopzy order is confirmed

Hi ${input.buyerName},

Thank you for your order! We've received ${totalOrders} order(s) from your checkout.

${input.orders
  .map(
    (order) => `
Order ID: ${order.orderId}
${order.items.map((item) => `- ${item.productName} × ${item.quantity} — ${formatMoney(item.unitPrice * item.quantity)}`).join("\n")}
Order Total: ${formatMoney(order.totalAmount)}
`,
  )
  .join("\n")}

Grand Total: ${formatMoney(grandTotal)}

Shipping Address:
${input.shippingAddress.name}
${input.shippingAddress.phone}
${input.shippingAddress.line1}
${input.shippingAddress.line2 || ""}
${input.shippingAddress.city}, ${input.shippingAddress.state} ${input.shippingAddress.zip}

Payment Method: ${input.paymentMethod}

View your orders: ${buildClientUrl("/orders")}

© ${new Date().getFullYear()} GDGShopzy. All rights reserved.
  `.trim();

  return { subject, html, text };
}

export function sellerNewOrderNotificationTemplate(input: SellerNewOrderNotificationEmailInput) {
  const subject = `New order received on GDGShopzy — ${input.orderId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-header">
          <h1>GDGShopzy</h1>
        </div>
        <div class="email-content">
          <h2>New Order Received</h2>
          <p>A new order has been placed for <strong>${escapeHtml(input.storeName)}</strong>.</p>
          
          <div class="order-card">
            <h3>Order ID: ${escapeHtml(input.orderId)}</h3>
            <p><strong>Customer:</strong> ${escapeHtml(input.buyerName)} (${escapeHtml(input.buyerEmail)})</p>
            <ul class="order-items">
              ${input.items
                .map(
                  (item) => `
                <li>${escapeHtml(item.productName)} × ${item.quantity} — ${formatMoney(item.unitPrice * item.quantity)}</li>
              `,
                )
                .join("")}
            </ul>
            <div class="order-total">Total: ${formatMoney(input.totalAmount)}</div>
          </div>
          
          <p><strong>Shipping to:</strong> ${escapeHtml(input.shippingCity)}, ${escapeHtml(input.shippingState)}</p>
          <a href="${buildClientUrl("/seller/orders")}" class="button">View Order Details</a>
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} GDGShopzy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New order received on GDGShopzy

A new order has been placed for ${input.storeName}.

Order ID: ${input.orderId}
Customer: ${input.buyerName} (${input.buyerEmail})

Order Items:
${input.items.map((item) => `- ${item.productName} × ${item.quantity} — ${formatMoney(item.unitPrice * item.quantity)}`).join("\n")}

Total: ${formatMoney(input.totalAmount)}
Shipping to: ${input.shippingCity}, ${input.shippingState}

View order details: ${buildClientUrl("/seller/orders")}

© ${new Date().getFullYear()} GDGShopzy. All rights reserved.
  `.trim();

  return { subject, html, text };
}

export function buyerOrderStatusUpdateTemplate(input: BuyerOrderStatusUpdateEmailInput) {
  const subject = `Your GDGShopzy order status changed — ${input.orderId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-header">
          <h1>GDGShopzy</h1>
        </div>
        <div class="email-content">
          <h2>Order Status Update</h2>
          <p>Hi ${escapeHtml(input.buyerName)},</p>
          <p>Your order status has been updated.</p>
          
          <div class="order-card">
            <h3>Order ID: ${escapeHtml(input.orderId)}</h3>
            <p><strong>Previous Status:</strong> ${escapeHtml(input.oldStatus)}</p>
            <p><strong>New Status:</strong> ${escapeHtml(input.newStatus)}</p>
            <div class="order-total">Order Total: ${formatMoney(input.totalAmount)}</div>
          </div>
          
          <a href="${buildClientUrl("/orders")}" class="button">View Order Details</a>
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} GDGShopzy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Your GDGShopzy order status changed

Hi ${input.buyerName},

Your order status has been updated.

Order ID: ${input.orderId}
Previous Status: ${input.oldStatus}
New Status: ${input.newStatus}
Order Total: ${formatMoney(input.totalAmount)}

View order details: ${buildClientUrl("/orders")}

© ${new Date().getFullYear()} GDGShopzy. All rights reserved.
  `.trim();

  return { subject, html, text };
}

export function sellerOrderStatusUpdateNotificationTemplate(
  input: SellerOrderStatusUpdateNotificationEmailInput,
) {
  const subject = `Order status updated on GDGShopzy — ${input.orderId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-header">
          <h1>GDGShopzy</h1>
        </div>
        <div class="email-content">
          <h2>Order Status Updated</h2>
          <p>Order status has been updated for <strong>${escapeHtml(input.storeName)}</strong>.</p>
          
          <div class="order-card">
            <h3>Order ID: ${escapeHtml(input.orderId)}</h3>
            <p><strong>Previous Status:</strong> ${escapeHtml(input.oldStatus)}</p>
            <p><strong>New Status:</strong> ${escapeHtml(input.newStatus)}</p>
          </div>
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} GDGShopzy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Order status updated on GDGShopzy

Order status has been updated for ${input.storeName}.

Order ID: ${input.orderId}
Previous Status: ${input.oldStatus}
New Status: ${input.newStatus}

© ${new Date().getFullYear()} GDGShopzy. All rights reserved.
  `.trim();

  return { subject, html, text };
}
