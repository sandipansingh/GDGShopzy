export interface EmailResult {
  sent: boolean;
  providerId?: string;
  reason?: string;
}

export interface EmployeeInviteEmailInput {
  toEmail: string;
  storeName: string;
  inviteLink: string;
  expiresAt: Date;
}

export interface PasswordResetEmailInput {
  toEmail: string;
  userName: string;
  resetLink: string;
  expiresMinutes: number;
}

export interface PasswordResetConfirmationEmailInput {
  toEmail: string;
  userName: string;
}

export interface BuyerOrderConfirmationEmailInput {
  toEmail: string;
  buyerName: string;
  orders: Array<{
    orderId: string;
    items: Array<{
      productName: string;
      quantity: number;
      unitPrice: number;
    }>;
    totalAmount: number;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
}

export interface SellerNewOrderNotificationEmailInput {
  toEmail: string;
  storeName: string;
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  shippingCity: string;
  shippingState: string;
}

export interface BuyerOrderStatusUpdateEmailInput {
  toEmail: string;
  buyerName: string;
  orderId: string;
  oldStatus: string;
  newStatus: string;
  totalAmount: number;
}

export interface SellerOrderStatusUpdateNotificationEmailInput {
  toEmail: string;
  storeName: string;
  orderId: string;
  oldStatus: string;
  newStatus: string;
}
