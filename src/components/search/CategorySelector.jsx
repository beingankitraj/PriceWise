import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

export default function PriceCard({ result, isCheapest, rank, currencySymbol }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:bg-zinc-800/50
      ${isCheapest ? 'bg-emerald-950/30 border-emerald-800' : 'bg-zinc-900/50 border-zinc-800'}
    `}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
          ${isCheapest ? 'bg-emerald-500 text-black' : 'bg-zinc-700 text-zinc-300'}
        `}>
          {rank}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white truncate">{result.merchant}</span>
            {isCheapest && (
              <span className="text-[10px] font-bold bg-emerald-500 text-black px-2 py-0.5 rounded uppercase">Cheapest</span>
            )}
          </div>
          <p className="text-sm text-zinc-500 truncate">{result.name}</p>
          {result.rating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              <span className="text-xs text-zinc-400">{result.rating}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <p className={`text-xl font-bold ${isCheapest ? 'text-emerald-400' : 'text-white'}`}>
            {currencySymbol}{result.price.toLocaleString()}
          </p>
        </div>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}