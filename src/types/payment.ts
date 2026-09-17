export type PaymentProviderId = 'midtrans' | 'xendit' | 'stripe' | 'doku' | 'mayar';

export interface PaymentProvider {
  id: PaymentProviderId;
  name: string;
  tagline: string;
  badge: string;
  feePercentage: number;
  fixedFee: number;
  logo: string;
}

export type PaymentCategory = 'qris' | 'va' | 'ewallet' | 'card';

export interface PaymentMethod {
  id: string;
  name: string;
  category: PaymentCategory;
  providerCode: string;
  icon: string;
  description: string;
  estimatedTime: string;
  isPopular?: boolean;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'pending' | 'failed';

export interface PaymentTransactionRequest {
  providerId: PaymentProviderId;
  methodId: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
}

export interface PaymentFeeBreakdown {
  subtotal: number;
  providerFee: number;
  serviceFee: number;
  totalAmount: number;
}

export interface PaymentTransactionResult {
  orderId: string;
  transactionRef: string;
  status: PaymentStatus;
  amount: number;
  breakdown: PaymentFeeBreakdown;
  provider: PaymentProvider;
  method: PaymentMethod;
  timestamp: string;
  qrCodeUrl?: string;
  virtualAccountNumber?: string;
  redirectUrl?: string;
}

