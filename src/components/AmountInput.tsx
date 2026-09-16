import React from 'react';

interface AmountInputProps {
  formattedAmount: string;
  rawAmount: number;
  onAmountChange: (val: string) => void;
  onSelectPreset: (amount: number) => void;
}

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

export const AmountInput: React.FC<AmountInputProps> = ({
  formattedAmount,
  rawAmount,
  onAmountChange,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-zinc-200">
          Nominal Pembayaran
        </label>
        <span className="text-xs text-zinc-400">Min. Rp 10.000</span>
      </div>

      <div className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800 p-2 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <div className="flex items-center px-3 py-1.5">
          <span className="text-zinc-400 text-lg font-bold select-none pr-3 border-r border-zinc-800">
            IDR
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={formattedAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-2xl font-bold text-zinc-100 pl-3 focus:outline-none placeholder-zinc-600"
          />
        </div>
      </div>

      {/* Preset Amount Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-zinc-400 mr-1">Nominal Cepat:</span>
        {PRESET_AMOUNTS.map((amt) => {
          const isSelected = rawAmount === amt;
          const label =
            amt >= 1000000
              ? `${amt / 1000000} Jt`
              : `${amt / 1000} Rb`;

          return (
            <button
              key={amt}
              type="button"
              onClick={() => onSelectPreset(amt)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white'
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

