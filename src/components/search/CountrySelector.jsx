import React from 'react';

const countries = [
  { id: 'us', name: 'USA', flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { id: 'uk', name: 'UK', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
  { id: 'in', name: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹' },
  { id: 'de', name: 'Germany', flag: '🇩🇪', currency: 'EUR', symbol: '€' },
  { id: 'jp', name: 'Japan', flag: '🇯🇵', currency: 'JPY', symbol: '¥' },
  { id: 'au', name: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },
  { id: 'ca', name: 'Canada', flag: '🇨🇦', currency: 'CAD', symbol: 'C$' },
  { id: 'ae', name: 'UAE', flag: '🇦🇪', currency: 'AED', symbol: 'د.إ' },
];

export default function CountrySelector({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {countries.map((country) => {
        const isSelected = selected === country.id;
        return (
          <button
            key={country.id}
            onClick={() => onSelect(country.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border
              ${isSelected 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
              }
            `}
          >
            <span className="text-base">{country.flag}</span>
            <span className="font-medium">{country.name}</span>
            <span className="text-xs opacity-60">{country.currency}</span>
          </button>
        );
      })}
    </div>
  );
}

export { countries };