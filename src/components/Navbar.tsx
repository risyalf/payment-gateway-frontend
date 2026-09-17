import React from 'react';

export type NavTab = 'checkout' | 'status';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  transactionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  transactionCount,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-zinc-950 shadow-md shadow-emerald-500/10">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                AlrisPay
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                GATEWAY
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 hidden sm:block -mt-0.5">
              Unified Payment System
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Duotone: Zinc & Emerald) */}
        <nav className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            type="button"
            onClick={() => onTabChange('checkout')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${activeTab === 'checkout'
                ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
          >
            <span>💳</span>
            <span>Checkout</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('status')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${activeTab === 'status'
                ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
          >
            <span>📊</span>
            <span className="hidden sm:inline">Status Transaksi</span>
            <span className="sm:hidden">Status</span>
            {transactionCount > 0 && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'status'
                    ? 'bg-zinc-950 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}
              >
                {transactionCount}
              </span>
            )}
          </button>
        </nav>

        {/* Status System Badge */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-zinc-300">Live Gateway</span>
        </div>
      </div>
    </header>
  );
};
