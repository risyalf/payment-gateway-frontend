import type {
  PaymentProvider,
  PaymentMethod,
  PaymentFeeBreakdown,
  PaymentTransactionRequest,
  PaymentTransactionResult,
} from '../types/payment';
import { IPaymentRepository, MockPaymentRepository } from '../repositories/paymentRepository';

/**
 * SERVICE LAYER
 * Bertanggung jawab atas:
 * 1. Business logic (kalkulasi biaya, breakdown fee, validasi nominal)
 * 2. Data formatting & sanitization
 * 3. Dependency Injection (menerima IPaymentRepository via constructor)
 */
export class PaymentService {
  private repository: IPaymentRepository;

  constructor(repository: IPaymentRepository = new MockPaymentRepository()) {
    this.repository = repository;
  }

  // Mengambil daftar provider
  async fetchProviders(): Promise<PaymentProvider[]> {
    return this.repository.getProviders();
  }

  // Mengambil metode pembayaran berdasarkan provider
  async fetchMethods(providerId: string): Promise<PaymentMethod[]> {
    return this.repository.getPaymentMethods(providerId);
  }

  // Mengambil seluruh riwayat transaksi
  async fetchAllTransactions(): Promise<PaymentTransactionResult[]> {
    return this.repository.getTransactions();
  }

  // Mencari status transaksi berdasarkan Order ID atau Kode Referensi
  async fetchTransactionById(orderId: string): Promise<PaymentTransactionResult | null> {
    if (!orderId || !orderId.trim()) {
      return null;
    }
    return this.repository.getTransactionById(orderId);
  }

  // Business Logic: Menghitung rincian biaya (Breakdown Fee)
  calculateBreakdown(amount: number, provider: PaymentProvider | null): PaymentFeeBreakdown {
    if (!amount || amount <= 0 || !provider) {
      return {
        subtotal: amount || 0,
        providerFee: 0,
        serviceFee: 0,
        totalAmount: amount || 0,
      };
    }

    const providerFee = Math.round((amount * provider.feePercentage) / 100) + provider.fixedFee;
    const serviceFee = 1000; // Biaya platform/pemeliharaan tetap
    const totalAmount = amount + providerFee + serviceFee;

    return {
      subtotal: amount,
      providerFee,
      serviceFee,
      totalAmount,
    };
  }

  // Validasi batas nominal transaksi
  validateAmount(amount: number): { isValid: boolean; message?: string } {
    if (amount <= 0) {
      return { isValid: false, message: 'Nominal pembayaran harus lebih besar dari 0' };
    }
    if (amount < 10000) {
      return { isValid: false, message: 'Minimal transaksi adalah Rp 10.000' };
    }
    if (amount > 100000000) {
      return { isValid: false, message: 'Maksimal transaksi adalah Rp 100.000.000' };
    }
    return { isValid: true };
  }

  // Business Logic: Format Rupiah & Pemisah Ribuan
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  // Format angka ribuan biasa tanpa simbol Rp (untuk value input)
  formatNumberInput(value: string | number): string {
    const rawDigits = String(value).replace(/\D/g, '');
    if (!rawDigits) return '';
    return new Intl.NumberFormat('id-ID').format(Number(rawDigits));
  }

  // Parse string ribuan kembali ke number murni
  parseNumberInput(formattedValue: string): number {
    const clean = formattedValue.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  }

  // Eksekusi pembayaran
  async processPayment(
    request: PaymentTransactionRequest,
    provider: PaymentProvider,
    method: PaymentMethod
  ): Promise<PaymentTransactionResult> {
    const validation = this.validateAmount(request.amount);
    if (!validation.isValid) {
      throw new Error(validation.message || 'Nominal tidak valid');
    }

    const breakdown = this.calculateBreakdown(request.amount, provider);
    return this.repository.createTransaction(request, breakdown, provider, method);
  }
}

// Instance default yang siap pakai (Singleton sederhana untuk kemudahan hook)
export const defaultPaymentService = new PaymentService();
