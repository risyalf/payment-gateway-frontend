import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  PaymentProvider,
  PaymentMethod,
  PaymentStatus,
  PaymentTransactionResult,
  PaymentFeeBreakdown,
} from '../types/payment';
import { PaymentService, defaultPaymentService } from '../services/paymentService';

/**
 * CUSTOM HOOK: usePaymentCheckout
 * Bertindak sebagai Controller / ViewModel yang menjembatani Component (UI) dengan PaymentService.
 * Menerapkan Dependency Inversion: paymentService dapat di-inject dari luar jika dibutuhkan (misal saat testing).
 */
export function usePaymentCheckout(service: PaymentService = defaultPaymentService) {
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const [rawAmount, setRawAmount] = useState<number>(150000);
  const [formattedAmount, setFormattedAmount] = useState<string>('150.000');

  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [transactionResult, setTransactionResult] = useState<PaymentTransactionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isLoadingInit, setIsLoadingInit] = useState<boolean>(true);
  const [transactionCount, setTransactionCount] = useState<number>(0);

  // Fungsi sinkronisasi jumlah transaksi untuk badge navbar
  const refreshTransactionCount = useCallback(async () => {
    try {
      const allTx = await service.fetchAllTransactions();
      setTransactionCount(allTx.length);
    } catch {
      // noop
    }
  }, [service]);

  // Load awal providers dan methods
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        setIsLoadingInit(true);
        const [fetchedProviders, allTx] = await Promise.all([
          service.fetchProviders(),
          service.fetchAllTransactions(),
        ]);

        if (!isMounted) return;
        setProviders(fetchedProviders);
        setTransactionCount(allTx.length);

        const initialProvider = fetchedProviders[0] || null;
        setSelectedProvider(initialProvider);

        if (initialProvider) {
          const fetchedMethods = await service.fetchMethods(initialProvider.id);
          if (!isMounted) return;
          setMethods(fetchedMethods);
          setSelectedMethod(fetchedMethods[0] || null);
        }
      } catch (err: any) {
        if (isMounted) setErrorMessage(err.message || 'Gagal memuat data gateway');
      } finally {
        if (isMounted) setIsLoadingInit(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [service]);

  // Kalkulasi Breakdown Biaya secara otomatis dengan useMemo
  const breakdown: PaymentFeeBreakdown = useMemo(() => {
    return service.calculateBreakdown(rawAmount, selectedProvider);
  }, [service, rawAmount, selectedProvider]);

  // Handler Ganti Provider
  const handleSelectProvider = useCallback(async (provider: PaymentProvider) => {
    setSelectedProvider(provider);
    try {
      const fetchedMethods = await service.fetchMethods(provider.id);
      setMethods(fetchedMethods);
      // Pertahankan pilihan metode jika ada yang sama, atau fallback ke default pertama
      setSelectedMethod((prev) => {
        const exists = fetchedMethods.find((m) => m.id === prev?.id);
        return exists || fetchedMethods[0] || null;
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memperbarui metode pembayaran');
    }
  }, [service]);

  // Handler Input Jumlah / Nominal
  const handleAmountChange = useCallback((value: string) => {
    const formatted = service.formatNumberInput(value);
    const parsed = service.parseNumberInput(value);
    setFormattedAmount(formatted);
    setRawAmount(parsed);
    setErrorMessage(null);
  }, [service]);

  // Handler Preset Nominal Cepat
  const handlePresetAmount = useCallback((amount: number) => {
    setRawAmount(amount);
    setFormattedAmount(service.formatNumberInput(amount));
    setErrorMessage(null);
  }, [service]);

  // Handler Eksekusi Pembayaran
  const handleCheckout = useCallback(async () => {
    if (!selectedProvider || !selectedMethod) {
      setErrorMessage('Silakan pilih provider dan metode pembayaran terlebih dahulu');
      return;
    }

    const validation = service.validateAmount(rawAmount);
    if (!validation.isValid) {
      setErrorMessage(validation.message || 'Nominal tidak valid');
      return;
    }

    try {
      setStatus('processing');
      setErrorMessage(null);

      const result = await service.processPayment(
        {
          providerId: selectedProvider.id,
          methodId: selectedMethod.id,
          amount: rawAmount,
        },
        selectedProvider,
        selectedMethod
      );

      setTransactionResult(result);
      setStatus(result.status);
      await refreshTransactionCount();
    } catch (err: any) {
      setStatus('failed');
      setErrorMessage(err.message || 'Pembayaran gagal diproses');
    }
  }, [service, selectedProvider, selectedMethod, rawAmount, refreshTransactionCount]);

  // Reset ke halaman awal
  const handleReset = useCallback(() => {
    setStatus('idle');
    setTransactionResult(null);
    setErrorMessage(null);
  }, []);

  return {
    providers,
    selectedProvider,
    methods,
    selectedMethod,
    rawAmount,
    formattedAmount,
    breakdown,
    status,
    transactionResult,
    errorMessage,
    isLoadingInit,
    transactionCount,
    service,
    refreshTransactionCount,
    handleSelectProvider,
    setSelectedMethod,
    handleAmountChange,
    handlePresetAmount,
    handleCheckout,
    handleReset,
  };
}
