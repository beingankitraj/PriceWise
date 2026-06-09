import React from 'react';
import { Trophy, ExternalLink, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheapestDeal({ result, currencySymbol, savings }) {
  if (!result) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-950 to-zinc-900 border border-emerald-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-bold text-white">Best Deal Found</h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-zinc-400 text-sm mb-1">{result.name}</p>
          <p className="text-white font-semibold text-lg">{result.merchant}</p>
          {savings > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                Save {currencySymbol}{savings.toLocaleString()} vs highest price
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Price</p>
            <p className="text-3xl font-black text-emerald-400">
              {currencySymbol}{result.price.toLocaleString()}
            </p>
          </div>
          <Button
            onClick={() => window.open(result.url, '_blank')}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-12 px-6"
          >
            Buy Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}