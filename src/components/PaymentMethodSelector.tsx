import React from 'react';
import type { PaymentMethod } from '../types/payment';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-zinc-200">
          Metode Pembayaran
        </label>
        <span className="text-xs text-zinc-400">Pilih salah satu kanal</span>
      </div>

      <div className="space-y-2.5">
        {methods.map((method) => {
          const isSelected = selectedMethod?.id === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method)}
              className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${isSelected
                  ? 'bg-zinc-800/80 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-zinc-900/40 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/80'
                }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all ${isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-800 border-zinc-700/60 group-hover:border-zinc-600'
                    }`}
                >
                  {method.icon}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-100 text-sm">{method.name}</span>
                    {method.isPopular && (
                      <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        Populer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{method.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-2">
                <span className="text-[11px] text-zinc-500 hidden sm:inline-block font-mono">
                  {method.estimatedTime}
                </span>

                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected
                      ? 'border-emerald-500 bg-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-zinc-700 bg-zinc-800 group-hover:border-zinc-600'
                    }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-zinc-950"></div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
