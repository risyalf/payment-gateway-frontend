import React from 'react';
import type {
  PaymentProvider,
  PaymentMethod,
  PaymentFeeBreakdown,
  PaymentStatus,
} from '../types/payment';

interface OrderSummaryProps {
  provider: PaymentProvider | null;
  method: PaymentMethod | null;
  breakdown: PaymentFeeBreakdown;
  status: PaymentStatus;
  errorMessage: string | null;
  onPayNow: () => void;
  formatCurrency: (amount: number) => string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  provider,
  method,
  breakdown,
  status,
  errorMessage,
  onPayNow,
  formatCurrency,
}) => {
  const isProcessing = status === 'processing';
  const isPayDisabled = isProcessing || breakdown.subtotal <= 0 || !provider || !method;

  return (
    <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between h-full shadow-xl">
      <div className="space-y-5">
        <div className="border-b border-zinc-800 pb-4">
          <h3 className="text-base font-bold text-zinc-100 flex items-center justify-between">
            <span>Ringkasan Transaksi</span>
            <span className="text-xs font-mono font-normal text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
              SECURE 256-BIT
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Rincian kalkulasi biaya pemrosesan gateway secara transparan.
          </p>
        </div>

        {/* Selected Items preview */}
        <div className="bg-zinc-950/50 rounded-xl p-3.5 border border-zinc-800/50 space-y-2 text-xs">
          <div className="flex justify-between items-center text-zinc-300">
            <span className="text-zinc-400">Gateway Active:</span>
            <span className="font-semibold text-zinc-200">
              {provider ? `${provider.name} (${provider.badge})` : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center text-zinc-300">
            <span className="text-zinc-400">Metode Bayar:</span>
            <span className="font-semibold text-zinc-200">
              {method ? `${method.icon} ${method.name}` : '-'}
            </span>
          </div>
        </div>

        {/* Fee breakdown list */}
        <div className="space-y-2.5 text-sm pt-1">
          <div className="flex justify-between text-zinc-300">
            <span>Nominal Tagihan</span>
            <span className="font-medium text-zinc-100">{formatCurrency(breakdown.subtotal)}</span>
          </div>

          <div className="flex justify-between text-zinc-400 text-xs">
            <span>Biaya Pemrosesan Gateway</span>
            <span className="font-mono text-zinc-300">{formatCurrency(breakdown.providerFee)}</span>
          </div>

          <div className="flex justify-between text-zinc-400 text-xs">
            <span>Biaya Layanan & Pemeliharaan</span>
            <span className="font-mono text-zinc-300">{formatCurrency(breakdown.serviceFee)}</span>
          </div>

          <div className="border-t border-zinc-800 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-semibold text-zinc-200">Total Pembayaran</span>
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">
              {formatCurrency(breakdown.totalAmount)}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-start gap-2 animate-shake">
            <span className="text-sm">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6 mt-6 border-t border-zinc-800">
        <button
          type="button"
          onClick={onPayNow}
          disabled={isPayDisabled}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${isPayDisabled
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]'
            }`}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Memproses Transaksi...</span>
            </>
          ) : (
            <>
              <span>Bayar Sekarang</span>
              <span>→</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">🔒 Enkripsi SSL</span>
          <span>•</span>
          <span>🛡️ PCI-DSS Level 1</span>
          <span>•</span>
          <span>⚡ Real-time Settlement</span>
        </div>
      </div>
    </div>
  );
};

