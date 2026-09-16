import React, { useState } from 'react';
import type { PaymentTransactionResult } from '../types/payment';

interface PaymentStatusViewProps {
  result: PaymentTransactionResult;
  onBackToHome: () => void;
  formatCurrency: (val: number) => string;
}

export const PaymentStatusView: React.FC<PaymentStatusViewProps> = ({
  result,
  onBackToHome,
  formatCurrency,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isSuccess = result.status === 'success';
  const isFailed = result.status === 'failed';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert(`Invoice ${result.orderId} berhasil diunduh (Simulasi PDF).`);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fadeIn">
      {/* Status Header & Icon */}
      <div className="text-center space-y-3">
        <div
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-lg ring-8 transition-all ${isSuccess
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 ring-emerald-500/10'
              : isFailed
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 ring-rose-500/10'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 ring-amber-500/10'
            }`}
        >
          {isSuccess ? '✓' : isFailed ? '✕' : '⏳'}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-zinc-100">
            {isSuccess
              ? 'Pembayaran Berhasil Diterima!'
              : isFailed
                ? 'Pembayaran Gagal Diproses'
                : 'Menunggu Pembayaran'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {isSuccess
              ? 'Transaksi Anda telah diverifikasi otomatis oleh gateway.'
              : isFailed
                ? 'Terjadi kendala jaringan atau saldo tidak mencukupi.'
                : 'Silakan selesaikan pembayaran sebelum batas waktu berakhir.'}
          </p>
        </div>
      </div>

      {/* QRIS or VA Special Box (If Applicable) */}
      {result.virtualAccountNumber && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-2">
          <div className="text-xs text-zinc-400">Nomor Virtual Account {result.method.name}:</div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl font-mono font-bold text-indigo-400 tracking-wider">
              {result.virtualAccountNumber}
            </span>
            <button
              onClick={() => handleCopy(result.virtualAccountNumber!)}
              className="text-xs px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 cursor-pointer"
            >
              {isCopied ? 'Tersalin ✓' : 'Salin'}
            </button>
          </div>
        </div>
      )}

      {result.qrCodeUrl && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center space-y-3">
          <div className="text-xs text-zinc-400">Scan QRIS Realtime dengan Aplikasi Apapun:</div>
          <div className="p-2 bg-white rounded-xl shadow-md">
            <img src={result.qrCodeUrl} alt="QR Code" className="w-36 h-36" />
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Mendukung BCA, GoPay, OVO, Dana, ShopeePay</span>
        </div>
      )}

      {/* Transaction Details Table */}
      <div className="bg-zinc-950/70 rounded-2xl p-5 border border-zinc-800/80 space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between items-center py-1 border-b border-zinc-900">
          <span className="text-zinc-400">ID Pesanan</span>
          <span className="font-mono font-medium text-zinc-200">{result.orderId}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-zinc-900">
          <span className="text-zinc-400">No. Referensi Transaksi</span>
          <span className="font-mono text-zinc-300">{result.transactionRef}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-zinc-900">
          <span className="text-zinc-400">Gateway Provider</span>
          <span className="font-semibold text-zinc-200">
            {result.provider.logo} {result.provider.name}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-zinc-900">
          <span className="text-zinc-400">Metode Pembayaran</span>
          <span className="font-medium text-zinc-200">
            {result.method.icon} {result.method.name}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-zinc-900">
          <span className="text-zinc-400">Waktu Transaksi</span>
          <span className="text-zinc-300">{result.timestamp}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold text-zinc-200">Total Pembayaran</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">
            {formatCurrency(result.breakdown.totalAmount)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownloadInvoice}
          disabled={isDownloading}
          className="w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isDownloading ? (
            <span>Mengunduh...</span>
          ) : (
            <>
              <span>📥 Unduh Resi / Invoice</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBackToHome}
          className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Kembali ke Beranda</span>
          <span>↺</span>
        </button>
      </div>
    </div>
  );
};

