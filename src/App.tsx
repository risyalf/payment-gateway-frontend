import React, { useState } from 'react';
import { usePaymentCheckout } from './hooks/usePaymentCheckout';
import { Navbar, type NavTab } from './components/Navbar';
import { ProviderSelector } from './components/ProviderSelector';
import { AmountInput } from './components/AmountInput';
import { PaymentMethodSelector } from './components/PaymentMethodSelector';
import { OrderSummary } from './components/OrderSummary';
import { PaymentStatusView } from './components/PaymentStatusView';
import { PaymentStatusTracker } from './components/PaymentStatusTracker';
import './index.css';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('checkout');

  const {
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
    handleSelectProvider,
    setSelectedMethod,
    handleAmountChange,
    handlePresetAmount,
    handleCheckout,
    handleReset,
  } = usePaymentCheckout();

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 antialiased relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-900/15 via-purple-900/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Modern Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        transactionCount={transactionCount}
      />

      {/* Main Content View */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Menu 2: Tab Status Pembayaran & Riwayat */}
        {activeTab === 'status' ? (
          <PaymentStatusTracker
            service={service}
            onNavigateToCheckout={() => {
              handleReset();
              setActiveTab('checkout');
            }}
          />
        ) : (
          /* Menu 1: Tab Checkout */
          <div>
            {isLoadingInit ? (
              <div className="min-h-[450px] flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-zinc-400">Menginisialisasi modul gateway & repository...</p>
              </div>
            ) : transactionResult && (status === 'success' || status === 'failed') ? (
              /* Tampilan Hasil Setelah Checkout */
              <div className="space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => setActiveTab('status')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium underline underline-offset-4 cursor-pointer"
                  >
                    <span>Lihat di Riwayat Transaksi →</span>
                  </button>
                </div>
                <PaymentStatusView
                  result={transactionResult}
                  onBackToHome={handleReset}
                  formatCurrency={(val) => service.formatCurrency(val)}
                />
              </div>
            ) : (
              /* Halaman Formulir Checkout Utama */
              <div className="space-y-8">
                <div className="max-w-2xl">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Pusat Pembayaran & Checkout
                  </h1>
                  <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                    Pilih provider payment gateway pilihan Anda, tentukan nominal, dan pilih kanal transfer atau e-wallet yang diinginkan.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Form Input Sisi Kiri (Span 7) */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* 1. Pemilihan Provider */}
                    <section className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
                      <ProviderSelector
                        providers={providers}
                        selectedProvider={selectedProvider}
                        onSelectProvider={handleSelectProvider}
                      />
                    </section>

                    {/* 2. Input Nominal */}
                    <section className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
                      <AmountInput
                        formattedAmount={formattedAmount}
                        rawAmount={rawAmount}
                        onAmountChange={handleAmountChange}
                        onSelectPreset={handlePresetAmount}
                      />
                    </section>

                    {/* 3. Pemilihan Metode Pembayaran */}
                    <section className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
                      <PaymentMethodSelector
                        methods={methods}
                        selectedMethod={selectedMethod}
                        onSelectMethod={setSelectedMethod}
                      />
                    </section>
                  </div>

                  {/* Ringkasan & Action Sisi Kanan (Span 5) */}
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

      {/* Modern Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>
          @AlrisDigital
        </p>
      </footer>
    </div>
  );
}

export default App;
