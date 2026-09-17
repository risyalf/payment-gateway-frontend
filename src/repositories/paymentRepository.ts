import type {
  PaymentProvider,
  PaymentMethod,
  PaymentTransactionRequest,
  PaymentTransactionResult,
  PaymentFeeBreakdown,
} from '../types/payment';

/**
 * REPOSITORY INTERFACE (Dependency Inversion Principle)
 * Abstraksi kontrak untuk data fetching. Bisa diimplementasi oleh Mock, Axios, Fetch, dll.
 */
export interface IPaymentRepository {
  getProviders(): Promise<PaymentProvider[]>;
  getPaymentMethods(providerId: string): Promise<PaymentMethod[]>;
  getTransactions(): Promise<PaymentTransactionResult[]>;
  getTransactionById(orderId: string): Promise<PaymentTransactionResult | null>;
  createTransaction(
    request: PaymentTransactionRequest,
    breakdown: PaymentFeeBreakdown,
    provider: PaymentProvider,
    method: PaymentMethod
  ): Promise<PaymentTransactionResult>;
}

/**
 * MOCK REPOSITORY IMPLEMENTATION
 * Menggunakan simulasi latency (Promise delay) untuk menguji state loading & UI responses.
 */
export class MockPaymentRepository implements IPaymentRepository {
  private mockProviders: PaymentProvider[] = [
    {
      id: 'mayar',
      name: 'Mayar',
      tagline: 'Payment link & invoice otomatis',
      badge: 'Mayar Official',
      feePercentage: 1.5,
      fixedFee: 2000,
      logo: '⚡',
    },
  ];

  private mockMethods: PaymentMethod[] = [
    {
      id: 'qris',
      name: 'QRIS Realtime',
      category: 'qris',
      providerCode: 'QRIS_ALL',
      icon: '📱',
      description: 'Scan via BCA, GoPay, OVO, Dana, LinkAja',
      estimatedTime: 'Instant (~5 detik)',
      isPopular: true,
    },
    {
      id: 'va_bca',
      name: 'BCA Virtual Account',
      category: 'va',
      providerCode: 'BCA_VA',
      icon: '🏦',
      description: 'Verifikasi otomatis 24/7 tanpa bukti transfer',
      estimatedTime: 'Instant',
      isPopular: true,
    },
    {
      id: 'va_mandiri',
      name: 'Mandiri Virtual Account',
      category: 'va',
      providerCode: 'MANDIRI_VA',
      icon: '🏛️',
      description: 'Bayar via Livin by Mandiri atau ATM',
      estimatedTime: 'Instant',
    },
    {
      id: 'gopay',
      name: 'GoPay / GoPay Later',
      category: 'ewallet',
      providerCode: 'GOPAY',
      icon: '🟢',
      description: 'Direct redirect atau scan barcode Gojek app',
      estimatedTime: 'Instant',
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit / Debit',
      category: 'card',
      providerCode: 'CC_3DS',
      icon: '💳',
      description: 'Visa, Mastercard, JCB dengan keamanan 3D-Secure',
      estimatedTime: 'Instant',
    },
  ];

