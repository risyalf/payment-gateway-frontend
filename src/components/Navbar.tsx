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
    <header className="border-b border-zinc-800/80 bg-zinc-950/75 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            ⚡
          </div>
          <div>
            <div className='flex flex-col sm:flex-row'>
              <div className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
                AlrisPay
              </div>
              <div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/90 text-center justify-center flex text-indigo-300 border border-zinc-700">GATEWAY</span>
              </div>
            </div>
            <div className="text-[11px] text-zinc-400 hidden sm:block -mt-0.5">
              Modern Payment Gateway System
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl">
          <button
            type="button"
            onClick={() => onTabChange('checkout')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer
               ${activeTab === 'checkout'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
          >
            <span>💳</span>
            <span className='hidden sm:block'>Checkout</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('status')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${activeTab === 'status'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
          >
            <span>📊</span>
            <span className="hidden sm:block">Status Transaksi</span>
            {transactionCount > 0 && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'status'
                  ? 'bg-indigo-800 text-white'
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
          <span className="font-medium text-zinc-300">Sandbox Operational</span>
        </div>
      </div>
    </header>
  );
};

