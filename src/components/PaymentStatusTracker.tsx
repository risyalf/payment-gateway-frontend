import React, { useState, useEffect, useMemo } from 'react';
import type { PaymentTransactionResult, PaymentStatus } from '../types/payment';
import { PaymentService } from '../services/paymentService';
import { PaymentStatusView } from './PaymentStatusView';

interface PaymentStatusTrackerProps {
  service: PaymentService;
  onNavigateToCheckout: () => void;
}

type FilterStatus = 'all' | 'success' | 'pending' | 'failed';

export const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({
  service,
  onNavigateToCheckout,
}) => {
  const [transactions, setTransactions] = useState<PaymentTransactionResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransactionResult | null>(null);

  // Fetch transactions from Service
  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await service.fetchAllTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [service]);

  // Filter & Search Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        searchQuery === '' ||
        tx.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.method.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, filterStatus]);

  // Direct search action
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const found = await service.fetchTransactionById(searchQuery.trim());
      if (found) {
        setSelectedTransaction(found);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Berhasil
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"></span>
            Menunggu
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/40 text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Gagal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Detail Modal if a transaction is selected */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl my-8">
            <button
              onClick={() => setSelectedTransaction(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-all cursor-pointer border border-zinc-700"
              title="Tutup Detail"
            >
              ✕
            </button>
            <PaymentStatusView
              result={selectedTransaction}
              onBackToHome={() => setSelectedTransaction(null)}
              formatCurrency={(val) => service.formatCurrency(val)}
            />
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Status & Riwayat Pembayaran
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Lacak dan verifikasi status transaksi realtime melalui gateway repository.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToCheckout}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/10 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>+ Buat Transaksi Baru</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-zinc-950/50 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID Pesanan (cth: ORD-2026...) atau Kode Referensi..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-xl border border-zinc-700 transition-all cursor-pointer"
          >
            Cari Status
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-900">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-zinc-400 mr-1.5">Filter Status:</span>
            {(['all', 'success', 'pending', 'failed'] as FilterStatus[]).map((st) => {
              const labels: Record<FilterStatus, string> = {
                all: 'Semua',
                success: 'Berhasil',
                pending: 'Menunggu',
                failed: 'Gagal',
              };

              const isSelected = filterStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${isSelected
                      ? 'bg-emerald-500 text-zinc-950 font-semibold border-emerald-400 shadow-sm'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300'
                    }`}
                >
                  {labels[st]}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-zinc-500">
            Ditemukan: {filteredTransactions.length} transaksi
          </span>
        </div>
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-zinc-400">Memuat riwayat transaksi dari repository...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="py-16 text-center bg-zinc-950/30 rounded-2xl border border-zinc-800/60 p-8 space-y-3">
          <div className="text-3xl">📭</div>
          <div className="text-base font-semibold text-zinc-200">Tidak ada transaksi ditemukan</div>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Tidak ada data transaksi yang cocok dengan kata kunci atau filter status yang dipilih.
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-emerald-400 hover:underline pt-1 cursor-pointer"
            >
              Reset Kata Kunci Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.orderId}
              onClick={() => setSelectedTransaction(tx)}
              className="group bg-zinc-950/50 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              {/* Left Details */}
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl group-hover:border-zinc-700 transition-all flex-shrink-0">
                  {tx.method.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-sm text-zinc-100">
                      {tx.orderId}
                    </span>
                    {getStatusBadge(tx.status)}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {tx.provider.name}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-3">
                    <span>Metode: <strong className="text-zinc-300 font-medium">{tx.method.name}</strong></span>
                    <span>•</span>
                    <span>Ref: <strong className="text-zinc-400 font-mono">{tx.transactionRef}</strong></span>
                    <span>•</span>
                    <span className="text-zinc-500 font-mono">{tx.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Right Amount & Action */}
              <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-900">
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Dibayar</div>
                  <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                    {service.formatCurrency(tx.breakdown.totalAmount)}
                  </div>
                </div>

                <div className="text-xs text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 sm:mt-1 font-medium">
                  <span>Lihat Resi</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