  // In-memory transactions store untuk history & lookup
  private mockTransactions: PaymentTransactionResult[] = [
    {
      orderId: 'ORD-20260916-8912',
      transactionRef: 'TXREF-9A8B7C6D',
      status: 'success',
      amount: 250000,
      breakdown: {
        subtotal: 250000,
        providerFee: 5750,
        serviceFee: 1000,
        totalAmount: 256750,
      },
      provider: {
        id: 'midtrans',
        name: 'Midtrans Snap',
        tagline: 'Solusi payment terlengkap di Indonesia',
        badge: 'Lokal Pilihan',
        feePercentage: 1.5,
        fixedFee: 2000,
        logo: '🇮🇩',
      },
      method: {
        id: 'qris',
        name: 'QRIS Realtime',
        category: 'qris',
        providerCode: 'QRIS_ALL',
        icon: '📱',
        description: 'Scan via BCA, GoPay, OVO, Dana, LinkAja',
        estimatedTime: 'Instant (~5 detik)',
        isPopular: true,
      },
      timestamp: '16 Sep 2026, 11:30',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=MOCK_QRIS_PAYMENT',
    },
    {
      orderId: 'ORD-20260916-4321',
      transactionRef: 'TXREF-3F2E1D0C',
      status: 'pending',
      amount: 500000,
      breakdown: {
        subtotal: 500000,
        providerFee: 10500,
        serviceFee: 1000,
        totalAmount: 511500,
      },
      provider: {
        id: 'xendit',
        name: 'Xendit Gateway',
        tagline: 'Infrastruktur pembayaran digital Asia Tenggara',
        badge: 'Enterprise',
        feePercentage: 1.8,
        fixedFee: 1500,
        logo: '⚡',
      },
      method: {
        id: 'va_bca',
        name: 'BCA Virtual Account',
        category: 'va',
        providerCode: 'BCA_VA',
        icon: '🏦',
        description: 'Verifikasi otomatis 24/7 tanpa bukti transfer',
        estimatedTime: 'Instant',
        isPopular: true,
      },
      timestamp: '16 Sep 2026, 10:15',
      virtualAccountNumber: '8800192837465',
    },
    {
      orderId: 'ORD-20260915-1102',
      transactionRef: 'TXREF-7K6J5H4G',
      status: 'failed',
      amount: 75000,
      breakdown: {
        subtotal: 75000,
        providerFee: 5175,
        serviceFee: 1000,
        totalAmount: 81175,
      },
      provider: {
        id: 'stripe',
        name: 'Stripe Global',
        tagline: 'Standar transaksi internasional & multicurrency',
        badge: 'Global',
        feePercentage: 2.9,
        fixedFee: 3000,
        logo: '🌍',
      },
      method: {
        id: 'credit_card',
        name: 'Kartu Kredit / Debit',
        category: 'card',
        providerCode: 'CC_3DS',
        icon: '💳',
        description: 'Visa, Mastercard, JCB dengan keamanan 3D-Secure',
        estimatedTime: 'Instant',
      },
      timestamp: '15 Sep 2026, 18:45',
    },
  ];

  async getProviders(): Promise<PaymentProvider[]> {
    await this.delay(250);
    return [...this.mockProviders];
  }

  async getPaymentMethods(_providerId: string): Promise<PaymentMethod[]> {
    await this.delay(250);
    return [...this.mockMethods];
  }

  async getTransactions(): Promise<PaymentTransactionResult[]> {
    await this.delay(300);
    return [...this.mockTransactions];
  }

  async getTransactionById(orderId: string): Promise<PaymentTransactionResult | null> {
    await this.delay(350);
    const cleanSearch = orderId.trim().toLowerCase();
    const found = this.mockTransactions.find(
      (tx) =>
        tx.orderId.toLowerCase() === cleanSearch ||
        tx.transactionRef.toLowerCase() === cleanSearch
    );
    return found ? { ...found } : null;
  }

  async createTransaction(
    request: PaymentTransactionRequest,
    breakdown: PaymentFeeBreakdown,
    provider: PaymentProvider,
    method: PaymentMethod
  ): Promise<PaymentTransactionResult> {
    // Simulasi network latency 1.5 detik
    await this.delay(1500);

    const isSuccess = Math.random() > 0.05;
    const now = new Date();
    const orderId = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx: PaymentTransactionResult = {
      orderId,
      transactionRef: `TXREF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: isSuccess ? 'success' : 'failed',
      amount: request.amount,
      breakdown,
      provider,
      method,
      timestamp: now.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      virtualAccountNumber: method.category === 'va' ? `88001${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      qrCodeUrl: method.category === 'qris' ? 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=MOCK_QRIS_PAYMENT' : undefined,
    };

    // Tambahkan ke riwayat transaksi paling atas
    this.mockTransactions.unshift(newTx);

    return newTx;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
