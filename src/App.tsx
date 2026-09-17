import React, { useState } from 'react';
import { usePaymentCheckout } from './hooks/usePaymentCheckout';
import { Navbar, type NavTab } from './components/Navbar';
import { AmountInput } from './components/AmountInput';
import { PaymentMethodSelector } from './components/PaymentMethodSelector';
import { OrderSummary } from './components/OrderSummary';
import { PaymentStatusView } from './components/PaymentStatusView';
import { PaymentStatusTracker } from './components/PaymentStatusTracker';
import './index.css';

type CheckoutStep = 'input_amount' | 'select_payment';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('checkout');
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('input_amount');
  const [amountError, setAmountError] = useState<string | null>(null);

  const {
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
    setSelectedMethod,
    handleAmountChange,
    handlePresetAmount,
    handleCheckout,
    handleReset,
  } = usePaymentCheckout();

  // Validasi & Lanjut ke Pemilihan Metode Pembayaran
  const handleProceedToPayment = () => {
    const validation = service.validateAmount(rawAmount);
    if (!validation.isValid) {
      setAmountError(validation.message || 'Nominal tidak valid');
      return;
    }
    setAmountError(null);
    setCheckoutStep('select_payment');
  };

  // Kembali untuk ubah nominal
  const handleBackToAmount = () => {
    setCheckoutStep('input_amount');
    setAmountError(null);
  };

  // Reset setelah pembayaran selesai
  const handleCompleteReset = () => {
    handleReset();
    setCheckoutStep('input_amount');
    setAmountError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 antialiased relative selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Subtle, restrained ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Modern Navigation Bar (Zinc & Emerald) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'checkout' && (status === 'success' || status === 'failed')) {
            handleCompleteReset();
          }
        }}
        transactionCount={transactionCount}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {activeTab === 'status' ? (
          <PaymentStatusTracker
            service={service}
            onNavigateToCheckout={() => {
              handleCompleteReset();
              setActiveTab('checkout');
            }}
          />
        ) : (
          <div>
            {isLoadingInit ? (
              <div className="min-h-[450px] flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-zinc-400">Menyiapkan gateway pembayaran...</p>
              </div>
            ) : transactionResult && (status === 'success' || status === 'failed') ? (
              /* TAHAP 3: Halaman Status Hasil Pembayaran */
              <div className="space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => setActiveTab('status')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium underline underline-offset-4 cursor-pointer"
                  >
                    <span>Lihat di Riwayat Transaksi →</span>
                  </button>
                </div>
                <PaymentStatusView
                  result={transactionResult}
                  onBackToHome={handleCompleteReset}
                  formatCurrency={(val) => service.formatCurrency(val)}
                />
              </div>
            ) : checkoutStep === 'input_amount' ? (
              /* TAHAP 1: Input Nominal & Buat Transaksi (Mayar Style - Simple & Elegan) */
              <div className="max-w-lg mx-auto space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Mayar Payment Link</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Buat Transaksi Pembayaran
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Masukkan nominal tagihan untuk memulai transaksi pembayaran.
                  </p>
                </div>

                <div className="bg-zinc-950/60 p-6 sm:p-8 rounded-3xl border border-zinc-800/80 shadow-2xl backdrop-blur-xl space-y-6">
                  <AmountInput
                    formattedAmount={formattedAmount}
                    rawAmount={rawAmount}
                    onAmountChange={(val) => {
                      handleAmountChange(val);
                      if (amountError) setAmountError(null);
                    }}
                    onSelectPreset={(amt) => {
                      handlePresetAmount(amt);
                      if (amountError) setAmountError(null);
                    }}
                  />

                  {amountError && (
                    <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{amountError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="w-full py-4 px-5 rounded-2xl font-bold text-sm sm:text-base bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Buat Transaksi</span>
                    <span>→</span>
                  </button>

                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-center gap-4 text-[11px] text-zinc-500">
                    <span>🔒 Enkripsi Aman</span>
                    <span>•</span>
                    <span>⚡ Multi-Payment Channel</span>
                    <span>•</span>
                    <span>Instant Settlement</span>
                  </div>
                </div>
              </div>
            ) : (
              /* TAHAP 2: Pemilihan Cara Pembayaran */
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950/60 border border-zinc-800/80 p-4 sm:p-5 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleBackToAmount}
                      className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
                      title="Ubah Nominal"
                    >
                      ←
                    </button>
                    <div>
                      <div className="text-xs text-zinc-400">Total Tagihan Transaksi:</div>
                      <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
                        {service.formatCurrency(rawAmount)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBackToAmount}
                    className="text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-4 cursor-pointer self-start sm:self-auto"
                  >
                    Ubah Nominal
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-6">
                    <section className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
                      <PaymentMethodSelector
                        methods={methods}
                        selectedMethod={selectedMethod}
                        onSelectMethod={setSelectedMethod}
                      />
                    </section>
                  </div>

                  <div className="lg:col-span-5 sticky top-24">
                    <OrderSummary
                      provider={selectedProvider}
                      method={selectedMethod}
                      breakdown={breakdown}
                      status={status}
                      errorMessage={errorMessage}
                      onPayNow={handleCheckout}
                      formatCurrency={(val) => service.formatCurrency(val)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>@AlrisDigital</p>
      </footer>
    </div>
  );
}

export default App;
