/**
 * Payment and financial related types
 */

export interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal" | "wallet";
  details: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    accountNumber?: string;
    bankName?: string;
    email?: string; // for PayPal
  };
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "payment" | "refund" | "withdrawal" | "deposit";
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  description: string;
  createdAt: string;
  paymentMethodId?: string;
  jobId?: string;
  fromUserId?: string;
  toUserId?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  lockedAmount: number; // Amount reserved for ongoing jobs
  lastUpdated: string;
}

export interface PaymentRequest {
  amount: number;
  description: string;
  paymentMethodId: string;
  jobId?: string;
}

export interface WithdrawalRequest {
  amount: number;
  paymentMethodId: string;
  description?: string;
}
