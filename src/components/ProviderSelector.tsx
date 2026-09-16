import React from 'react';
import type { PaymentProvider } from '../types/payment';

interface ProviderSelectorProps {
  providers: PaymentProvider[];
  selectedProvider: PaymentProvider | null;
  onSelectProvider: (provider: PaymentProvider) => void;
}

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  providers,
  selectedProvider,
  onSelectProvider,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-zinc-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Pilih Gateway Provider
        </label>
        <span className="text-xs text-zinc-400">Multi-gateway routing</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {providers.map((provider) => {
          const isSelected = selectedProvider?.id === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => onSelectProvider(provider)}
              className={`group relative p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer overflow-hidden ${isSelected
                  ? 'bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border-indigo-500/80 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{provider.logo}</span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${isSelected
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                >
                  {provider.badge}
                </span>
              </div>

              <div className="font-medium text-zinc-100 text-sm">{provider.name}</div>
              <div className="text-xs text-zinc-400 mt-1 line-clamp-1">{provider.tagline}</div>

              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Fee</span>
                <span className="font-semibold text-zinc-200">
                  {provider.feePercentage}% + Rp {provider.fixedFee.toLocaleString('id-ID')}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

